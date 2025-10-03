# Car Dashboard

A custom-built **automotive infotainment and real-time telemetry dashboard** that integrates **live OBD-II vehicle data, Mapbox-based navigation, music playback controls, and smart widgets** into a modular, customizable interface.  

This project blends **IoT, web technologies, and embedded systems** to create a polished, interactive driving experience.

---

## 🚗 Features

- **Real-Time OBD-II Data**
  - Displays RPM, speed, coolant temperature, fuel level, and more
  - Live streaming charts and radial gauges for continuous telemetry
  - Built using WebSockets for low-latency updates

- **Interactive Dashboard UI**
  - Drag-and-drop grid layout powered by `dnd-kit`
  - Snap-to-grid positioning for widgets
  - Dark/Light theme and dynamic styling with TailwindCSS
  - Modular widget system (speed, RPM, maps, music, etc.)

- **Navigation**
  - Mapbox GL JS integration
  - GPS-based tracking with `watchPosition`
  - Map matching + turn-by-turn routing (Directions API)

- **Music & Media**
  - Spotify and Heos (Denon) integration for playback control
  - Media widget with play/pause, skip, and volume adjustments

- **Custom Components**
  - Radial gauges (for RPM & speed)
  - Streaming charts with Chart.js + Luxon
  - Address validation with Google Maps
  - Responsive UI designed for both small displays (like in-car tablets) and desktop view

---

## 🛠️ System Architecture

The system follows a **hybrid client-server model**:

- **Frontend**
  - Built with **React + Redux + TailwindCSS**
  - Grid-based component library with resizable/movable widgets
  - State management for syncing OBD data, user settings, and media playback

- **Backend**
  - Node.js/Express server
  - WebSocket service for streaming OBD-II data
  - API endpoints for map routing and third-party integrations
  - Authentication and user session handling

- **OBD-II Integration**
  - Raspberry Pi connected to vehicle OBD-II port
  - Python WebSocket client reads ECU data using `python-OBD`
  - Streams real-time data to the server and front-end

- **External APIs**
  - **Mapbox** for maps, directions, and route planning
  - **Spotify / Heos API** for music control
  - **Google Maps API** for address validation

---

## 🎯 Roadmap

- [ ] Add weather widget with live API
- [ ] Expand ECU parameter coverage (oil temp, intake pressure, etc.)
- [ ] Native mobile support with React Native

---

## 📸 Screenshots
![dashboard screenshot](/github-images/cardashboard.png)
---

## 🧑‍💻 Author

**Brandon Cloutier**  
Full-Stack Software Engineer | IoT & Automotive Enthusiast
