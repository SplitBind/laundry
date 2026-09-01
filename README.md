# Ledger — Expense Tracker

A dark-themed expense tracker with authentication, built with React (Vite), Supabase, and deployed on Vercel.

## Pages

- **/login** and **/signup** — email/password authentication via Supabase Auth
- **/dashboard** — a ledger table of expenses (Date, Item, Quantity, Price) with a "+" button that opens a modal to add a new entry. The date field defaults to today and has a calendar-picker icon.
- **/profile** — update display name, change password, view account info, sign out

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the contents of `supabase/schema.sql`. This creates the `expenses` table with row-level security so each user only ever sees their own rows.
3. In **Authentication → Providers**, email/password is enabled by default — nothing else to do. (Optional: turn off "Confirm email" under **Authentication → Settings** if you want signup to log users in immediately instead of requiring an email confirmation click.)
4. Grab your project's **Project URL** and **anon public key** from **Project Settings → API**.

## 2. Configure the app locally

```bash
cp .env.example .env
```

Fill in `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Install and run:

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## 3. Deploy to Vercel

1. Push this project to a GitHub repo.
2. In Vercel, "Add New Project" → import the repo. Vercel auto-detects Vite.
3. Under **Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same values as your `.env`.
4. Deploy.
5. Back in Supabase, go to **Authentication → URL Configuration** and add your Vercel domain (e.g. `https://your-app.vercel.app`) to the **Site URL** and **Redirect URLs** so auth emails/redirects work in production.

## Project structure

```
src/
  lib/
    supabaseClient.js    Supabase client init
    AuthContext.jsx      session/auth state provider
  components/
    ProtectedRoute.jsx   redirects to /login if unauthenticated
    Sidebar.jsx           nav + sign out
    ExpenseModal.jsx      add-expense overlay
  pages/
    Login.jsx / Signup.jsx
    Dashboard.jsx          expense ledger + "+" FAB
    Profile.jsx
```

## Notes

- Amounts are computed as `quantity × price` per row, and totalled at the top of the dashboard.
- Row-level security means the anon key is safe to expose client-side — Supabase enforces per-user access at the database level.
