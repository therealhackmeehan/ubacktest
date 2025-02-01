import {
  features,
  faqs,
} from './contentSections';
import Hero from './components/Hero';
import Features from './components/Features';
import FAQ from './components/FAQ';
import Workflow from './components/Workflow';

export default function LandingPage() {
  return (
    <div className='bg-white dark:text-white dark:bg-boxdark-2'>
      <main className='isolate dark:bg-boxdark-2'>
        <Hero />
        <Workflow />
        <Features features={features} />
        <FAQ faqs={faqs} />
      </main>
    </div>
  );
}
