import React from "react";
import "./style.less";

export interface FooterItem {
  key: string | number;
  title: string;
  icon: React.ReactNode;
  onClick(key: string | number): void;
}

export interface FooterProps {
  items: FooterItem[];
}

export default function Footer(props: FooterProps) {
  const { items } = props;

  return (
    <div className={"component-footer"}>
      {items.map((item, index) => {
        return (
          <div className={"item"} key={item.key || index} onClick={e => {
            e.preventDefault();
            if (item.onClick) {
              item.onClick(item.key);
            }
          }}>
            <div className={"item-icon"}>{item.icon}</div>
          </div>
        )
      })}
    </div>
  )
}