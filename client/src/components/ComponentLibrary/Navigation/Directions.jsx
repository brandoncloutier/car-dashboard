import React from "react"

const Directions = ({ tripInstructions, setTripInstructions, setDestination, setNavigationStep }) => {

  const handleEndNavigation = () => {
    setTripInstructions(null)
    setDestination(null)
    setNavigationStep("search")
  }
  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-2xl p-6 space-y-5 overflow-y-scroll">
      <header>
        <h2 className="font-bold text-xl text-gray-900 leading-tight">Navigation</h2>
      </header>

      <div className="text-black">
        {tripInstructions.map((tripInstruction, index) => {
          console.log(tripInstruction)
          return (
            <div key={index}>
              <TripInstruction tripInstruction={tripInstruction} />
            </div>
          )
        })}
      </div>

      <footer className="pt-4">
        <button onClick={handleEndNavigation} className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">End Navigation</button>
      </footer>
    </div>
  )
}

const TripInstruction = ({ tripInstruction }) => {
  return (
    tripInstruction.maneuver.instruction.endsWith(".") ? tripInstruction.maneuver.instruction.slice(0, -1) : tripInstruction.maneuver.instruction
  )
}

export default Directions