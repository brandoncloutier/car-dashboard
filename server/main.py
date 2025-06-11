import obd
import asyncio
import websockets
import json
from utils import log, error

PORT = 8765

connection = None
connected_clients = dict() # {client -> [resource set]}
resources_watchlist = dict() # {resource -> [client set]}
types = ["add", "del"]

obd_command_lookup = {
    "RPM": obd.commands.RPM
}

async def send_to_client(response):
    # We get a response from the OBD adapter
    # Get the command type and look in the resource watchlist. For all of the clients that are watching the resource broadcast a message to their websocket
    log(response)
    log(response.value)

async def watch(websocket):
    global connection
    global connected_clients
    global resources_watchlist

    print(f"Client connected: {websocket.remote_address}")

    # Send connected message to the client

    try:
      # This for loop will catch every message received from the client after the connection has been established
      async for message in websocket:
          # Loading the request data from the message
          request = json.loads(message)

          # Getting the action and resources array from the request
          action = request.get("action")
          resources = request.get("resources")

          """
          If the action is add that means we need to add it to the OBD watchlist.
          The resource can be added to the watchlist by using the connection.watch() method. It takes in the commands/resource to watch
          and also a callback function. In this call back function we want to process the watch update and send it back to corresponding clients
          """
          if action == "add":
            # Add the client to the connected_clients if this is their first connection
            if websocket not in connected_clients:
                connected_clients[websocket] = set()
            
            # Add their new desired resources to the connected_clients resources set
            connected_clients[websocket].update(resources)

            # Finds what new resources are wanted to be watched from the already watched resources list
            # These are the resources that we need to start the connection.watch method on
            new_resources = set(resources) - set(resources_watchlist.keys())
            for resource in resources:
                if resource not in resources_watchlist:
                    resources_watchlist[resource] = set()

                resources_watchlist[resource].add(websocket)

            print(connected_clients)
            print(resources_watchlist)


            log(f"Starting to watch Resources: {new_resources}")
            # with connection.paused():
            #     for resource in new_resources:
            #         connection.watch(obd_command_lookup[resource], callback=send_to_client)

          elif action == "del":
            log(f"Removing watch on Resources: {resources}")
            # Remove the desired delete resource from the connected_clients resource array
            resources_to_unwatch = []
            for resource in resources:
                connected_clients[websocket].discard(resource)
                resources_watchlist[resource].discard(websocket)
                
                # If no more clients are watching the resource then lets add it to the awating_removal array
                if len(resources_watchlist[resource]) == 0:
                    resources_to_unwatch.append(resource)
                    del resources_watchlist[resource]

            print("awaiting removal", resources_to_unwatch)

            if len(connected_clients[websocket]) == 0:
                del connected_clients[websocket]

            log(f"Starting to unwatch Resources: {resources_to_unwatch}")
            # with connection.paused():
            #     for resource in resources_awaiting_removal:
            #         connection.unwatch()

                
            
            print(connected_clients)
            print(resources_watchlist)
            

            # Remove the client from the resources_watchlist

            # If the resource is empty meaning there are no more clients that are watching it then add it to the stop_watching_resources array
            # Now stop the watch for these resources

            # If there is no more message sent between the client and the server the client will automatically be removed from the websocket based on the configured time intervals

          await websocket.send("Message Received")
    except websockets.exceptions.ConnectionClosed:
        print(f"Client disconnected: {websocket.remote_address}")
    finally:
        pass

async def main():
    # global connection
    # connection = obd.Async("/dev/tty.usbserial-10")

    # if not connection.is_connected():
    #     error("No response from OBD")
    #     return

    # log("Connected to car")

    log(f"Starting WebSocket server on ws://localhost:{PORT}")
    async with websockets.serve(
        watch, "localhost", PORT, ping_interval=20, ping_timeout=5
    ):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
