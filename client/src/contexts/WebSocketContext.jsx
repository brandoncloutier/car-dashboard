import { createContext, useEffect, useState, useContext, useCallback } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useDispatch } from 'react-redux'

import { updateData } from "../features/resources/resourecesSlice";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const socketUrl = import.meta.env.VITE_SERVER_WS_URL;
  const [resourcesTimeSinceLastUpdate, setResourcesTimeSinceLastUpdate] = useState({})

  const dispatch = useDispatch()

  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
    share: true
  });

  const throttleInterval = 50;

  useEffect(() => {
    if (lastJsonMessage === null) return

    if (lastJsonMessage.type === "obd_value") {
      const now = Date.now()
      if (now - (resourcesTimeSinceLastUpdate[lastJsonMessage.resource] || 0) > throttleInterval) {
        // Dispatch value update in the redux store
        setResourcesTimeSinceLastUpdate((prev) => {
          return {
            ...prev,
            [lastJsonMessage.resource]: now
          }
        })
        dispatch(updateData({ resource: lastJsonMessage.resource, value: lastJsonMessage.value, date: lastJsonMessage.date}))
      }
    } else {
      console.log("NOT OBD VALUE")
    }
  }, [lastJsonMessage])

  const watchResource = useCallback((resource) => {
    sendJsonMessage({
      "action": "add",
      "resources": [resource]
    })
  }, [])

  const unwatchResource = useCallback((resource) => {
    sendJsonMessage({
      "action": "del",
      "resources": [resource]
    })
  }, [])

  const value = {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
    watchResource,
    unwatchResource
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocketContext = () => useContext(WebSocketContext);