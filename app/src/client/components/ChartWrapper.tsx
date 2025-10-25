import { ReactNode } from "react";

interface ChartWrapperProps {
  children: ReactNode;
  height: number;
}

function ChartWrapper({ children, height }: ChartWrapperProps) {
  return (
    <div style={{ height: `clamp(300px, ${height}vh, 700px)` }}>{children}</div>
  );
}

export default ChartWrapper;
