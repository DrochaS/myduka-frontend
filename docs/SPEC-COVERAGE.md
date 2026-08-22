# MyDuka — problem statement coverage

## Problem
Record keeping and stock taking are essential; many businesses lack apps that generate accurate automated reports and visualizations.

## Solution implemented
Inventory app for stock taking plus weekly/monthly/annual-style analytics visualized with **line and bar charts** (Chart.js).

## Team stack
| Layer | Spec | Implementation |
|-------|------|----------------|
| Frontend | React + Redux Toolkit | React 19, Redux Toolkit, React Router, axios |
| Backend | Python Flask | Flask app factory, JWT, Flask-SQLAlchemy |
| Database | PostgreSQL | `DATABASE_URL` (Postgres); SQLite fallback for local/tests |
| Charts | Any JS plotting lib | Chart.js + react-chartjs-2 (line + bar) |
| FE tests | Jest | Vitest (Jest-compatible) + Testing Library |
| BE tests | Minitests | pytest (Python unit/integration tests) |
| Wireframes | Figma (mobile) | UI built mobile-friendly; Figma board remains an external design artifact |

## Features checklist

### Authentication & roles
- [x] Merchant (superuser) invites admin via tokenized link (email util logs link when mail unset)
- [x] Invitee registers via Accept Invite (`/accept-invite?token=`)
- [x] Admins create clerks
- [x] JWT login; role-gated routes (frontend + backend)

### Clerk dashboard
- [x] Record received items (qty, payment paid/not_paid, stock, spoilt, buy/sell price)
- [x] Request more product supply → store admin

### Store admin
- [x] Clerk performance report (charts)
- [x] Approve / decline supply requests
- [x] Paid vs unpaid supplier products (separated views)
- [x] Mark payment status paid
- [x] Add / deactivate / delete clerks

### Merchant
- [x] Add / deactivate / delete admins (deactivate ≠ delete)
- [x] Store-by-store report graphs
- [x] Product performance narrowing
- [x] Paid / unpaid products per store

## Branches
- Frontend: `feat/myduka-inventory-app`
- Backend: `feat/myduka-inventory-api`
