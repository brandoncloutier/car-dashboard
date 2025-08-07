import SpeedComponent from "../components/ComponentLibrary/Engine/SpeedComponent";
import RPMComponent from "../components/ComponentLibrary/Engine/RPMComponent";
import SpeedChartComponent from "../components/ComponentLibrary/Engine/SpeedChartComponent";
import RPMChartComponent from "../components/ComponentLibrary/Engine/RPMChartComponent";
import FuelComponentLinear from "../components/ComponentLibrary/Engine/FuelComponentLinear";
import FuelComponentRadial from "../components/ComponentLibrary/Engine/FuelComponentRadial";
import CoolantTempComponentRadial from "../components/ComponentLibrary/Engine/CoolantTempComponentRadial";

export const resourceComponentLibrary = [
  { id: "engine/speed/speedometer", category: "engine", name: "Speed", resource: "SPEED", component: <SpeedComponent resource={"SPEED"}/> },
  { id: "engine/speed/chart", category: "engine", name: "Speed Chart", resource: "SPEED", component: <SpeedChartComponent resource={"SPEED"}/> },
  { id: "engine/rpm/speedometer", category: "engine", name: "Rpm", resource: "RPM", component: <RPMComponent resource={"RPM"}/> },
  { id: "engine/rpm/chart", category: "engine", name: "RPM Chart", resource: "RPM", component: <RPMChartComponent resource={"RPM"}/> },
  { id: "engine/fuelLevel/lineargauge", category: "engine", name: "Fuel Level Linear", resource: "FUEL_LEVEL", component: <FuelComponentLinear resource={"FUEL_LEVEL"}/>},
  { id: "engine/fuelLevel/radialguage", category: "engine", name: "Fuel Level Radial", resource: "FUEL_LEVEL", component: <FuelComponentRadial resource={"FUEL_LEVEL"}/>},
  { id: "engine/coolantTemp/radialguage", category: "engine", name: "Coolant Temp Radial", resource: "COOLANT_TEMP", component: <CoolantTempComponentRadial resource={"COOLANT_TEMP"}/>},
  { id: "media/player", category: "media", name: "Media Player", resource: "", component: <div>Media Player</div> },
]

export const categorizedResourceComponentLibrary = resourceComponentLibrary.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
  return acc;
}, {});

export const resourceComponentMap = resourceComponentLibrary.reduce((acc, item) => {
  acc[item.id] = item.component
  return acc
}, {})

export default { resourceComponentLibrary, categorizedResourceComponentLibrary, resourceComponentMap }