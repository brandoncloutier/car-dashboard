// import { useState, useEffect, useCallback, useRef } from 'react'
// import useWebSocket, { ReadyState } from 'react-use-websocket';
// import './App.css'
// import { RadialGauge } from 'canvas-gauges';

// function App() {
//   const socketUrl = "ws://localhost:8765";
//   const [resourceValues, setResourceValues] = useState({
//     "RPM": { value: 0, lastUpdate: 0 },
//     "SPEED": { value: 0, lastUpdate: 0 }
//   })

//   const {
//     sendJsonMessage,
//     lastJsonMessage,
//     readyState
//   } = useWebSocket(socketUrl, {
//     onOpen: () => console.log('opened'),
//     //Will attempt to reconnect on all close events, such as server shutting down
//     shouldReconnect: (closeEvent) => true,
//     share: true
//   });
//   const throttleInterval = 50;

//   useEffect(() => {
//     if (lastJsonMessage === null) return

//     if (lastJsonMessage.type === "obd_value") {
//       const now = Date.now()
//       if (now - resourceValues[lastJsonMessage.resource].lastUpdate > throttleInterval) {
//         gaugeRef.current.value = lastJsonMessage.value
//         setResourceValues((prev) => {
//           return {
//             ...prev,
//             [lastJsonMessage.resource]: { value: lastJsonMessage.value, lastUpdate: now }
//           }
//         })
//       }
//     } else {
//       console.log("NOT OBD VALUE")
//     }

//   }, [lastJsonMessage]);

//   const handleClickSendMessage = useCallback(() => sendJsonMessage({
//     "action": "add",
//     "resources": ["RPM"]
//   }), []);

//   const connectionStatus = {
//     [ReadyState.CONNECTING]: 'Connecting',
//     [ReadyState.OPEN]: 'Open',
//     [ReadyState.CLOSING]: 'Closing',
//     [ReadyState.CLOSED]: 'Closed',
//     [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
//   }[readyState];

//   const gaugeRef = useRef(null)

//   useEffect(() => {
//     gaugeRef.current = new RadialGauge({
//       renderTo: 'gauge-id',
//       width: 200,
//       height: 200,
//       value: 0,
//       animation: true,
//       animationDuration: 200,
//       minValue: 0,
//       maxValue: 8000,
//       majorTicks: ['0', '2000', '4000', '6000', '8000'],
//     });
//     gaugeRef.current.draw();
//   }, []);

//   return (
//     <div className="flex flex-col">
//       <button
//         onClick={handleClickSendMessage}
//         disabled={readyState !== ReadyState.OPEN}
//       >
//         Click Me to connect'
//       </button>
//       <span>The WebSocket is currently {connectionStatus}</span>
//       <div className='text-4xl'>RPM: {resourceValues["RPM"].value}</div>
//       <div className='text-4xl'>SPEED: {resourceValues["SPEED"].value}</div>
//       <div className="flex">
//         <canvas id="gauge-id" />
//       </div>


//     </div>
//   )
// }

// export default App
