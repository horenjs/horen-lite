import React from "react";
import "./style.less";

export interface SliderProps {
  percent: number;
  onSeek?(percent: number): void;
}

export default function Slider(props: SliderProps) {
  const { percent, onSeek } = props;
  const ref = React.useRef<HTMLDivElement>();
  const offsetWidth = ref?.current?.offsetWidth || 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const per = Number((e.pageX / ref.current.offsetWidth).toFixed(4));
    if (onSeek) onSeek(per);
  }

  return (
    <div className={"component-slider"}>
      <div className={"bg"} ref={ref} onClick={handleClick}></div>
      <div
        className={"slider"}
        style={{ width: percent * offsetWidth }}
        onClick={handleClick}
      ></div>
    </div>
  );
}