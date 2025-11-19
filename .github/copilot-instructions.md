# Copilot Instructions

## Overview
- `backend/` houses a Laravel 12 API-first app; there is no frontend code here, so focus on REST endpoints, auth, and future GetStream token issuance described in `README.md`.
- The stack relies on Sanctum for SPA authentication and a separate React client (Lovable.dev) that talks to Laravel over HTTP + cookies.

## Architecture & Routing
- Authentication endpoints live in `routes/web.php` via the included `routes/auth.php`; they respond with JSON/`204` bodies and expect session cookies.
- `routes/api.php` currently exposes only `GET /api/user` behind `auth:sanctum`; add new API resources here when you want the `/api` prefix.
- Controllers follow the Breeze API style in `app/Http/Controllers/Auth/*`, keeping logic tiny and delegating validation to Form Requests under `app/Http/Requests` (copy `LoginRequest` when adding new payloads).
- `App\Http\Middleware\EnsureEmailIsVerified` already returns JSON `409` responses—reuse it on protected routes rather than reimplementing email gates.

## Data & Auth Model
- Database migrations (see `database/migrations/0001_*.php` and `2025_11_18_035026_add_role_to_users_table.php`) create users, sessions, cache/jobs tables, Sanctum tokens, and a `role` column defaulting to `customer`.
- Keep the `role` attribute in sync everywhere: `AdminUserSeeder` seeds `role = 'admin'`, but `App\Models\User::$fillable` and `Database\Factories\UserFactory` currently omit it—update both whenever role-aware features are added.
- Session, queue, and cache drivers default to `database`; migrations must be up before logging in or dispatching jobs.

## Environment & Integration Points
- `.env` must provide `FRONTEND_URL` plus any upcoming `STREAM_API_KEY/SECRET`; Breeze hooks like `App\Providers\AppServiceProvider::boot` and `Auth\VerifyEmailController` build redirect/reset URLs using `config('app.frontend_url')`.
- CORS (`config/cors.php`) and Sanctum stateful domains (`config/sanctum.php`) both read `FRONTEND_URL`, so mismatched origins will break SPA cookies.
- Keep GetStream secrets server-side—only expose the public key to the React client as outlined in `README.md`.

## Developer Workflow
- Fresh setup: `composer install`, copy `.env`, `php artisan key:generate`, configure DB (defaults to SQLite for local), then `php artisan migrate --seed` to create the default admin (`AdminUserSeeder`).
- Run the API with `php artisan serve`; queues use the database driver, so kick off `php artisan queue:listen --tries=1` (mirrors the `composer run dev` script) when working with async jobs or notifications.
- Log streaming is handled through Laravel Pail (`php artisan pail --timeout=0`) per the composer `dev` script; it runs alongside the server/queue watchers.

## Testing
- Use `php artisan test` or `composer test`; the PHPUnit config forces an in-memory SQLite database, sync queue, array cache/session, and disabled telemetry to keep suites fast.
- Feature tests under `tests/Feature/Auth` are canonical references for how responses should look (no content body, redirects to `config('app.frontend_url')`, etc.).
- When adding factories or migrations, ensure they work with `RefreshDatabase` to maintain deterministic tests.
