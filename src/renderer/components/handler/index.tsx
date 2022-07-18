import React from "react";
import "./style.less";

export interface HandlerItem {
  icon: React.ReactNode;
  key: string | number;
  onClick(key: string | number): void;
}

export interface HandlerProps {
  items: HandlerItem[];
}

export default function Handler(props: HandlerProps) {
  const { items } = props;

  return (
    <div className={"component-handler"}>
      {items.map((item, index) => {
        return (
          <div
            className={"handler-item"}
            key={item.key || index}
            onClick={(e) => {
              e.preventDefault();
              if (item.onClick) {
                item.onClick(item.key);
              }
            }}
          >
            <div className={"handler-icon"}>{item.icon}</div>
          </div>
        );
      })}
    </div>
  );
}
