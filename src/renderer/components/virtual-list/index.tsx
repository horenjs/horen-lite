import React from "react";
import "./style.less";

export interface VirtualListProps {
  itemHeight: number,
  height: number,
  data: any,
  render(item: any, idx: number, start?: number): React.ReactNode;
  onScroll?(e, start, toTop): void;
}

export default function VirtualList(props: VirtualListProps) {
  const { itemHeight, height, data, render, onScroll } = props;

  const rows = Math.ceil(height/itemHeight) + 2;

  const [start, setStart] = React.useState(0);
  const [top, setTop] = React.useState(0);
  const [viewData, setViewData] = React.useState<any[]>(data.slice(0, rows));

  const handleScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    const toTop = (e.target as HTMLDivElement).scrollTop;

    const start = Math.floor(toTop/itemHeight);
    const end = start + rows;

    const viewD = data.slice(start, end);

    setStart(start);
    setViewData(viewD);
    setTop(Math.floor(toTop/itemHeight) * itemHeight);
  }

  return (
    <div
      className={"component-virtual-list no-scrollbar"}
      onScroll={handleScroll}
      style={{height}}
    >
      <div className={"items"} style={{transform: `translate3d(0, ${top}px, 0)`}} >
        {viewData.map((v, idx) => render(v, idx, start))}
        <div className={"virtual-list-spacer"}></div>
      </div>
    </div>
  )
}