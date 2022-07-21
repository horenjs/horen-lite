import React from "react";
import "./style.less";

export interface SliderProps {
  percent: number;
}

export default function Slider(props: SliderProps) {
  const { percent } = props;
  const ref: any = React.useRef();
  const offsetWidth = ref?.current?.offsetWidth || 0;

  return (
    <div className={"component-slider"}>
      <div className={"bg"} ref={ref}></div>
      <div className={"slider"} style={{ width: percent * offsetWidth }}></div>
    </div>
  );
}