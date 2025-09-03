import { useEffect } from "react"
import { Navigation } from "lucide-react"

const ActionButtons = ({ handleResetCenter, mapCentered }) => {
  return (
    <div className="absolute bottom-10 left-5">
      {mapCentered === false ? <button className="bg-white rounded-full p-2 flex justify-center items-center hover:cursor-pointer border-blue-500 border-2" onClick={handleResetCenter}><Navigation className="h-8 w-8 text-blue-500" /></button> : null}
    </div>
  )
}

export default ActionButtons