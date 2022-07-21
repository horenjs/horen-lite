import "./style.less";
import React from "react";

export interface LoadingProps {
  type: string;
  stop?: boolean;
}

export default function Loading(props: LoadingProps) {
  const { type = "dance", stop = false } = props;
  return (
    <div className={"component-loading"} style={{animationPlayState: stop ? "paused" : "running"}}>
      <div className={"loading-item"}></div>
      <div className={"loading-item"}></div>
      <div className={"loading-item"}></div>
    </div>
  )
}