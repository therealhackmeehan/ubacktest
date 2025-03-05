import { useInView } from "react-intersection-observer";

// general imports
import result_stock1 from '../../client/static/result_stock1.png';

// dark imports
import dark_deploy from '../../client/static/dark_deploy.png';
import dark_deployScript from '../../client/static/dark_deployScript.png';
import dark_editorOnly from '../../client/static/dark_editorOnly.png';
import dark_editorOnlyComplex from '../../client/static/dark_editorOnlyComplex.png';
import dark_engine from '../../client/static/dark_engine.png';
import dark_example from '../../client/static/dark_example.png';
import dark_fullscreenEditor from '../../client/static/dark_fullscreenEditor.png';
import dark_maximizedEditor from '../../client/static/dark_maximizedEditor.png';
import dark_results from '../../client/static/dark_results.png';
import dark_strategies from '../../client/static/dark_strategies.png';
import dark_strategyHome from '../../client/static/dark_strategyHome.png';
import dark_strategyHomeFull from '../../client/static/dark_strategyHomeFull.png';

// light imports
import light_cashEquity from '../../client/static/light_cashEquity.png';
import light_dataTable from '../../client/static/light_dataTable.png';
import light_deploy from '../../client/static/light_deploy.png';
import light_deployScript from '../../client/static/light_deployScript.png';
import light_editorOnly from '../../client/static/light_editorOnly.png';
import light_editorOnlyComplex from '../../client/static/light_editorOnlyComplex.png';
import light_engine from '../../client/static/light_engine.png';
import light_example from '../../client/static/light_example.png';
import light_fullscreenEditor from '../../client/static/light_fullscreenEditor.png';
import light_maximizedEditor from '../../client/static/light_maximizedEditor.png';
import light_results from '../../client/static/light_results.png';
import light_SP from '../../client/static/light_SP.png';
import light_stats from '../../client/static/light_stats.png';
import light_strategies from '../../client/static/light_strategies.png';
import light_strategyHome from '../../client/static/light_strategyHome.png';
import light_strategyHomeFull from '../../client/static/light_strategyHomeFull.png';


export default function Workflow() {

    // Setting up refs for each step
    const [ref1, inView1] = useInView({ triggerOnce: true });
    const [ref2, inView2] = useInView({ triggerOnce: true });
    const [ref3, inView3] = useInView({ triggerOnce: true });
    const [ref4, inView4] = useInView({ triggerOnce: true });

    const height = 250;

    return (
        <div className='mx-auto mt-6 lg:mt-16 max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
                <p className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
                    Welcome to <span className='text-sky-700 dark:text-blue-300'>uBacktest</span>.
                </p>
                <p className='mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-white'>
                    Let's walk through the typical workflow.
                </p>
            </div>
            <div className='mx-auto mt-16 sm:mt-20 lg:mt-24 max-w-6xl'>
                <div className="lg:grid grid-cols-3 gap-4">
                    {/* Step 1 */}
                    <div ref={ref1} className={`col-span-2 flex justify-start gap-x-2 transition-transform duration-1000 transform ${inView1 ? 'translate-x-0' : '-translate-x-10'}`}>
                        <div className="rounded-md bg-sky-700 dark:bg-boxdark text-white px-3 font-bold text-title-xl">1</div>
                        <div className="border-2 border-slate-800 rounded-md w-full">
                            <div className="w-full max-h-80 overflow-clip">
                                <img
                                    src={dark_editorOnlyComplex}
                                    height={height}
                                    alt="editorOnly"
                                    className="hidden dark:flex rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                />
                                <img
                                    src={light_editorOnlyComplex}
                                    height={height}
                                    alt="editorOnly"
                                    className="dark:hidden rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`col-span-1 rounded-lg p-4 dark:text-white duration-700 transform ${inView1 ? 'translate-x-0' : 'translate-x-10'}`}>
                        <span className="font-extrabold text-title-xl text-sky-700 dark:text-blue-300 tracking-tight animate-pulse">Edit</span> your strategy in the strategy editor. Assign buy, sell, and hold signals using standard statistical techniques—or develop your own custom logic.
                    </div>

                    {/* Step 2 */}
                    <div ref={ref2} className={`col-span-2 flex justify-start gap-x-2 transition-transform duration-1000 transform ${inView2 ? 'translate-x-0' : '-translate-x-10'}`}>
                        <div className="rounded-md bg-sky-700 dark:bg-boxdark text-white px-3 font-bold text-title-xl">2</div>
                        <div className="border-2 border-slate-800 rounded-md w-full">
                            <div className="w-full max-h-80 overflow-clip">
                                <img
                                    src={light_dataTable}
                                    height={height}
                                    alt="dataTable"
                                    className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`col-span-1 rounded-lg p-4 dark:text-white duration-700 transform ${inView2 ? 'translate-x-0' : 'translate-x-10'}`}>
                        <span className="font-extrabold text-title-xl text-sky-700 dark:text-blue-300 tracking-tight animate-pulse">Backtest</span> your strategy with full control. Adjust stocks, timeframes, trading frequency, and other parameters—all within the editor.
                    </div>

                    {/* Step 3 */}
                    <div ref={ref3} className={`col-span-2 flex justify-start gap-x-2 transition-transform duration-1000 transform ${inView3 ? 'translate-x-0' : '-translate-x-10'}`}>
                        <div className="rounded-md bg-sky-700 dark:bg-boxdark text-white px-3 font-bold text-title-xl">3</div>
                        <div className="border-2 border-slate-800 rounded-md w-full">
                            <div className="w-full">
                                <img
                                    src={dark_results}
                                    height={height}
                                    alt="results"
                                    className="hidden dark:flex rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                />
                                <img
                                    src={light_results}
                                    height={height}
                                    alt="results"
                                    className="dark:hidden rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`col-span-1 rounded-lg p-4 dark:text-white duration-700 transform ${inView3 ? 'translate-x-0' : 'translate-x-10'}`}>
                        <span className="font-extrabold text-title-xl text-sky-700 dark:text-blue-300 tracking-tight animate-pulse">Save & Share</span> your strategies and results for future analysis. Resume, refine, and compare strategies anytime.
                    </div>

                    {/* Step 4 */}
                    <div ref={ref4} className={`col-span-2 flex justify-start gap-x-2 transition-transform duration-1000 transform ${inView4 ? 'translate-x-0' : '-translate-x-10'}`}>
                        <div className="rounded-md bg-sky-700 dark:bg-boxdark text-white px-3 font-bold text-title-xl">4</div>
                        <div className="border-2 border-slate-800 rounded-md w-full">
                            <div className="w-full">
                                <img
                                    src={dark_deploy}
                                    height={height}
                                    alt="deployment"
                                    className="hidden dark:flex rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                />
                                <img
                                    src={light_deploy}
                                    height={height}
                                    alt="deployment"
                                    className="dark:hidden rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`col-span-1 rounded-lg p-4 dark:text-white duration-700 transform ${inView4 ? 'translate-x-0' : 'translate-x-10'}`}>
                        Found a winning strategy? <span className="font-extrabold text-title-xl text-sky-700 dark:text-blue-300 tracking-tight animate-pulse">Deploy</span> it to the cloud with auto-generated code—whether for further testing or real trading.
                    </div>

                </div>
            </div>
        </div>
    );
}
