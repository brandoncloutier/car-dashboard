import React from "react"
import { ArrowLeft, MapPin, Star, Phone, ExternalLink } from "lucide-react"

const ConfirmDestination = ({ destination, setDestination, setNavigationStep, handleRoute }) => {
  if (!destination) return null

  const { name, description, address, rating, user_ratings_total, phone, website } = destination

  const handleBackClick = () => {
    setDestination(null)
    setNavigationStep("search")
  }

  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-2xl p-6 space-y-5">
      <button
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 group hover:cursor-pointer"
        onClick={handleBackClick}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
        Back to search
      </button>

      <div className="space-y-3">
        {name && (
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <h2 className="font-bold text-xl text-gray-900 leading-tight">{name}</h2>
          </div>
        )}
        <p className="text-gray-600 text-sm leading-relaxed pl-7">{description || address}</p>
      </div>

      {(rating != null || user_ratings_total != null) && (
        <div className="flex items-center gap-2 pl-7">
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-amber-700">
              {rating != null ? (rating.toFixed ? rating.toFixed(1) : rating) : "—"}
            </span>
          </div>
          {user_ratings_total != null && <span className="text-xs text-gray-500">({user_ratings_total} reviews)</span>}
        </div>
      )}

      {phone && (
        <div className="flex items-center gap-3 pl-7 hover:cursor-pointer text-black">
          <Phone className="w-4 h-4 text-gray-500" />
          <a href={`tel:${phone}`} className="text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">
            {phone}
          </a>
        </div>
      )}

      {website && (
        <div className="flex items-center gap-3 pl-7 hover:cursor-pointer text-black">
          <ExternalLink className="w-4 h-4 text-gray-500" />
          <a
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
            href={website}
            target="_blank"
            rel="noreferrer"
          >
            Visit website
          </a>
        </div>
      )}

      <div className="pt-2">
        <button onClick={() => handleRoute({ longitude: destination.longitude, latitude: destination.latitude })} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl hover:cursor-pointer">
          Start Navigation
        </button>
      </div>
    </div>
  )
}

export default ConfirmDestination