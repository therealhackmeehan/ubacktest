# uBacktest.com

---

Created and maintained by Jack Meehan.

### This is the official repository for uBacktest.com.

uBacktest.com is comprised of a **Node.js** backend, a **React/Tailwind** frontend, and a **PostgreSQL** database w/ **Prisma** ORM. We use **Wasp**, an incredible full-stack framework to coordinate the three and integrate secure authentication. The client/server/db are all deployed via fly.io and CI/CD with GH actions facilitates the running of e2e tests and continuous deployment to fly.io.

The purpose of this website is to test trading strategyies against legitimate stock data using Python. We present a pipeline for strategy development that culminates in (hopefully) live trading.

uBacktest is free to a certain point, with a paid service to supplement the cost of hosting, stock data, and storage. There are hobby and pro plans, but also credit-based purchases that enable a specific number of backtests.

_© 2025 uBacktest. All rights reserved._

## /app

The `app` subdirectory contains the bones of the app (frontend, backend, db). The frontend and backend is NOT in seprate frontend/ backend/ folders, and itstead is factored into each portion of the app.

## /test

The `test` subdirectory contains the playwright e2e tests for the app.
