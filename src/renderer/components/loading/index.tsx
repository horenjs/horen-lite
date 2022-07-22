import "./style.less";
import React from "react";

export interface LoadingProps {
  type?: string;
  stop?: boolean;
  scale?: number;
  color?: string;
}

export default function Loading(props: LoadingProps) {
  const { type = "dance", stop = false, scale = 1, color = "#f1f1f1"} = props;
  return (
    <div
      className={"component-loading"}
      style={{
        animationPlayState: stop ? "paused" : "running",
        transform: `scale(${scale}, ${scale})`
      }}
    >
      <div className={"loading-item"} style={{backgroundColor: color}}></div>
      <div className={"loading-item"} style={{backgroundColor: color}}></div>
      <div className={"loading-item"} style={{backgroundColor: color}}></div>
    </div>
  );
}
