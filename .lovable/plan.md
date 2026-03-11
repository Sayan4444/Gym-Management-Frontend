

# Gym Management SaaS – Full UI Implementation

## Design System
- Clean SaaS UI with dark/light theme toggle using `next-themes`
- Professional color palette: Blue primary, green for success/active, amber for warnings/expiring, red for failed/expired
- Consistent spacing, large readable text, clear action buttons

## Pages & Navigation

### Public Pages
1. **Landing Page** – Hero section, features overview, testimonials, CTA
2. **Pricing Page** – Membership plan cards with comparison
3. **Login Page** – Email/password form with role selector
4. **Register Page** – Multi-step signup form

### Gym Admin Dashboard (Primary)
5. **Dashboard** – KPI cards (total members, today's attendance, active memberships, expiring soon, monthly revenue) + attendance & revenue charts (recharts)
6. **Members List** – Searchable/filterable table with status badges, add member button
7. **Member Profile** – Tabbed view (Profile Info, Attendance History, Membership History, Payments, Biometric Status) with actions (Renew, Freeze, Enroll Biometric, Deactivate)
8. **Attendance** – Daily attendance table with member photo, time in/out, source badge (Manual/Biometric), manual check-in button
9. **Membership Plans** – CRUD table for plans (name, price, duration, active status)
10. **Payments** – Payment history table with status badges (Paid/Pending/Failed), filters by date
11. **Trainers** – Trainer list with assigned member counts
12. **Reports** – Revenue and attendance summary charts
13. **Settings** – Gym profile settings

### Trainer Dashboard
14. **Trainer Dashboard** – Assigned members list, today's attendance
15. **Workout Plans** – Create/view workout plans for assigned members

### Member Dashboard
16. **Member Dashboard** – Subscription status, recent attendance, upcoming expiry
17. **Attendance History** – Personal attendance log
18. **Subscription Details** – Current plan, renewal info

### Super Admin
19. **Super Admin Dashboard** – All gyms overview, total users, revenue across gyms
20. **Gym Management** – List of gyms with stats

## Layout
- Sidebar navigation using shadcn Sidebar component (collapsible)
- Role-based menu items
- Header with theme toggle, user avatar dropdown
- Responsive: sidebar collapses to icons on smaller screens

## Dummy Data
- 3 gyms, 15+ members, 3 trainers, 5 membership plans, attendance records for past 30 days, payment history, workout plans – all matching the Go backend models provided

## Routing
- `/` – Landing page
- `/pricing` – Pricing
- `/login`, `/register` – Auth pages
- `/admin/*` – Gym Admin screens
- `/trainer/*` – Trainer screens
- `/member/*` – Member screens
- `/super-admin/*` – Super Admin screens

