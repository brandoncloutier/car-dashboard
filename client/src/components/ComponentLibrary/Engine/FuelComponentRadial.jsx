import { useSelector } from "react-redux";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import { useRef, useEffect } from "react";
import { useThemeContext } from "../../../contexts/ThemeContext";
import { RadialGauge } from "canvas-gauges";
import { Fuel } from "lucide-react";

const FuelComponentRadial = ({ resource }) => {
  const { watchResource } = useWebSocketContext();
  const resourceUpdate = useSelector(
    (state) => state.resources.resources_data[resource]
  );

  const componentUUID = useRef(crypto.randomUUID());

  const gaugeRef = useRef(null);
  const wrapperRef = useRef(null);

  const { dark } = useThemeContext()

  useEffect(() => {
    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;
    const smallestDimension = Math.min(width, height)

    gaugeRef.current = new RadialGauge({
      renderTo: componentUUID.current,
      width: smallestDimension,
      height: smallestDimension,
      value: resourceUpdate?.value != null ? resourceUpdate.value : 0,
      animation: true,
      animationDuration: 40,
      animateOnInit: true,
      minValue: 0,
      maxValue: 100,
      majorTicks: ["100", "50", "0"],
      highlights: [],
      minorTicks: 2,
      strokeTicks: true,
      borders: false,
      colorPlate: "transparent",
      valueBox: false,
      startAngle: 215,
      ticksAngle: 120,
      barStartPosition: "right",
      colorMajorTicks: dark ? "white" : "black",
      colorNeedle: dark ? "white" : "black",
      colorNeedleEnd: dark ? "white" : "black",
      colorNeedleShadowUp: dark ? "white" : "black",
      colorNeedleCircleInner: dark ? "black" : "white",
      colorNeedleCircleOuter: dark ? "black" : "white",
      colorNeedleCircleOuterEnd: dark ? "black" : "white",
      colorNeedleCircleInnerEnd: dark ? "black" : "white"
    })

    gaugeRef.current.draw();
    watchResource(resource);
  }, [])

  useEffect(() => {
    if (resourceUpdate?.value != null && gaugeRef.current) {
      gaugeRef.current.value = resourceUpdate.value;
    }
  }, [resourceUpdate])

  useEffect(() => {
    const gauge = gaugeRef.current;
    if (!gauge) return;
  
    gauge.update({
      colorMajorTicks: dark ? "white" : "black",
      colorNeedle: dark ? "white" : "black",
      colorNeedleEnd: dark ? "white" : "black",
      colorNeedleShadowUp: dark ? "white" : "black",
      colorNeedleCircleInner: dark ? "black" : "white",
      colorNeedleCircleOuter: dark ? "black" : "white",
      colorNeedleCircleOuterEnd: dark ? "black" : "white",
      colorNeedleCircleInnerEnd: dark ? "black" : "white",
      colorPlate: "transparent", // or theme-specific
      colorUnits: dark ? "white" : "black",
      colorNumbers: dark ? "white" : "black"
    });
  }, [dark]);


  return (
    <div
      ref={wrapperRef}
      className="h-full w-full flex justify-center items-center"
    >
      <canvas id={componentUUID.current} />
      <Fuel className={`${dark ? "text-white" : "text-black"} absolute left-[110px]`}/>
    </div>
  )
}

export default FuelComponentRadial