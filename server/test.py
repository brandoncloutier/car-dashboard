import asyncio
import websockets
import json
import signal
import time
import random

PORT = 8765

connected_clients = dict()        # {websocket -> set of resources}
resources_watchlist = dict()      # {resource -> set of websockets}
mock_resources = ["RPM", "SPEED", "COOLANT_TEMP"]

# Store values and direction for each resource
resource_state = {
    "RPM": {
        "value": 0,
        "direction": 1
    },
    "SPEED": {
        "value": 0,
        "direction": 1
    },
    "COOLANT_TEMP": {
        "value": 70  # base coolant temperature
    }
}


async def fake_obd_value_generator():
    while True:
        await asyncio.sleep(0.05)  # 20 Hz update
        now = int(time.time() * 1000)

        # --- RPM Simulation: bounce between 0 and 7000 ---
        rpm = resource_state["RPM"]["value"]
        rpm += resource_state["RPM"]["direction"] * random.uniform(100, 300)
        if rpm >= 7000:
            rpm = 7000
            resource_state["RPM"]["direction"] = -1
        elif rpm <= 0:
            rpm = 0
            resource_state["RPM"]["direction"] = 1
        resource_state["RPM"]["value"] = rpm

        # --- SPEED Simulation: bounce between 0 and 160 ---
        speed = resource_state["SPEED"]["value"]
        speed += resource_state["SPEED"]["direction"] * random.uniform(1.0, 3.0)
        if speed >= 160:
            speed = 160
            resource_state["SPEED"]["direction"] = -1
        elif speed <= 0:
            speed = 0
            resource_state["SPEED"]["direction"] = 1
        resource_state["SPEED"]["value"] = speed

        # --- COOLANT TEMP Simulation: stabilize around 90°C ---
        coolant = resource_state["COOLANT_TEMP"]["value"]
        if coolant < 90:
            coolant += random.uniform(0.1, 0.3)
        elif coolant > 95:
            coolant -= random.uniform(0.05, 0.2)
        else:
            coolant += random.uniform(-0.05, 0.05)
        coolant = max(60, min(coolant, 100))
        resource_state["COOLANT_TEMP"]["value"] = coolant

        # --- Broadcast all updates to watching clients ---
        for resource in mock_resources:
            clients = resources_watchlist.get(resource, set())
            if not clients:
                continue

            message = {
                "type": "obd_value",
                "resource": resource,
                "value": round(resource_state[resource]["value"], 1),
                "date": now
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
