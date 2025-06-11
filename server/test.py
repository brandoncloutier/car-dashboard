import asyncio
import websockets
import datetime

# async def hello(websocket):
#   name = await websocket.recv()
#   print(f"server received {name}")
#   greeting = f"hello {name}"

#   await websocket.send(greeting)
#   print(f"Server Sent: {greeting}")

# async def main():
#   async with websockets.serve(hello, "localhost", 8765):
#     await asyncio.Future()

# if __name__ == "__main__":
#   asyncio.run(main())


# Client 1
# Client 2
# Respond: First person -> server record -> send back they are first place 
# Respond: Second person -> record their time -> how after client 1 responded.

# winner = None
# winner_time = None
# async def button_click(websocket):
#   now = datetime.datetime.now()
#   global winner
#   global winner_time
#   client_name = await websocket.recv()
#   print(f"{client_name} clicked the button")

#   if not winner:
#     winner = client_name
#     winner_time = now

#     response = f"{client_name} is first"
#     await websocket.send(response)

#   else:
#     time_difference = now - winner_time
#     response = f"{winner} is the winner. You were slower by {time_difference}"
#     await websocket.send(response)
#     winner = None
#     winner_time = None

# async def main():
#   async with websockets.serve(button_click, "localhost", 8765):
#     await asyncio.Future()


# Empty list to store the connected clients
# clients = []

# async def handle_message(websocket, path):
#   # Using global here allows these variables to persist within this function
#   global clients
#   global fastest_time
#   message = await websocket.recv()
#   if message == "buzz":
#     response_time = asyncio.get_event_loop().time()
#     clients.append([websocket, response_time])
#     if len(clients) == 1:
#       await websockets.send("First place!")
#       fastest_time = response_time
#     else:
#       t = round(response_time - fastest_time, 2)
#       await websocket.send(f"Response time: {t} sec slower")

# async def main():
#    async with websockets.serve(handle_message, "localhost", 8765):
#      await asyncio.Future()

# if __name__ == "__main__":
#   asyncio.run(main())

import asyncio
import websockets

connected_clients = {}

async def echo(websocket, path):
    # Register new client
    connected_clients[websocket] = []
    print(f"Client connected: {websocket.remote_address}, Path: {path}")

    try:
        async for message in websocket:
            print(f"Received from {websocket.remote_address}: {message}")

            # Broadcast to other connected clients
            for client in list(connected_clients.keys()):
                if client != websocket and client.open:
                    await client.send(f"Broadcast from {websocket.remote_address}: {message}")

    except websockets.exceptions.ConnectionClosed as e:
        print(f"Client disconnected: {websocket.remote_address} ({e.code} - {e.reason})")

    finally:
        # Clean up
        connected_clients.pop(websocket, None)
        print(f"Connection cleaned up: {websocket.remote_address}")

async def main():
    print("Starting WebSocket server on ws://localhost:8765")
    async with websockets.serve(
        echo,
        "localhost",
        8765,
        ping_interval=5,   # Send ping every 5s
        ping_timeout=5     # Close connection if no pong in 5s
    ):
        await asyncio.Future()  # Keep server running

if __name__ == "__main__":
    asyncio.run(main())
