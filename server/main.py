import obd
import asyncio
import websockets
import json
import signal
from utils import log, error

PORT = 8765

connection = None
main_loop = None
connected_clients = dict()  # {client -> [resource set]}
resources_watchlist = dict()  # {resource -> [client set]}
types = ["add", "del"]


async def send_to_client_async(obd_response):
    # This function will be executed in the new coroutine and will send the message through the 
    resource = obd_response.command.name
    value = obd_response.value.magnitude
    response_message = {
        "type": "obd_value",
        "resource": resource,
        "value": value
    }

    websocket_clients = resources_watchlist.get(resource, [])
    for websocket in websocket_clients:
        try:
            await websocket.send(json.dumps(response_message))
        except Exception as e:
            error(f"Failed to send to client {websocket}: {e}")

def send_to_client(obd_response):
    # this function can be called in a separate thread from the watch method we need to obtain the asyncio event loop
    # We will then execute the call_soon_threadsafe to ensure no race conditions occur
    # We must pass the asyncio.create_task to lambda because this function returns an execution result and call_soon_threadsafe is 
    # Expecting a reference to a synchronous function to execute. So we use lambda to execute this function for us.
    main_loop.call_soon_threadsafe(
        lambda: asyncio.create_task(send_to_client_async(obd_response))
    )

async def watch(websocket):
    global connection
    global connected_clients
    global resources_watchlist

    print(f"Client connected: {websocket.remote_address}")

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

                log(f"Starting to watch Resources: {new_resources}")

                connection.stop()
                for resource in new_resources:
                    print(f"Adding to watch: {resource}")
                    print(connection)
                    connection.watch(obd.commands[resource], callback=send_to_client)
                connection.start()

                print(connected_clients)
                print(resources_watchlist)

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

                if not connected_clients[websocket]:
                    log("Client is now idle (watching no resources)")

                log(f"Starting to unwatch Resources: {resources_to_unwatch}")

                connection.stop()
                for resource in resources_to_unwatch:
                    connection.unwatch(obd.commands[resource])
                connection.start()

                print(connected_clients)
                print(resources_watchlist)

            response_message = {
                "type": "acknowledgment",
                "action": action,
                "status": "success",
                "resources": resources,
                "message": f"Resources {action}ed successfully"
            }
            await websocket.send(json.dumps(response_message))
    except websockets.exceptions.ConnectionClosed:
        print(f"Client disconnected: {websocket}")
    finally:
        if websocket in connected_clients:
            resources_to_unwatch = []
            for resource in set(connected_clients[websocket]):
                connected_clients[websocket].discard(resource)
                resources_watchlist[resource].discard(websocket)

                # If no more clients are watching the resource then lets add it to the awating_removal array
                if len(resources_watchlist[resource]) == 0:
                    resources_to_unwatch.append(resource)
                    del resources_watchlist[resource]

            print("awaiting removal", resources_to_unwatch)

            del connected_clients[websocket]

            log(f"Starting to unwatch Resources: {resources_to_unwatch}")

            connection.stop()
            for resource in resources_to_unwatch:
                connection.unwatch(obd.commands[resource])
            connection.start()

            print(connected_clients)
            print(resources_watchlist)


async def main():
    global connection
    global main_loop

    # Get and store the main asyncio event loop
    main_loop = asyncio.get_running_loop()

    try:
        # # Connect to OBD adapter (adjust the port if needed)
        connection = obd.Async("/dev/tty.usbserial-10")

        if not connection.is_connected():
            error("No response from OBD")
            return

        log("Connected to car")
        log("Starting OBD connection loop")
        connection.start()

        log(f"Starting WebSocket server on ws://localhost:{PORT}")
        async with websockets.serve(
            watch, "localhost", PORT, ping_interval=30, ping_timeout=10
        ) as ws_server:
            # Keep the server running indefinitely
            loop = asyncio.get_running_loop()
            loop.add_signal_handler(signal.SIGINT, ws_server.close)
            loop.add_signal_handler(signal.SIGTERM, ws_server.close)
            await ws_server.wait_closed()

    finally:
        log("Closing OBD connection")
        if connection:
            connection.stop()


if __name__ == "__main__":
    asyncio.run(main())
