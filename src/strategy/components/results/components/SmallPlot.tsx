import React from 'react';
import { StrategyResultProps } from '../../../../shared/sharedTypes';

type PlotProps = {
    data: StrategyResultProps;
    width?: number;
    height?: number;
};

const SmallPlot: React.FC<PlotProps> = ({ data, width = 80, height = 20 }) => {

    const x = data.timestamp;
    const y = data.portfolio;

    // Ensure x and y arrays have the same length
    if (x.length !== y.length) {
        console.error('Data length mismatch: x and y arrays must have the same length.');
        return null;
    }

    // Find min/max values for scaling
    const xMin = Math.min(...x);
    const xMax = Math.max(...x);
    const yMin = Math.min(...y);
    const yMax = Math.max(...y);

    // Scale data to fit SVG dimensions
    const scaleX = (value: number) => ((value - xMin) / (xMax - xMin)) * width;
    const scaleY = (value: number) => height - ((value - yMin) / (yMax - yMin)) * height;
    const color = y[y.length - 1] > y[0] ? "rgb(0, 100, 0, .7)" : "rgb(255, 105, 97, .7)";

    return (
        <svg width={width} height={height}>
            <polyline
                points={x.map((_, i) => `${scaleX(x[i])},${scaleY(y[i])}`).join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="1"
            />
        </svg>
    );
};

export default SmallPlot;
