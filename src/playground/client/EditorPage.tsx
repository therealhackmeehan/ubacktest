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

export const StrategyContext = createContext<any>(null);

export default function EditorPage() {

    // strategy to focus in on or display
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

    // strategy database contents
    const { data: strategies, isLoading: isStrategiesLoading } = useQuery(getStrategies);
    const hasLoadedInitial = useRef(false); // To track whether we've already loaded the data

    const [minWidth, maxWidth, defaultWidth] = [100, 600, 200];
    const [width, setWidth] = useState<number>(() => {
        const savedWidth = localStorage.getItem("sidebarWidth");
        return savedWidth ? JSON.parse(savedWidth) : defaultWidth;
    });

    const isResized = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResized.current) {
                return;
            }

            setWidth((previousWidth) => {
                const newWidth = previousWidth + e.movementX / 2;

                const maxAllowedWidth = Math.min(window.innerWidth / 3, maxWidth);
                if (newWidth > maxAllowedWidth) return maxAllowedWidth;
                if (newWidth < minWidth) {
                    if (previousWidth > newWidth) return 0;
                    if (previousWidth === 0) return newWidth;
                }

                return newWidth;
            });
        };

        const handleMouseUp = () => {
            isResized.current = false;
            document.body.style.userSelect = ""; // Re-enable text selection
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
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

    const setToAlternateWidth = () => {
        const widthToSet = (width === 0) ? defaultWidth : 0;
        setWidth(widthToSet);
    }

    return (

        <div className='w-full h-screen grid grid-cols-[min-content_auto] border-t-2 border-black'>

            <div className="flex overflow-x-hidden overflow-y-auto">
                <div className="h-full bg-gray-50 dark:bg-boxdark"
                    style={{ width: `${width / 16}rem` }}>
                    <StrategyBrowser
                        strategies={strategies}
                        isStrategiesLoading={isStrategiesLoading}
                        selectedStrategy={selectedStrategy}
                        setSelectedStrategy={setSelectedStrategy} />
                </div>
                <div className="w-3 cursor-col-resize border-r-2 border-black bg-slate-200 dark:bg-black dark:text-white z-10"
                    onMouseDown={() => {
                        isResized.current = true;
                        document.body.style.userSelect = "none";
                    }}
                    onClick={setToAlternateWidth}
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
        <div className="overflow-y-hidden h-screen bg-blue-300/10">
            <div className="border-2 p-4 border-black font-extrabold mt-12 justify-self-center blur-sm text-5xl text-slate-800/30 tracking-tight dark:text-white dark:border-white">
                {isStrategiesLoading ? "Loading..." : "No Strategies Exist (yet)"}
            </div>
            <div
                className='transform-gpu overflow-hidden w-full blur-3xl sm:top-0 pointer-events-none'
                aria-hidden='true'
            >
                <div
                    className='aspect-[1020/880] w-[55rem] flex-none sm:right-1/4 sm:translate-x-1/2 bg-gradient-to-tr from-sky-500 dark:from-sky-700 to-slate-400 opacity-40'
                    style={{
                        clipPath: 'polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)',
                    }}
                />
            </div>
            <div
                className='top-[calc(100%-40rem)] sm:top-[calc(100%-65rem)] transform-gpu overflow-hidden blur-3xl pointer-events-none'
                aria-hidden='true'
            >
                <div
                    className='relative aspect-[1020/880] sm:-left-3/4 sm:translate-x-1/4 bg-gradient-to-br from-sky-700 to-slate-300 dark:to-sky-800 opacity-30 w-[72.1875rem]'
                    style={{
                        clipPath: 'ellipse(80% 30% at 80% 50%)',
                    }}
                />
            </div>
        </div>

    )
}