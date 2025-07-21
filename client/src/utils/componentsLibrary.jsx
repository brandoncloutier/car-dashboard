import SpeedComponent from "../components/ComponentLibrary/Engine/SpeedComponent";
import RPMComponent from "../components/ComponentLibrary/Engine/RPMComponent";
import SpeedChartComponent from "../components/ComponentLibrary/Engine/SpeedChartComponent";
import RPMChartComponent from "../components/ComponentLibrary/Engine/RPMChartComponent";

export const componentLibrary = [
  { id: "engine/speed", category: "engine", name: "Speed", resource: "SPEED", component: <SpeedComponent resource={"SPEED"}/> },
  { id: "engine/speed/chart", category: "engine", name: "Speed Chart", resource: "SPEED", component: <SpeedChartComponent resource={"SPEED"}/> },
  { id: "engine/rpm", category: "engine", name: "Rpm", resource: "RPM", component: <RPMComponent resource={"RPM"}/> },
  { id: "engine/rpm/chart", category: "engine", name: "RPM Chart", resource: "RPM", component: <RPMChartComponent resource={"RPM"}/> },
  { id: "media/player", category: "media", name: "Media Player", resource: "", component: <div>Media Player</div> }
]

export const categorizedComponentLibrary = componentLibrary.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
  return acc;
}, {});

export const componentMap = componentLibrary.reduce((acc, item) => {
  acc[item.id] = item.component
  return acc
}, {})

export default { componentLibrary, categorizedComponentLibrary, componentMap }