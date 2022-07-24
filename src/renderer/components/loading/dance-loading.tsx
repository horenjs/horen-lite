import React from "react";
import "./dance-loading.less";
import { LoadingProps} from "@components/loading/index";

export default function DanceLoading(props: LoadingProps) {
  const { scale, color = "#f6f6f6", stop } = props;

  return (
    <div
      className={"component-loading dance-loading"}
      style={{
        animationPlayState: stop ? "paused" : "running",
        transform: `scale(${scale}, ${scale})`
      }}
    >
      <div className={"loading-item"} style={{backgroundColor: color}}></div>
      <div className={"loading-item"} style={{backgroundColor: color}}></div>
      <div className={"loading-item"} style={{backgroundColor: color}}></div>
    </div>
  )
}