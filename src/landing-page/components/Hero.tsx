import { DocsUrl } from '../../shared/common';
import { useInView } from 'react-intersection-observer';
import { Link } from 'wasp/client/router';

import Gallery from './Gallery';
import SwirlyBackground from './SwirlyBackground';

export default function Hero() {
  const [ref1, inView1] = useInView({ triggerOnce: true });
  const [ref2, inView2] = useInView({ triggerOnce: true });

  return (
    <div className='relative max-w-7xl mx-auto'>
      <SwirlyBackground />
      <div className="mx-auto max-w-3xl text-center min-h-screen pt-[20vh] px-4">
        <h1 ref={ref1} className={`text-4xl font-bold text-gray-900 sm:text-6xl dark:text-white duration-500 tracking-tight ${inView1 ? 'opacity-100' : 'opacity-0 translate-y-3'}`}>
          1 is <span className='text-sky-700 dark:text-blue-300'>buy</span>.
          -1 is <span className='text-sky-700 dark:text-blue-300'>short</span>.
        </h1>
        <h1 ref={ref2} className={`text-4xl my-12 font-bold text-gray-900 sm:text-6xl dark:text-white duration-1000 tracking-tight ${inView2 ? 'opacity-100' : 'opacity-0 translate-y-3'}`}>
          A simple and affordable backtesting platform for<span className='italic text-sky-700 dark:text-blue-300'> algorithmic trading</span>.
        </h1>
        <p className='mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-white'>
          {/* To Build Statistical, Machine Learning, and Deep Learning Strategies. */}
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
      <Gallery />
    </div>
  )
}