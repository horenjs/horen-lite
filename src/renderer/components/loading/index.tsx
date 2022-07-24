import "./style.less";
import React from "react";
import DanceLoading from "./dance-loading";
import SquareLoading from "./square-loading";

type LoadingType = "dance" | "square";

export interface LoadingProps {
  type?: LoadingType;
  stop?: boolean;
  scale?: number;
  color?: string;
}

export default function Loading(props: LoadingProps) {
  const { type = "dance", ...restProps } = props;
  let el: React.ReactElement;

  switch (type) {
  case "dance":
    el = <DanceLoading {...restProps} />;
    break;
  case "square":
    el = <SquareLoading {...restProps} />;
    break;
  }

  return el;
}
