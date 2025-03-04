import {
  features,
  faqs,
} from './contentSections';
import Hero from './components/Hero';
import Features from './components/Features';
import FAQ from './components/FAQ';
import Workflow from './components/Workflow';
import OnePowerfulEditor from './components/OnePowerfulEditor';

export default function LandingPage() {
  return (
    <div className='bg-white dark:text-white dark:bg-boxdark-2'>
      <main className='dark:bg-boxdark-2'>
        <Hero />
        <Workflow />
        <OnePowerfulEditor />
        <Features features={features} />
        <FAQ faqs={faqs} />
      </main>
    </div>
  );
}
