import { DocsUrl, BlogUrl } from '../shared/common';
import { routes } from 'wasp/client/router';

import { FaPython, FaSave } from 'react-icons/fa';
import { SiPandas, SiReadthedocs } from "react-icons/si";
import { MdOutlineImportExport } from "react-icons/md";
import { LuRocket } from "react-icons/lu";
import { AiTwotoneExperiment } from "react-icons/ai";
import { BsDatabase } from 'react-icons/bs';

export const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: routes.PricingPageRoute.build() },
  { name: 'Documentation', href: DocsUrl },
  { name: 'Blog', href: BlogUrl },
];

export const features = [
  {
    name: 'Code with Python and Pandas',
    description: 'No need to learn a new scripting language—leverage the full power of Python and Pandas right away.',
    icon: FaPython,
  },
  {
    name: 'Stock Data Included',
    description: 'Simply choose a time range and ticker—no need to deal with costly, outdated options or local setups.',
    icon: BsDatabase,
  },
  {
    name: 'Seamless Library Integration',
    description: 'Preloaded with essential statistics, machine learning, and finance libraries—ready to use out of the box.',
    icon: SiPandas,
  },
  {
    name: 'Save and Share Strategies',
    description: 'Easily store, track, and refine your trading strategies—or share them with others.',
    icon: FaSave,
  },
  {
    name: 'Deploy with Auto-Generated Code',
    description: 'Effortlessly generate production-ready code to execute your strategy—even with real capital.',
    icon: LuRocket,
  },
  {
    name: 'Comprehensive Docs & Examples',
    description: 'Get started instantly with importable examples—just press go and see them in action.',
    icon: SiReadthedocs,
  },
  {
    name: 'Fully Customizable Backtesting',
    description: 'Define your stock, date range, trading costs, and more for tailored backtesting.',
    icon: AiTwotoneExperiment,
  },
  {
    name: 'Import & Export Python Scripts',
    description: 'Develop anywhere, then bring your scripts back for seamless backtesting and refinement.',
    icon: MdOutlineImportExport,
  },
];

export const faqs = [
  {
    id: 1,
    question: 'Does it cost anything to use?',
    answer: 'You can get started for free! For more frequent or advanced backtesting, consider a paid plan—stock data isn’t cheap!',
  },
  {
    id: 2,
    question: 'What is the maximum backtesting frequency?',
    answer: 'Daily intervals are available for all users. With a paid plan, you can test at up to 1-minute intervals.',
  },
  {
    id: 3,
    question: 'I know trading but not coding. Can I still use this?',
    answer: 'Absolutely! If you understand trading concepts, you’ll quickly pick up the workflow. Start with our example strategies to get familiar with Python functions and financial data structures (DataFrames).',
  },
  {
    id: 4,
    question: 'I know coding but not trading. Will I struggle?',
    answer: 'Not at all! If you’re comfortable with Python—especially Pandas DataFrames—you’ll find it easy to assign buy, sell, and hold signals to stock data. The trading logic will come naturally as you experiment.',
  },
];

