import { DocsUrl } from '../../shared/common';
import { useInView } from 'react-intersection-observer';
import { Link } from 'wasp/client/router';

// general imports
import result_stock1 from '../../client/static/result_stock1.png';

// dark imports
// import dark_deploy from '../../client/static/dark_deploy.png';
// import dark_deployScript from '../../client/static/dark_deployScript.png';
import dark_editorOnly from '../../client/static/dark_editorOnly.png';
// import dark_editorOnlyComplex from '../../client/static/dark_editorOnlyComplex.png';
import dark_engine from '../../client/static/dark_engine.png';
// import dark_example from '../../client/static/dark_example.png';
// import dark_fullscreenEditor from '../../client/static/dark_fullscreenEditor.png';
// import dark_maximizedEditor from '../../client/static/dark_maximizedEditor.png';
// import dark_results from '../../client/static/dark_results.png';
// import dark_strategies from '../../client/static/dark_strategies.png';
// import dark_strategyHome from '../../client/static/dark_strategyHome.png';
// import dark_strategyHomeFull from '../../client/static/dark_strategyHomeFull.png';

// light imports
// import light_cashEquity from '../../client/static/light_cashEquity.png';
// import light_dataTable from '../../client/static/light_dataTable.png';
// import light_deploy from '../../client/static/light_deploy.png';
// import light_deployScript from '../../client/static/light_deployScript.png';
import light_editorOnly from '../../client/static/light_editorOnly.png';
// import light_editorOnlyComplex from '../../client/static/light_editorOnlyComplex.png';
import light_engine from '../../client/static/light_engine.png';
// import light_example from '../../client/static/light_example.png';
// import light_fullscreenEditor from '../../client/static/light_fullscreenEditor.png';
// import light_maximizedEditor from '../../client/static/light_maximizedEditor.png';
// import light_results from '../../client/static/light_results.png';
import light_SP from '../../client/static/light_SP.png';
// import light_stats from '../../client/static/light_stats.png';
// import light_strategies from '../../client/static/light_strategies.png';
// import light_strategyHome from '../../client/static/light_strategyHome.png';
// import light_strategyHomeFull from '../../client/static/light_strategyHomeFull.png';

export default function Hero() {

  const [ref1, inView1] = useInView({ triggerOnce: true });
  const [ref2, inView2] = useInView({ triggerOnce: true });
  const [ref3, inView3] = useInView({ triggerOnce: true });

  return (
    <div className='relative max-w-7xl mx-auto'>

      <div
        className='absolute top-0 right-0 transform-gpu overflow-hidden w-full blur-3xl sm:top-0 pointer-events-none'
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
        className='absolute inset-x-0 top-[calc(100%-40rem)] sm:top-[calc(100%-65rem)] transform-gpu overflow-hidden blur-3xl pointer-events-none'
        aria-hidden='true'
      >
        <div
          className='relative aspect-[1020/880] sm:-left-3/4 sm:translate-x-1/4 bg-gradient-to-br from-sky-700 to-slate-300 dark:to-sky-800 opacity-30 w-[72.1875rem]'
          style={{
            clipPath: 'ellipse(80% 30% at 80% 50%)',
          }}
        />
      </div>

      <div className='py-24 sm:py-32'>
        <div className='mx-auto max-w-8xl px-6 lg:px-8'>
          <div className='lg:mb-18 mx-auto max-w-3xl text-center'>
            <h1 ref={ref1} className={`text-4xl font-bold text-gray-900 sm:text-6xl dark:text-white duration-500 tracking-tight ${inView1 ? 'opacity-100' : 'opacity-0 translate-y-3'}`}>
              1 is <span className='text-sky-700 dark:text-blue-300'>buy</span>.
              -1 is <span className='text-sky-700 dark:text-blue-300'>short</span>.
            </h1>
            <h1 ref={ref2} className={`text-4xl my-12 font-bold text-gray-900 sm:text-6xl dark:text-white duration-1000 tracking-tight ${inView2 ? 'opacity-100' : 'opacity-0 translate-y-3'}`}>
              A simple and affordable backtesting platform for<span className='italic text-sky-700 dark:text-blue-300'> algorithmic trading</span>.
            </h1>
            <p className='mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-white'>
              We got the data. Go ahead and get started on your <span className='italic text-sky-700 dark:text-blue-300'>million-dollar </span>idea!
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Link
                to="/editor"
                className='rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 hover:ring-2 hover:ring-sky-600 dark:hover:ring-blue-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-white'
              >
                Start Backtesting for Free! <span aria-hidden='true'>→</span>
              </Link>
              <a
                href={DocsUrl}
                className='rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 hover:ring-2 hover:ring-sky-600 dark:hover:ring-blue-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-white'
              >
                Read the Docs <span aria-hidden='true'>→</span>
              </a>
            </div>
          </div>
          <div className="m-4 lg:mx-auto">

            <div className="mt-34 w-full grid grid-cols-5 gap-3 md:-space-y-36">

              {/* image 1 */}
              <div ref={ref3} className={`col-span-4 hover:scale-90 duration-1000 z-50 transform ${inView3 ? 'translate-x-0' : 'translate-x-60'}`}>
                <img
                  src={dark_editorOnly}
                  alt="editor"
                  className="hidden dark:flex rounded-md shadow-2xl ring-1 ring-gray-900/30"
                />
                <img
                  src={light_editorOnly}
                  alt="editor"
                  className="dark:hidden rounded-md shadow-2xl ring-1 ring-gray-900/30"
                />
              </div>

              {/* image 2 */}
              <div className="col-span-4 col-start-2 hover:scale-90 duration-700 z-50">
                <img
                  src={result_stock1}
                  alt="basic backtest result"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/30"
                />
              </div>

              {/* image 3 */}
              <div className="col-span-4 col-start-1 hover:scale-90 duration-700 z-50">
                <img
                  src={light_engine}
                  alt="backtest engine"
                  className="dark:hidden rounded-md shadow-2xl ring-1 ring-gray-900/30 max-h-30 md:max-h-100"
                />
                <img
                  src={dark_engine}
                  alt="backtest engine"
                  className="hidden dark:flex rounded-md shadow-2xl ring-1 ring-gray-900/30 max-h-100"
                />
              </div>

              {/* image 4 */}
              <div className="col-start-2 col-span-4 hover:scale-90 duration-700 z-50">
                <img
                  src={light_SP}
                  alt="compare to sp500"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/30"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
