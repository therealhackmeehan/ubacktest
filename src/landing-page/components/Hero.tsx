import sp500 from '../../client/static/sp500.png';
import editor from '../../client/static/editor.png';
import engine from '../../client/static/engine.png';
import results from '../../client/static/results.png';
import { DocsUrl } from '../../shared/common';
import { useInView } from 'react-intersection-observer';

export default function Hero() {

  const [ref1, inView1] = useInView({ triggerOnce: true });
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
            <h1 ref={ref1} className={`text-4xl font-bold text-gray-900 sm:text-6xl dark:text-white duration-500 ${inView1 ? 'opacity-100' : 'opacity-0 translate-y-3'}`}>
              1 is <span className='text-sky-700 dark:text-blue-300'>buy</span>.
              -1 is <span className='text-sky-700 dark:text-blue-300'>short</span>.
            </h1>
            <h1 ref={ref3} className={`text-4xl my-12 font-bold text-gray-900 sm:text-6xl dark:text-white duration-1000 ${inView3 ? 'opacity-100' : 'opacity-0 translate-y-3'}`}>
              The rest is up to <span className='italic text-sky-700 dark:text-blue-300'>you</span>.
            </h1>
            <p className='mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-white'>
              Test your trading strategies effortlessly with our stock data and powerful tools.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <a
                href={DocsUrl}
                className='rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 hover:ring-2 hover:ring-sky-600 dark:hover:ring-blue-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-white'
              >
                Get Started for Free <span aria-hidden='true'>→</span>
              </a>
              <a
                href={DocsUrl}
                className='rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 hover:ring-2 hover:ring-sky-600 dark:hover:ring-blue-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-white'
              >
                Read the Docs <span aria-hidden='true'>→</span>
              </a>
            </div>
          </div>
          <div className="m-4 lg:mx-auto">
            <div className="mt-14 w-full">
              {/* First Image */}
              <div className="rotate-[-2deg] hover:rotate-[-4deg] duration-700 z-10 pr-12">
                <img
                  src={sp500}
                  alt="backtestResult"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>

              {/* Second Image */}
              <div className="rotate-[2deg] -mt-12 hover:rotate-[4deg] duration-700 z-20 pl-12">
                <img
                  src={editor}
                  alt="editor"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>

              {/* Third Image */}
              <div className="rotate-[-2deg] -mt-12 hover:rotate-[-4deg] duration-700 z-20 pr-12">
                <img
                  src={results}
                  alt="results"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
              {/* 
              <div className="rotate-[-2deg] -mt-12 hover:rotate-[-4deg] duration-700 z-20 pr-12">
                <img
                  src={engine}
                  alt="results"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div> */}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
