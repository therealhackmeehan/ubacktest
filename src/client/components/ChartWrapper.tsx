import { ReactNode } from "react";

interface ChartWrapperProps {
    children: ReactNode;
    height: number;
}

function ChartWrapper({ children, height }: ChartWrapperProps) {
    return (
        <div style={{ height: `${height}vh` }}>
            {children}
        </div>
    );
}

export default ChartWrapper;
