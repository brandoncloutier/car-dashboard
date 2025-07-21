import { useRef, useEffect } from "react"
import { RadialGauge } from 'canvas-gauges';
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import { useSelector } from "react-redux";
import { useThemeContext } from "../../../contexts/ThemeContext";

const SpeedComponent = ({ resource }) => {
  const { watchResource } = useWebSocketContext()
  const resourceUpdate = useSelector((state) => state.resources.resources_data[resource])
  const componentUUID = crypto.randomUUID()

  const gaugeRef = useRef(null)
  const wrapperRef = useRef(null)

  const { dark } = useThemeContext()

  useEffect(() => {
    const width = wrapperRef.current.clientWidth
    const height = wrapperRef.current.clientHeight
    const smallestDimension = Math.min(width, height)
    gaugeRef.current = new RadialGauge({
      renderTo: componentUUID,
      width: smallestDimension,
      height: smallestDimension,
      value: (resourceUpdate && resourceUpdate.value != null) ? resourceUpdate.value : 0,
      animation: true,
      animationDuration: 40,
      animateOnInit: true,
      minValue: 0,
      maxValue: 160,
      majorTicks: ['0', '20', '40', '60', '80', '100', '120', '140', '160'],
      highlights: [],
      minorTicks: 2,
      strokeTicks: true,
      colorPlate: "transparent",
      valueBox: false,
      borders: false,
      colorMajorTicks: dark ? "white" : "black",
      colorNeedle: dark ? "white" : "black",
      colorNeedleEnd: dark ? "white" : "black",
      colorNeedleShadowUp: dark ? "white" : "black",
      colorNeedleCircleInner: dark ? "black" : "white",
      colorNeedleCircleOuter: dark ? "black" : "white",
      colorNeedleCircleOuterEnd: dark ? "black" : "white",
      colorNeedleCircleInnerEnd: dark ? "black" : "white"
    });
    gaugeRef.current.draw();

    watchResource(resource)
  }, []);

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
    <div ref={wrapperRef} className="h-full w-full flex justify-center items-center">
      <canvas id={componentUUID} />
    </div>
  )
}

export default SpeedComponent