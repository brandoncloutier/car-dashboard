import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

const SearchInput = ({ apiKey, setDestination, setNavigationStep }) => {
  const [value, setValue] = useState("");
  const [preds, setPreds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);
  const serviceRef = useRef(null);
  const placesRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const debounceIdRef = useRef(null);

  // Inline Google Maps Places loader (cached globally)
  const ensureGoogleMaps = () => {
    if (typeof window === "undefined") return Promise.resolve();
    if (window.google && window.google.maps && window.google.maps.places) {
      return Promise.resolve();
    }
    if (!window.__gmapsPromise) {
      const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
      window.__gmapsPromise = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    return window.__gmapsPromise;
  }

  // init services once
  useEffect(() => {
    let mounted = true;
    ensureGoogleMaps()
      .then(() => {
        if (!mounted) return;
        serviceRef.current = new window.google.maps.places.AutocompleteService();
        placesRef.current = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );
        sessionTokenRef.current =
          new window.google.maps.places.AutocompleteSessionToken();
      })
      .catch((e) => console.error("Google Maps failed to load:", e));
    return () => {
      mounted = false;
    };
  }, [apiKey]);

  // click-outside to close
  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // debounce + fetch predictions
  useEffect(() => {
    if (!serviceRef.current) return;

    if (debounceIdRef.current) clearTimeout(debounceIdRef.current);
    debounceIdRef.current = setTimeout(() => {
      const input = value.trim();
      if (!input) {
        setPreds([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      serviceRef.current.getPlacePredictions(
        {
          input,
          sessionToken: sessionTokenRef.current,
          // types: ["geocode"], // uncomment to restrict to addresses
          // componentRestrictions: { country: "us" },
        },
        (results) => {
          setPreds(results || []);
          setOpen(true);
          setLoading(false);
        }
      );
    }, 250);

    return () => {
      if (debounceIdRef.current) clearTimeout(debounceIdRef.current);
    };
  }, [value]);

  const handleClear = () => {
    setValue("");
    setPreds([]);
    setOpen(false);
    if (window.google?.maps?.places) {
      sessionTokenRef.current =
        new window.google.maps.places.AutocompleteSessionToken();
    }
  };

  const handleSelectPrediction = (p) => {
    setOpen(false);
    if (!placesRef.current) return;

    placesRef.current.getDetails(
      {
        placeId: p.place_id,
        sessionToken: sessionTokenRef.current,
        fields: [
          "place_id",
          "name",
          "formatted_address",
          "geometry.location",
          "geometry.viewport",
          "types",
          "url",
          "website",
          "rating",
          "user_ratings_total",
          "opening_hours",
          "formatted_phone_number",
          "address_components",
          "icon",
          "icon_background_color",
        ],
      },
      (place, status) => {
        const OK = window.google.maps.places.PlacesServiceStatus.OK;
        if (status !== OK || !place || !place.geometry?.location) return;

        const loc = place.geometry.location;
        const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
        const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;

        // Extract viewport (if present)
        const vp = place.geometry.viewport;
        const viewport = vp
          ? {
            west: vp.getWest ? vp.getWest() : vp.west,
            south: vp.getSouth ? vp.getSouth() : vp.south,
            east: vp.getEast ? vp.getEast() : vp.east,
            north: vp.getNorth ? vp.getNorth() : vp.north,
          }
          : null;

        // Build a rich destination object
        const destination = {
          // core
          longitude: lng,
          latitude: lat,

          // identity
          placeId: place.place_id,
          name: place.name || "",
          description: p.description || place.formatted_address || "", // fallbacks
          address: place.formatted_address || "",
          address_components: place.address_components || [],

          // extras for a nice card
          types: place.types || [],
          rating: place.rating ?? null,
          user_ratings_total: place.user_ratings_total ?? null,
          phone: place.formatted_phone_number || null,
          website: place.website || null,
          google_url: place.url || null,
          icon: place.icon || null,
          icon_background_color: place.icon_background_color || null,
          opening_hours: place.opening_hours
            ? {
              open_now: place.opening_hours.isOpen ? place.opening_hours.isOpen() : place.opening_hours.isOpen,
              weekday_text: place.opening_hours.weekday_text || null,
            }
            : null,

          // camera helpers
          viewport, // can use to fitBounds if you want
        };

        setDestination(destination);
        setNavigationStep("confirmDestination");
      }
    );
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 z-10" />

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => value && setOpen(true)}
        className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all duration-300 hover:bg-white/15 hover:border-white/30 shadow-lg font-medium"
        placeholder="Search anything..."
        autoComplete="off"
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all duration-200 p-1.5 rounded-full hover:bg-white/20 backdrop-blur-sm"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {open && (preds.length > 0 || loading) && (
        <div className="absolute z-50 mt-3 w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
          {loading && (
            <div className="px-4 py-3 text-sm text-slate-500 font-medium">
              Searching…
            </div>
          )}
          {!loading &&
            preds.map((p) => (
              <button
                key={p.place_id}
                onClick={() => handleSelectPrediction(p)}
                className="w-full text-left px-4 py-3 hover:bg-white/20 transition-all duration-200 text-sm border-b border-white/10 last:border-b-0 group"
              >
                <div className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                  {p.structured_formatting?.main_text || p.description}
                </div>
                <div className="text-slate-500 text-xs mt-1 group-hover:text-slate-600 transition-colors">
                  {p.structured_formatting?.secondary_text}
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput