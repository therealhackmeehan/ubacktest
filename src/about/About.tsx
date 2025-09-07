import logo from '../client/static/logo.png';

export default function About() {

    return (
        <div className='mt-16 max-w-7xl mx-auto my-auto'>
            <div className="mx-3 md:mx-8 pb-24">
                <img src={logo} alt="uBacktest logo" className="h-32 mb-20 justify-self-center" />
                <div className="md:grid grid-cols-4 dark:text-white">
                    <div className="m-4 p-1 md:p-4 col-span-2 bg-slate-100 dark:bg-boxdark-2 rounded-xl shadow-lg">
                        <h4 className='my-2 font-bold tracking-tight text-gray-900 sm:text-3xl text-2xl dark:text-white text-center'>
                            About Us
                        </h4>
                        <div className="text-sm md:text-lg m-3 text-center">
                            uBacktest.com was born from one developer’s quest to beat the market—a journey that’s still unfolding.

                            Tired of expensive stock data and clunky backtesting tools, Jack set out to build something better. Using Python—the most approachable language for the task—he created a powerful yet accessible backtesting platform. What began as a personal project soon became a tool that others could use to test their own strategies.
                            
                            With built-in examples and an intuitive UI, uBacktest makes developing trading strategies less intimidating and more exciting. Whether you're a solo trader, a Wall Street pro, or an educator, the tools to refine your strategy are now at your fingertips.
                        </div>
                    </div>
                    <div className="m-4 p-1 md:p-4 col-span-2 bg-slate-100 dark:bg-boxdark-2 rounded-xl flex flex-col justify-between shadow-lg">
                        <div>
                            <h4 className='my-2 font-bold tracking-tight text-gray-900 sm:text-3xl text-2xl dark:text-white text-center'>
                                Contact Us
                            </h4>
                            <div className="text-sm md:text-lg m-3 font-light">
                                uBacktest is a new product, and we’d love to hear your feedback! Whether you’ve found a bug, have a suggestion, or just want to share your experience, we’re all ears. Your insights help us improve and refine our platform.

                                If you have any concerns or suggestions, feel free to reach out—we're committed to making uBacktest the best it can be.
                            </div>
                        </div>
                        <div className='text-center'>
                            <div className="text-xl">📩 Contact us at <a href="mailto:support@uBacktest.com" className="font-bold hover:font-extrabold hover:underline">support@uBacktest.com</a>.</div>
                            <div className='text-sm italic'>We will do our best to respond within one business day.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}