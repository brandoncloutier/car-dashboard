import { useSelector } from "react-redux";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import { useRef, useEffect } from "react";
import { useThemeContext } from "../../../contexts/ThemeContext";
import { LinearGauge } from "canvas-gauges";
import { Fuel } from "lucide-react";

const FuelComponentLinear = ({ resource }) => {
  const { watchResource } = useWebSocketContext();
  const resourceUpdate = useSelector(
    (state) => state.resources.resources_data[resource]
  );

  const componentUUID = useRef(crypto.randomUUID());

  const gaugeRef = useRef(null);
  const wrapperRef = useRef(null);

  const { dark } = useThemeContext()

  useEffect(() => {
    const width = wrapperRef.current.clientWidth - 1;
    const height = wrapperRef.current.clientHeight;

    gaugeRef.current = new LinearGauge({
      renderTo: componentUUID.current,
      width: width,
      height: height,
      value: resourceUpdate?.value != null ? resourceUpdate.value : 65,
      title: "FUEL",
      majorTicks: ["0", "50", "100"],
      minorTicks: 2,
      strokeTicks: false,
      borders: false,
      colorPlate: "transparent",
      valueBox: false,
      barWidth: 10,
      barBeginCircle: 0,
      highlights: null,
      tickSide: "left",
      numberSide: "left",
      needleSide: "left",
      ticksWidth: 5,
      ticksPadding: 0,
      colorBar: "transparent",
      colorBarProgress: dark ? "white" : "black"
    })

    gaugeRef.current.draw();
    watchResource(resource);
  }, [])

  useEffect(() => {
    const gauge = gaugeRef.current;
    if (!gauge) return;
  
    gauge.update({
      colorBarProgress: dark ? "white" : "black"
    });
  }, [dark]);

  return (
    <div
      ref={wrapperRef}
      className="h-full w-full flex justify-center items-center"
    >
      <canvas id={componentUUID.current} />
      <Fuel className={`${dark ? "text-white" : "text-black"} absolute left-[120px]`}/>
    </div>
  )
}

export default FuelComponentLinear