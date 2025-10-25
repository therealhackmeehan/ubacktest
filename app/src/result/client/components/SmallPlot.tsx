import React from "react";

type PlotProps = {
  portfolio: number[];
  width?: number;
  height?: number;
};

const SmallPlot: React.FC<PlotProps> = ({
  portfolio,
  width = 80,
  height = 20,
}) => {
  // use indices instead of real time
  const x = portfolio.map((_, i) => i);
  const y = portfolio;

  if (x.length !== y.length) {
    console.error(
      "Data length mismatch: x and y arrays must have the same length."
    );
    return null;
  }

  const xMin = Math.min(...x);
  const xMax = Math.max(...x);
  const yMin = Math.min(...y);
  const yMax = Math.max(...y);

  const scaleX = (value: number) =>
    xMax === xMin ? width / 2 : ((value - xMin) / (xMax - xMin)) * width;

  const scaleY = (value: number) =>
    yMax === yMin
      ? height / 2
      : height - ((value - yMin) / (yMax - yMin)) * height;

  const color =
    y[y.length - 1] < y[0] ? "rgb(255, 105, 97, .7)" : "rgb(0, 100, 0, .7)";

  return (
    <svg width={width} height={height}>
      <polyline
        points={x.map((xi, i) => `${scaleX(xi)},${scaleY(y[i])}`).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  );
};

export default SmallPlot;
