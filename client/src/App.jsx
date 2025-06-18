import { useState, useEffect, useCallback, useRef, use } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './App.css'
import { RadialGauge } from 'canvas-gauges';
import { useWebSocketContext } from './contexts/WebSocketContext';
import { useSelector } from 'react-redux';

const RPMData = () => {
  const { watchResource, unwatchResource } = useWebSocketContext()
  useEffect(() => {
    watchResource("RPM")
    return () => unwatchResource("RPM");
  }, [watchResource, unwatchResource])

  const rpm = useSelector((state) => state.resources?.resources_data?.["RPM"] ?? 0)
  return (
    <div className='text-4xl'>{rpm}</div>
  )

}
function App() {
  return (
    <RPMData />
  )
}

export default App
