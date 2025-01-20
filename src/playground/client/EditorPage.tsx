import type { Strategy } from "wasp/entities";
import StrategyBrowser from "./components/StrategyBrowser"
import StrategyEditor from "./components/StrategyEditor"
import { useState, useEffect, useRef, createContext } from "react"
import { getSpecificStrategy, getStrategies, useQuery } from "wasp/client/operations"
import { BsThreeDotsVertical } from "react-icons/bs";

// store name and code in context instead of prop drilling 
export interface StrategyContextProps {
    selectedStrategy: Strategy;
    setSelectedStrategy: (value: Strategy) => void;
}

// export const StrategyContext = createContext<StrategyContextProps>({
//     selectedStrategy: null,
//     setSelectedStrategy: () => (),
// });

export const StrategyContext = createContext<any>(null);

export default function EditorPage() {

    // strategy to focus in on or display
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

    // strategy database contents
    const { data: strategies, isLoading: isStrategiesLoading } = useQuery(getStrategies);
    const hasLoadedInitial = useRef(false); // To track whether we've already loaded the data

    const [minWidth, maxWidth, defaultWidth] = [100, 600, 300];
    const [width, setWidth] = useState<number>(() => {
        const savedWidth = localStorage.getItem("sidebarWidth");
        return savedWidth ? JSON.parse(savedWidth) : defaultWidth;
    });

    const isResized = useRef(false);

    useEffect(() => {
        window.addEventListener("mousemove", (e) => {
            if (!isResized.current) {
                return;
            }

            setWidth((previousWidth) => {
                const newWidth = previousWidth + e.movementX / 2;

                if (newWidth > maxWidth) return maxWidth;
                if (newWidth < minWidth) {
                    if (previousWidth > newWidth) return 0;
                    if (previousWidth === 0) return newWidth;
                }

                return newWidth;
            });
        });

        window.addEventListener("mouseup", () => {
            isResized.current = false;
        });
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebarWidth', JSON.stringify(width))
    }, [width])

    useEffect(() => {
        const loadInitialData = async () => {

            if (!hasLoadedInitial.current && !isStrategiesLoading) {
                hasLoadedInitial.current = true; // Mark the initial load as complete

                // get project to edit from local storage
                const savedValue = localStorage.getItem('projectToLoad');

                if (savedValue) {
                    localStorage.setItem('projectToLoad', ''); // Clear local storage once data is loaded
                    const fromSaved = await getSpecificStrategy({ id: savedValue });
                    if (fromSaved) setSelectedStrategy(fromSaved);
                    return;
                } else if (strategies) {
                    setSelectedStrategy(strategies[0])
                    return;
                }

                setSelectedStrategy(null)
            }
        };

        loadInitialData(); // Call the async function

    }, [strategies, isStrategiesLoading]);

    return (

        <div className='w-full h-[92vh] grid grid-cols-[min-content_auto] border-t-2 border-black'>

            <div className="flex">
                <div className="h-full overflow-x-auto bg-gray-50"
                    style={{ width: `${width / 16}rem` }}>
                    <StrategyBrowser
                        strategies={strategies}
                        isStrategiesLoading={isStrategiesLoading}
                        selectedStrategy={selectedStrategy}
                        setSelectedStrategy={setSelectedStrategy} />
                </div>
                <div className="w-3 cursor-col-resize border-r-2 border-black bg-slate-200"
                    onMouseDown={() => {
                        isResized.current = true;
                    }}
                >
                    <BsThreeDotsVertical className="justify-self-center h-full py-auto" />
                </div>
            </div>

            <div className='h-full overflow-x-auto'>
                {selectedStrategy ? (
                    <StrategyContext.Provider value={{ selectedStrategy, setSelectedStrategy }}>
                        <StrategyEditor />
                    </StrategyContext.Provider>
                ) : (
                    <NoStrategiesBanner isStrategiesLoading={isStrategiesLoading} />
                )}
            </div>

        </div>

    )
}

function NoStrategiesBanner({ isStrategiesLoading }: { isStrategiesLoading: boolean }) {
    return (
        <div className="border-2 p-4 border-black font-extrabold mt-12 justify-self-center blur-sm text-5xl text-slate-800/30 tracking-tight">
            {isStrategiesLoading ? "Loading..." : "No Strategies Exist (yet)"}
        </div>
    )
}