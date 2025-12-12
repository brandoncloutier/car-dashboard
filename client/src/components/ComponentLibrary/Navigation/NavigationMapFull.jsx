import React from "react"
import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { Navigation, Search, X, ArrowLeft, MapPin, Star, Phone, ExternalLink } from "lucide-react";

import 'mapbox-gl/dist/mapbox-gl.css';

// COMPONENTS
import ActionButtons from "./ActionButtons";
import SearchInput from "./SearchInput";
import ConfirmDestination from "./ConfirmDestination";
import Directions from "./Directions";

const NavigationMapFull = () => {
  const INITIAL_ZOOM = 17
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

  useEffect(() => {
    if (currentLocationLoaded === false) return

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [currentLocation.longitude, currentLocation.latitude],
      zoom: INITIAL_ZOOM
    });

    mapRef.current.on("load", () => {
      // create a custom DOM element for the user location
      const el = document.createElement("div");
      el.className = "user-dot";

      userMarkerRef.current = new mapboxgl.Marker({
        element: el,
        anchor: "center"
      })
        .setLngLat([currentLocation.longitude, currentLocation.latitude])
        .addTo(mapRef.current);

      setIsMapLoaded(true)
    });

    mapRef.current.on("movestart", (e) => {
      if (e.originalEvent) {
        setMapCentered(false)
      }
    })

    return () => {
      mapRef.current.remove()
    }

  }, [currentLocationLoaded])

  useEffect(() => {
    followRef.current = mapCentered;
  }, [mapCentered]);

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
    const success = (position) => {
      const { longitude, latitude } = position.coords

      console.log(`Location Received: ${longitude} X ${latitude}`)

      setCurrentLocation({
        longitude,
        latitude
      })
      setCurrentLocationLoaded(true)

      if (userMarkerRef.current) {
        userMarkerRef.current.setLngLat([longitude, latitude]);

        if (followRef.current === true && mapRef.current) {
          mapRef.current.easeTo({
            center: [longitude, latitude],
            duration: 500
          });
        }
      }
    }

    const error = (error) => {
      console.log(error)
    }

    const watchID = navigator.geolocation.watchPosition(success, error, options);

    return () => navigator.geolocation.clearWatch(watchID);
  }, [])

  useEffect(() => {
    if (isMapLoaded) {
      mapContainerRef.current.style.width = navigationStep === "confirmDestination" || navigationStep === "directions" ? "133%" : "100%"
      mapRef.current.resize()
    }
  }, [navigationStep])

  const handleResetCenter = () => {
    mapRef.current.flyTo({
      center: [currentLocation.longitude, currentLocation.latitude],
      zoom: INITIAL_ZOOM
    })
    setMapCentered(true)
  }

  const handleRoute = async (end) => {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${currentLocation.longitude},${currentLocation.latitude};${end.longitude},${end.latitude}?steps=true&geometries=geojson&overview=full&access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`
      )

      const json = await query.json()
      const data = json.routes[0];
      const route = data.geometry;
      const geojson = {
        'type': 'Feature',
        'properties': {},
        'geometry': data.geometry
      };

      if (mapRef.current.getSource('route')) {
        // if the route already exists on the map, reset it using setData
        mapRef.current.getSource('route').setData(geojson);
      } else {
        mapRef.current.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 7,
            'line-opacity': 0.75
          }
        });
      }

      setTripInstructions(data.legs[0].steps)
      setNavigationStep("directions")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Map Container */}
      <div className={`h-full bg-gray-400 transition`} ref={mapContainerRef} style={{ width: "100%" }} />

      {/* Search bar/ Directions */}
      {isMapLoaded ?
        <div className="absolute w-1/3 top-5 left-5">
          {navigationStep === "search" ? <SearchInput apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} setDestination={setDestination} setNavigationStep={setNavigationStep} /> : null}

          {navigationStep === "confirmDestination" ? <ConfirmDestination destination={destination} setDestination={setDestination} setNavigationStep={setNavigationStep} handleRoute={handleRoute} /> : null}

          {navigationStep === "directions" ? <Directions tripInstructions={tripInstructions} setTripInstructions={setTripInstructions} setDestination={setDestination} setNavigationStep={setNavigationStep} /> : null}
        </div>
        :
        null
      }

      {/* Action Buttons */}
      <ActionButtons handleResetCenter={handleResetCenter} mapCentered={mapCentered} />
    </div>
  )
}

export default NavigationMapFull