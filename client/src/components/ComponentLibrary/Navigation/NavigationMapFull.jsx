import React from "react"
import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { Navigation, Search, X, ArrowLeft, MapPin, Star, Phone, ExternalLink } from "lucide-react";

import 'mapbox-gl/dist/mapbox-gl.css';

const NavigationMapFull = () => {
  const INITIAL_ZOOM = 17.5
  const [currentLocation, setCurrentLocation] = useState(null)
  const [currentLocationLoaded, setCurrentLocationLoaded] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapCentered, setMapCentered] = useState(true)
  const [navigationStep, setNavigationStep] = useState("search")
  const [destination, setDestination] = useState(null)
  const [tripInstructions, setTripInstructions] = useState(null)

  const mapRef = useRef(null)
  const followRef = useRef(true)
  const mapContainerRef = useRef(null)
  const userMarkerRef = useRef(null)
  const mapResizerInterval = useRef(null)
  
  return (
    <div className="h-full w-full">Full Navigation Map</div>
  )
}

export default NavigationMapFull