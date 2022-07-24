import React from "react";
import "./square-loading.less";
import { LoadingProps } from "@components/loading/index";

export default function SquareLoading(props: LoadingProps) {
  const { scale = 1 } = props;

  return (
    <div
      className="component-loading square-loading"
      style={{ transform: `scale(${scale}, ${scale})` }}
    >
      <svg width="100" height="100" viewBox="0 0 100 100">
        <polyline
          className="line-cornered stroke-still"
          points="0,0 100,0 100,100"
          strokeWidth="20"
          fill="none"
        ></polyline>
        <polyline
          className="line-cornered stroke-still"
          points="0,0 0,100 100,100"
          strokeWidth="20"
          fill="none"
        ></polyline>
        <polyline
          className="line-cornered stroke-animation"
          points="0,0 100,0 100,100"
          strokeWidth="20"
          fill="none"
        ></polyline>
        <polyline
          className="line-cornered stroke-animation"
          points="0,0 0,100 100,100"
          strokeWidth="20"
          fill="none"
        ></polyline>
      </svg>
    </div>
  );
}
