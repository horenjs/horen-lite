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
  const { type = "dance", color="#f1f1f1", ...restProps } = props;
  let el: React.ReactElement;

  switch (type) {
  case "dance":
    el = <DanceLoading color={color} {...restProps} />;
    break;
  case "square":
    el = <SquareLoading {...restProps} />;
    break;
  }

  return el;
}
