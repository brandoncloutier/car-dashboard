import asyncio
import websockets
import json
import signal
import random

PORT = 8765

connected_clients = dict()        # {websocket -> set of resources}
resources_watchlist = dict()      # {resource -> set of websockets}
mock_resources = ["RPM", "SPEED", "COOLANT_TEMP"]

rpm_value = 700                   # Starting RPM
rpm_direction = 1                # 1 means revving up, -1 means revving down


async def fake_obd_value_generator():
    global rpm_value, rpm_direction

    while True:
        await asyncio.sleep(0.05)  # 20 Hz updates for smoothness

        # Simulate revving logic
        if rpm_direction == 1:
            rpm_value += 100
            if rpm_value >= 6000:
                rpm_direction = -1
        else:
            rpm_value -= 100
            if rpm_value <= 700:
                rpm_direction = 1

        # Send mock OBD values
        for resource, clients in resources_watchlist.items():
            if not clients:
                continue

            if resource == "RPM":
                value = rpm_value
            elif resource == "SPEED":
                value = round(random.uniform(0, 80), 1)
            elif resource == "COOLANT_TEMP":
                value = round(random.uniform(80, 100), 1)
            else:
                continue

            message = {
                "type": "obd_value",
                "resource": resource,
                "value": value
            }

            for client in clients.copy():
                try:
                    await client.send(json.dumps(message))
                except Exception as e:
                    print(f"Error sending to client {client}: {e}")


async def watch(websocket):
    print(f"Client connected: {websocket.remote_address}")

    try:
        async for message in websocket:
            request = json.loads(message)
            action = request.get("action")
            resources = request.get("resources", [])

            if action == "add":
                connected_clients.setdefault(websocket, set()).update(resources)
                for resource in resources:
                    resources_watchlist.setdefault(resource, set()).add(websocket)

            elif action == "del":
                for resource in resources:
                    connected_clients[websocket].discard(resource)
                    if resource in resources_watchlist:
                        resources_watchlist[resource].discard(websocket)
                        if not resources_watchlist[resource]:
                            del resources_watchlist[resource]

            await websocket.send(json.dumps({
                "type": "acknowledgment",
                "action": action,
                "status": "success",
                "resources": resources,
                "message": f"Resources {action}ed successfully"
            }))

    except websockets.exceptions.ConnectionClosed:
        print(f"Client disconnected: {websocket.remote_address}")
    finally:
        if websocket in connected_clients:
            for resource in connected_clients[websocket]:
                if resource in resources_watchlist:
                    resources_watchlist[resource].discard(websocket)
                    if not resources_watchlist[resource]:
                        del resources_watchlist[resource]
            del connected_clients[websocket]


async def main():
    print(f"Mock server starting on ws://localhost:{PORT}")
    server = await websockets.serve(watch, "localhost", PORT, ping_interval=30, ping_timeout=10)

    loop = asyncio.get_running_loop()
    loop.add_signal_handler(signal.SIGINT, server.close)
    loop.add_signal_handler(signal.SIGTERM, server.close)

    await asyncio.gather(server.wait_closed(), fake_obd_value_generator())


if __name__ == "__main__":
    asyncio.run(main())
