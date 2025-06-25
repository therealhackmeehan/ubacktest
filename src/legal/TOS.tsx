import ContentWrapper from "../../client/components/ContentWrapper"

export default function TOS() {
    return (
        <ContentWrapper>
            <h4 className="my-2 font-bold tracking-tight text-gray-900 sm:text-3xl text-xl dark:text-white">
                Terms of Service
            </h4>
            <div className="border-b-2 w-full border-slate-400"></div>
            <div className="mt-12 max-w-5xl dark:text-white">
                <p className="mb-2 italic text-sm">Last Updated: April 28, 2025</p>

                <h5 className="font-semibold text-lg mb-4 mt-8">1. Company Information</h5>
                <p>
                    Meehan Software Group, LLC<br />
                    84 W Broadway, Ste 200, Derry NH, 03038, USA<br />
                    info@meehansoftware.com
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">2. Description of Service</h5>
                <p>
                    <span className="font-bold">uBacktest.com</span> (“uBacktest,” “we,” “us,” or “our”) provides a platform for the theoretical assessment of stock trading strategies using historical market data. Users can develop, save, compare, and share the results of these hypothetical trades executed on simulated past stock data. We are based in the United States, and all services are provided in accordance with United States law.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">3. Contract Formation</h5>
                <p>
                    By registering for, accessing, or using our services, you agree to be bound by these Terms of Service, forming a legally binding contract between you and Meehan Software Group, LLC, governed by U.S. law.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">4. User Accounts and Data Protection</h5>
                <p>
                    To access certain features of uBacktest, you must create an account by providing accurate, complete information. You are solely responsible for maintaining the confidentiality of your account credentials and are liable for all activities that occur under your account. You agree to notify us immediately of any unauthorized use or security breach of your account.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">5. Pricing and Payment Terms</h5>
                <p>
                    Prices are displayed in your local currency where available, with USD as the base currency. All prices include applicable taxes. Subscriptions are billed monthly and automatically renew unless canceled at least one (1) day before the renewal date. We reserve the right to adjust pricing at any time, with notice provided to you in advance of your next billing cycle.
                </p>
                <p className="mt-4">
                    Payments are processed securely through Stripe, a third-party provider. We do not store or process any of your payment information directly. All payment transactions are encrypted and handled under Stripe’s PCI Service Provider Level 1 security standards. For more information, see Stripe’s Security Documentation.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">6. Service Usage and Limitations</h5>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>No Investment Advice:</strong> uBacktest is not a broker, advisor, or fiduciary. The service does not constitute investment advice or an offer to buy/sell securities.</li>
                    <li><strong>Simulation Only:</strong> Results are hypothetical and not predictive of future performance.</li>
                    <li><strong>Beta Features:</strong> Experimental features may change or be discontinued without notice.</li>
                    <li><strong>User Responsibility:</strong> You assume full responsibility for any decisions made based on simulated results.</li>
                    <li><strong>Account Use:</strong> Accounts are for individual use only and must not be shared.</li>
                </ul>
                <p className="mt-2">
                    We reserve the right to limit, suspend, or terminate your access if you violate these Terms or misuse the service.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">7. Disclaimer of Warranties and Limitation of Liability</h5>
                <p>
                    To the fullest extent permitted by law, the uBacktest service is provided on an "AS IS" and "AS AVAILABLE" basis, without warranties of any kind. We disclaim all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
                </p>
                <p className="mt-4">
                    We are not liable for any damages, including:
                </p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Financial losses</li>
                    <li>Trading or investment losses</li>
                    <li>Loss of profits or revenues</li>
                    <li>Data loss or service interruptions</li>
                </ul>
                <p className="mt-2">
                    In any case, our total liability shall not exceed the amount paid by you in the month immediately preceding the claim.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">8. Intellectual Property</h5>
                <p>
                    All content, software, and designs on uBacktest are the property of Meehan Software Group, LLC. You may not copy, modify, distribute, or commercialize any part of the service without prior written consent.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">9. Dispute Resolution and Governing Law</h5>
                <p>
                    These Terms are governed by the laws of the State of New Hampshire, USA. Any disputes shall be resolved exclusively in the state or federal courts located in New Hampshire.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">10. Changes to Terms</h5>
                <p>
                    We may update these Terms from time to time. Material changes will be communicated to you. Continued use of the service constitutes acceptance of the revised Terms.
                </p>

                <h5 className="font-semibold text-lg mb-4 mt-8">11. Contact Us</h5>
                <p>
                    If you have any questions, please contact us at:<br />
                    info@meehansoftware.com
                </p>
            </div>
        </ContentWrapper>
    )
}
