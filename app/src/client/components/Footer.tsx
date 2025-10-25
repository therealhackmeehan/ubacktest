import { DocsUrl } from "../../shared/common";
import { routes } from "wasp/client/router";

const footerLinks = {
  app: [
    { name: "Documentation", href: DocsUrl },
    { name: "Contact Us", href: routes.AboutRoute.build() },
  ],
  company: [
    { name: "About", href: routes.AboutRoute.build() },
    { name: "Privacy", href: routes.PrivacyRoute.build() },
    { name: "Terms of Service", href: routes.TOSRoute.build() },
  ],
};

export default function Footer() {
  return (
    <footer
      aria-labelledby="footer-heading"
      className="px-6 lg:px-8 py-12 border-t border-gray-900/10 dark:border-0 dark:bg-boxdark-2 md:flex justify-between"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="p-4 w-full text-center md:text-start place-self-end text-slate-500 dark:text-white/50 pb-6 text-xs md:pb-0 md:text-base">
        © 2025 uBacktest. All rights reserved.
      </div>
      <div className="flex gap-20">
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
              {section}
            </h3>
            <ul className="mt-6 space-y-2">
              {links.map(({ name, href }) => (
                <li key={name}>
                  <a
                    href={href}
                    className="text-sm text-gray-600 hover:text-slate-700 dark:text-white text-nowrap"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
