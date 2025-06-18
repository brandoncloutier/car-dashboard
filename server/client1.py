import asyncio
import websockets
import json
import signal
import sys

async def receive_messages(websocket, message_queue):
    while True:
        try:
            response_raw = await websocket.recv()
            try:
                data = json.loads(response_raw)
                await message_queue.put(data)
            except json.JSONDecodeError:
                await message_queue.put({"type": "non_json", "raw": response_raw})
        except websockets.exceptions.ConnectionClosed:
            await message_queue.put({"type": "disconnect"})
            break

async def test_client(graceful=True):
    uri = "ws://localhost:8765"
    message_queue = asyncio.Queue()

    websocket = await websockets.connect(uri)

    # Background task to receive messages
    asyncio.create_task(receive_messages(websocket, message_queue))

    request_add = {
        "action": "add",
        "resources": ["RPM", "SPEED"]
    }
    request_del = {
        "action": "del",
        "resources": ["RPM", "SPEED"]
    }

    print("\nConnected to WebSocket server.")
    print("Sending ADD request...")
    await websocket.send(json.dumps(request_add))

    async def live_output():
        while True:
            msg = await message_queue.get()
            if msg.get("type") == "disconnect":
                print("🔌 Server closed the connection.")
                break
            print(f"📥 Server: {msg}")

    asyncio.create_task(live_output())

    await asyncio.sleep(5)

    print("\nSending DEL request...")
    await websocket.send(json.dumps(request_del))

    print("\nRunning idle... Press Ctrl+C to test disconnect.")
    
    try:
        await asyncio.Future()
    except asyncio.CancelledError:
        pass
    finally:
        if graceful:
            print("Closing connection gracefully...")
            await websocket.close()
        else:
            print("Simulating abrupt disconnect (no .close())")
        print("Client shutdown complete.")

def main():
    graceful = input("Test graceful disconnect? (y/n): ").strip().lower() == "y"

    def handle_sigint():
        for task in asyncio.all_tasks():
            task.cancel()

    loop = asyncio.get_event_loop()
    loop.add_signal_handler(signal.SIGINT, handle_sigint)

    try:
        loop.run_until_complete(test_client(graceful=graceful))
    except KeyboardInterrupt:
        print("\nCaught KeyboardInterrupt")
    finally:
        print("Client process exiting.")

if __name__ == "__main__":
    main()
