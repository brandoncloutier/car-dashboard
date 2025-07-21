import { useRef, useEffect } from "react";
import { RadialGauge } from "canvas-gauges";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import { useSelector } from "react-redux";
import { useThemeContext } from "../../../contexts/ThemeContext";
import { useEditModeContext } from "../../../contexts/EditModeContext"

const RPMComponent = ({ resource }) => {
  const { watchResource } = useWebSocketContext();
  const resourceUpdate = useSelector(
    (state) => state.resources.resources_data[resource]
  );
  const componentUUID = useRef(crypto.randomUUID());

  const gaugeRef = useRef(null);
  const wrapperRef = useRef(null);

  const { dark } = useThemeContext()
  const { editMode } = useEditModeContext()

  useEffect(() => {
    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;
    const smallestDimension = Math.min(width, height);

    gaugeRef.current = new RadialGauge({
      renderTo: componentUUID.current,
      width: smallestDimension,
      height: smallestDimension,
      value:
        resourceUpdate?.value != null ? resourceUpdate.value / 1000 : 0,
      animation: true,
      animationDuration: 40,
      animateOnInit: true,
      minValue: 0,
      maxValue: 7,
      majorTicks: ["0", "1", "2", "3", "4", "5", "6", "7"],
      highlights: [],
      minorTicks: 5,
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
    watchResource(resource);
  }, []);

  useEffect(() => {
    if (resourceUpdate?.value != null && gaugeRef.current) {
      gaugeRef.current.value = resourceUpdate.value / 1000;
    }
  }, [resourceUpdate]);

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

  useEffect(() => {
    const gauge = gaugeRef.current;
    if (!gauge) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;
    console.log(width)
    console.log(height)
    const smallestDimension = Math.min(width, height);

    gauge.update({
      width: smallestDimension,
      height: smallestDimension
    })
  }, [editMode])

  return (
    <div
      ref={wrapperRef}
      className="h-full w-full flex justify-center items-center"
    >
      <canvas id={componentUUID.current} />
    </div>
  );
};

export default RPMComponent;
