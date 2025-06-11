import asyncio
import websockets
import json

async def test_client():
    uri = "ws://localhost:8765"
    async with websockets.connect(uri) as websocket:
        request_1 = {
            "action": "add",
            "resources": ["SPEED"]
        }
        request_2 = {
            "action": "del",
            "resources": ["SPEED"]
        }
        while True:
            input("Press enter")
            await websocket.send(json.dumps(request_1))
            response = await websocket.recv()
            print(f"Received from server: {response}")
            input("Press enter")
            await websocket.send(json.dumps(request_2))
            response = await websocket.recv()
            print(f"Received from server: {response}")

if __name__ == "__main__":
  asyncio.run(test_client())