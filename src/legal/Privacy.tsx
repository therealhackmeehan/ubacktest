import ContentWrapper from "../client/components/ContentWrapper"

export default function Privacy() {

    return (
        <ContentWrapper>
            <h4 className="my-2 font-bold tracking-tight text-gray-900 sm:text-3xl text-xl dark:text-white">
                Privacy Policy
            </h4>
            <div className="border-b-2 w-full border-slate-400"></div>
            <div className="mt-12 max-w-5xl dark:text-white">
                <p className="mb-2 italic text-sm">Last updated: June 25, 2025</p>

                <h5 className="font-semibold text-lg mb-4 mt-8">1. Introduction</h5>
                <p>
                    Meehan Software Group (“we,” “us,” or “our”) operates the uBacktest platform. This Privacy Policy is intended to inform you (“you” or “the user”) about how we collect, use, disclose, and protect your personal data when you use our backtesting service, as well as the rights and choices available to you.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">2. Data Controller Information</h5>
                <p>
                    Meehan Software Group, LLC<br />
                    84 W Broadway, Ste 200, Derry, NH, 03038, USA<br />
                    <a href="mailto:info@meehansoftware.com" className="underline text-blue-600 dark:text-blue-400">info@meehansoftware.com</a>
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">3. Data We Collect</h5>

                <p className="font-semibold mt-4">Account Data</p>
                <ul className="list-disc list-inside ml-4">
                    <li>Email address</li>
                    <li>Password (encrypted and securely stored)</li>
                </ul>

                <p className="font-semibold mt-4">Usage Data</p>
                <ul className="list-disc list-inside ml-4">
                    <li>Access timestamps</li>
                    <li>Pages visited and actions taken on the platform</li>
                </ul>

                <p className="font-semibold mt-4">Content Data</p>
                <ul className="list-disc list-inside ml-4">
                    <li>Written trading strategies</li>
                    <li>Saved backtesting results and associated statistics</li>
                </ul>

                <p className="font-semibold mt-4">Payment Data</p>
                <ul className="list-disc list-inside ml-4">
                    <li>Payment history</li>
                    <li>Subscription status</li>
                </ul>
                <p className="mt-2 text-sm italic">
                    Note: All payment transactions are securely processed through our third-party provider, Stripe.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">4. How We Use Your Data</h5>

                <p className="font-semibold mt-4">To Provide Our Backtesting Services</p>
                <ul className="list-disc list-inside ml-4">
                    <li>Run and generate algorithmic trading simulations</li>
                    <li>Store and maintain your trading strategies and results</li>
                    <li>Support shared strategy results between users</li>
                    <li>Generate Python code for strategy deployment in simulated (paper) trading</li>
                </ul>

                <p className="font-semibold mt-4">To Improve Our Platform</p>
                <ul className="list-disc list-inside ml-4">
                    <li>Analyze user behavior and usage patterns</li>
                    <li>Diagnose and fix technical issues</li>
                </ul>

                <p className="font-semibold mt-4">To Communicate with You</p>
                <ul className="list-disc list-inside ml-4">
                    <li>Respond to support inquiries and user requests</li>
                </ul>

                <h5 className="font-semibold text-lg mb-4 mt-8">5. Legal Basis for Processing</h5>
                <ul className="list-disc list-inside ml-4">
                    <li>Your consent</li>
                    <li>Performance of a contract</li>
                    <li>Compliance with legal obligations</li>
                    <li>Our legitimate interest in improving the service</li>
                </ul>

                <h5 className="font-semibold text-lg mb-4 mt-8">6. Data Retention</h5>
                <ul className="list-disc list-inside ml-4">
                    <li><strong>Account Data:</strong> Retained while your account is active</li>
                    <li><strong>Backtesting Strategies and Results:</strong> Retained while your account is active or until deleted by you</li>
                    <li><strong>Payment Records:</strong> Retained for the duration required by tax and financial regulations</li>
                </ul>

                <h5 className="font-semibold text-lg mb-4 mt-8">7. Your Data Protection Rights</h5>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4">
                    <li>Access your personal data</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Restrict how we process your data</li>
                    <li>Request data portability</li>
                    <li>Object to certain processing activities</li>
                    <li>Withdraw your consent at any time</li>
                </ul>
                <p className="mt-2">
                    To exercise these rights, contact us at <a href="mailto:info@meehansoftware.com" className="underline text-blue-600 dark:text-blue-400">info@meehansoftware.com</a>.
                </p>
                <p className="mt-2">
                    You also have the right to lodge a complaint with a supervisory authority if you believe our data processing practices violate applicable laws.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">8. Data Sharing and Third Parties</h5>
                <p>
                    We share your data only as necessary, and only with trusted third parties, including:
                </p>
                <ul className="list-disc list-inside ml-4">
                    <li>
                        <strong>Stripe</strong> – For secure payment processing. Stripe is contractually obligated to protect your personal data.
                        <br />
                        <a href="https://stripe.com/privacy" target="_blank" className="underline text-blue-600 dark:text-blue-400">View Stripe's Privacy Policy</a>
                    </li>
                </ul>

                <h5 className="font-semibold text-lg mb-4 mt-8">9. Google Analytics and Cookies</h5>
                <p>
                    We use Google Analytics to better understand how users interact with our site. Google Analytics uses cookies — small text files stored on your device — to collect anonymous visitor behavior data. This data is transmitted to and stored by Google on servers in the United States.
                </p>
                <p className="mt-2">
                    We use this data to improve website performance, user experience, and our service offerings. Google may process this data in accordance with its privacy policies:
                    <a href="https://policies.google.com/privacy" target="_blank" className="underline text-blue-600 dark:text-blue-400"> https://policies.google.com/privacy</a>
                </p>
                <p className="mt-2">
                    You can opt out by installing this browser add-on:
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" className="underline text-blue-600 dark:text-blue-400"> https://tools.google.com/dlpage/gaoptout</a>
                </p>
                <p className="mt-2">
                    By using our website, you consent to the use of cookies and Google Analytics as described above. We also use cookies for secure session management — these are cleared when you log out or close your browser.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">10. Data Security</h5>
                <p>
                    We take appropriate technical and organizational measures to protect your personal data against unauthorized access, disclosure, or destruction.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">11. Changes to This Privacy Policy</h5>
                <p>
                    We may update this Privacy Policy from time to time. When we do, we will update the “Last updated” date at the top of this page. Continued use of our services after any modifications indicates your acceptance of the revised policy.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">12. Contact Us</h5>
                <p>
                    If you have questions about this Privacy Policy or how we handle your personal data, contact us:
                    <br />
                    Email: <a href="mailto:info@meehansoftware.com" className="underline text-blue-600 dark:text-blue-400">info@meehansoftware.com</a><br />
                    Mailing Address: 84 W Broadway, Ste 200, Derry, NH, 03038, USA
                </p>
            </div>
        </ContentWrapper>
    )
}
