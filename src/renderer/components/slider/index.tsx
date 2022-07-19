import React from "react";
import "./style.less";

export interface SliderProps {
  percent: number;
}

export default function Slider(props: SliderProps) {
  const { percent } = props;
  const ref: any = React.useRef();

  console.log(ref);

  return (
    <div className={"component-slider"}>
      <div className={"bg"} ref={ref}></div>
      <div className={"slider"} style={{width: percent * ref?.current?.offsetWidth}}></div>
    </div>
  )
}