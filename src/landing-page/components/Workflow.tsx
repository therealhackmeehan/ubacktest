import { useInView } from "react-intersection-observer";
import sp500 from '../../client/static/sp500.png';
import results from '../../client/static/results.png';
import editor from '../../client/static/editor.png';

export default function Workflow() {

    // Setting up refs for each step
    const [ref1, inView1] = useInView({ triggerOnce: true });
    const [ref2, inView2] = useInView({ triggerOnce: true });
    const [ref3, inView3] = useInView({ triggerOnce: true });
    const [ref4, inView4] = useInView({ triggerOnce: true });

    const height = 250;

    return (
        <div className='mx-auto mt-16 max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
                <p className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
                    Welcome to <span className='text-sky-700 dark:text-blue-300'>uBacktest</span>.
                </p>
                <p className='mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-white'>
                    Let's walk through the typical workflow.
                </p>
            </div>
            <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl'>
                <div className="lg:grid grid-cols-3 gap-4">
                    {/* Step 1 */}
                    <div ref={ref1} className={`m-2 col-span-2 flex justify-start gap-x-2 transition-transform duration-1000 transform ${inView1 ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="rounded-md bg-sky-700 dark:bg-boxdark text-white px-3 font-bold text-title-xl">1</div>
                        <div className="w-full">
                            <img
                                src={editor}
                                height={height}
                                alt="backtestResult"
                                className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                            />
                        </div>
                    </div>
                    <div className="col-span-1 rounded-lg p-4 bg-slate-100 dark:bg-boxdark dark:border-2 dark:border-white dark:text-white">
                        <span className="font-extrabold">Edit</span> your strategy in the strategy editor. Assign buy, sell, and hold signals using standard statistical techniques—or develop your own custom logic.
                    </div>

                    {/* Step 2 */}
                    <div ref={ref2} className={`m-2 col-span-2 flex justify-start gap-x-2 transition-transform duration-1000 transform ${inView2 ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="rounded-md bg-sky-700 dark:bg-boxdark text-white px-3 font-bold text-title-xl">2</div>
                        <div className="border-2 border-slate-800 rounded-md w-full">
                            <div className="w-full">
                                <img
                                    src={sp500}
                                    height={height}
                                    alt="backtestResult"
                                    className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 rounded-lg p-4 bg-slate-100 dark:bg-boxdark dark:border-2 dark:border-white dark:text-white">
                        <span className="font-extrabold">Backtest</span> your strategy with full control. Adjust stocks, timeframes, trading frequency, and other parameters—all within the editor.
                    </div>

                    {/* Step 3 */}
                    <div ref={ref3} className={`m-2 col-span-2 flex justify-start gap-x-2 transition-transform duration-1000 transform ${inView3 ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="rounded-md bg-sky-700 dark:bg-boxdark text-white px-3 font-bold text-title-xl">3</div>
                        <div className="border-2 border-slate-800 rounded-md w-full">
                            <div className="w-full">
                                <img
                                    src={results}
                                    height={height}
                                    alt="backtestResult"
                                    className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 rounded-lg p-4 bg-slate-100 dark:bg-boxdark dark:border-2 dark:border-white dark:text-white">
                        <span className="font-extrabold">Save & Track</span> your strategies and results for future analysis. Resume, refine, and compare strategies anytime.
                    </div>

                    {/* Step 4 */}
                    <div ref={ref4} className={`m-2 col-span-2 flex justify-start gap-x-2 transition-transform duration-1000 transform ${inView4 ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="rounded-md bg-sky-700 dark:bg-boxdark text-white px-3 font-bold text-title-xl">4</div>
                        <div className="border-2 border-slate-800 rounded-md w-full">
                            <div className="w-full">
                                <img
                                    src={sp500}
                                    height={height}
                                    alt="backtestResult"
                                    className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 rounded-lg p-4 bg-slate-100 dark:bg-boxdark dark:border-2 dark:border-white dark:text-white">
                        Found a winning strategy? <span className="font-extrabold">Deploy</span> it to the cloud with auto-generated code—whether for further testing or real trading.
                    </div>

                </div>
            </div>
        </div>
    );
}
