# WealthForge Frontend Full Overview

## 1. Development Approach We Are Following

The frontend is built with a **module-based Angular architecture** (Angular 20), using a **feature-first folder structure** and **lazy-loaded feature modules**.

Core approach in this project:

- Angular app with `NgModule` setup (not standalone-component architecture).
- Feature segregation by domain: `auth`, `dashboard`, `portfolio`, `stocks`, `transaction`, `advisor`, `admin-portfolio`.
- Shared reusable UI and utilities in a central `shared` module.
- Core cross-cutting concerns in a central `core` module.
- Route-level authentication and role authorization using guards.
- Service-based API layer using typed interfaces.
- Reactive forms with validators for most user input.
- Global loading and toast notifications via RxJS `BehaviorSubject`.

This means we are following a **clean layered frontend pattern**:

- UI Components (features/layout/shared)
- Guards/Interceptors (security and navigation rules)
- Services (API calls and app-level state streams)
- Models (typed contracts)

## 2. Tech Stack and Tooling

- Framework: Angular `^20.0.0`
- Language: TypeScript `~5.8.2`
- Styling: SCSS + Bootstrap `5.3.3` + Bootstrap Icons
- Reactive programming: RxJS `~7.8.0`
- Testing: Karma + Jasmine
- Build/Serve: Angular CLI via npm scripts

Important scripts:

- `npm --prefix wealthforge-pro-frontend start`
- `npm --prefix wealthforge-pro-frontend run build`
- `npm --prefix wealthforge-pro-frontend test`

## 3. Project Structure and Why It Works

Root frontend path:

`wealthforge-pro-frontend/src/app`

Main folders:

- `core/`
- `layout/`
- `shared/`
- `features/`

How each layer works:

- `core`: singleton-style services and cross-cutting logic. Includes `AuthInterceptor`, `authGuard`, `roleGuard`. Imported once in `AppModule`.
- `layout`: shell components like navbar, sidebar, footer. `ShellComponent` wraps authenticated routes and renders app chrome.
- `shared`: reusable UI components (`reusable-card`, toast container, loading spinner), shared pipe (`emptyState`), and shared module exports.
- `features`: business domains are isolated in feature modules with their own routing.

## 4. Bootstrapping and Module Wiring

Startup flow:

1. `main.ts` bootstraps `AppModule`.
1. `AppModule` imports `CoreModule`, `SharedModule`, `LayoutModule`, `AppRoutingModule`.
1. `App` component hosts a single `<router-outlet>`.

The app uses **lazy loaded feature modules** from `AppRoutingModule` for scale and faster initial load.

## 5. Routing Strategy (Auth + Role Based)

Top-level routing behavior:

- Public routes under `/auth` (login, OTP, register).
- Protected routes rendered inside `ShellComponent`.
- `authGuard` checks if user is logged in.
- `roleGuard` enforces role-based route access via route `data.roles`.

Role patterns implemented:

- Admin routes for dashboards, stock management, advisor management, all portfolios.
- Investor routes for portfolio, buy/sell, transfer, history, advisor chat.
- Advisor routes for assigned investors and advisor insights.

There are also backward-compatible redirects like:

- `/investor/buy-sell` -> `/transaction/trade`
- `/investor/transfer-funds` -> `/transaction/transfer`

## 6. API Communication Pattern

All backend communication is done via typed services in `core/services`.

Main services:

- `AuthService`
- `PortfolioService`
- `StockService`
- `TransactionService`
- `AdvisorService`

Pattern used:

1. Component calls service method.
1. Service performs `HttpClient` call.
1. Response mapped into typed `ApiResponse<T>` shape where needed.
1. Component updates local state and triggers UI feedback.

Environment + proxy behavior:

- Dev environment uses relative API roots: `apiBaseUrl: '/api'`, `authBaseUrl: ''`.
- Dev server proxy forwards `/api` and `/auth` to `http://localhost:9090`.
- Prod environment uses explicit URLs: `http://localhost:9090/api` and `http://localhost:9090`.

## 7. Security Handling in Frontend

Implemented mechanisms:

- JWT token persisted in `localStorage`.
- `AuthInterceptor` automatically attaches `Authorization: Bearer <token>`.
- Interceptor handles `401` by logging out and navigating to login.
- `AuthService` checks token expiry and derives role/user claims from JWT payload.
- Route guards block unauthorized access before component load.

Stored keys:

- `wf_token`
- `wf_role`
- `wf_user`
- `wf_pending_otp_email`

## 8. Forms and Validation Pattern

The app mainly uses **Reactive Forms**:

- Forms created with `FormBuilder`.
- Validation with Angular validators (`required`, `email`, `min`, `minLength`, `pattern`, etc.).
- Submit handlers use `if (form.invalid)` + `markAllAsTouched()`.
- Domain-specific validations are added in component logic where needed.

Example: Buy/Sell quantity validation

- Form control has `Validators.min(1)`.
- Input has `min="1"` and `step="1"`.
- Runtime normalization clamps invalid values to `1`.

## 9. State Management Strategy

This frontend does **not** use NgRx or a global store library.

State is handled with:

- Local component state for screen data.
- RxJS streams for global UI state.

Global stream examples:

- `LoadingService` with `BehaviorSubject<boolean>` for spinner visibility.
- `ToastService` with `BehaviorSubject<ToastMessage[]>` for app-wide notifications.

This approach is simple and fast for the current app size.

## 10. UI and Styling Strategy

- Global theme variables are in `src/styles.scss`.
- Reusable utility classes and cards are centralized.
- Bootstrap grid and form classes are used for consistency.
- Role-based sidebar menu changes navigation by logged-in role.

## 11. How a Feature Works End-to-End (Example: Buy/Sell)

Flow:

1. User opens `/transaction/trade`.
1. Component loads portfolios and stocks in parallel using `forkJoin`.
1. User submits buy/sell form.
1. Component validates and normalizes form values.
1. Calls `TransactionService.buyAsset(...)` or `sellAsset(...)`.
1. Interceptor adds JWT header.
1. Backend responds.
1. Component shows success/error toast and updates navigation if needed.

This same pattern is repeated across most features.

## 12. What Is a Pipe in Angular?

A **pipe** is a template-level transformation utility.

You use it to transform display values without changing the underlying data model.

Examples:

- Built-in: `date`, `currency`, `uppercase`, `json`
- Custom: `emptyState` pipe in this project

Syntax in template:

```html
{{ value | pipeName }}
{{ value | pipeName:arg1:arg2 }}
```

## 13. Pipe Used in This Project

Custom pipe: `EmptyStatePipe`

Purpose:

- If a value is `null`, `undefined`, or empty string, it returns a fallback text.

Usage in project:

```html
{{ value | emptyState: '-' }}
{{ subtitle | emptyState: 'No data available' }}
```

Why useful:

- Prevents repetitive null/empty checks in templates.
- Keeps UI consistent for missing data.

## 14. How To Create a New Pipe in This Project

Because this project uses module-based setup (`standalone: false`), follow this process.

Step 1: Generate pipe

```bash
cd wealthforge-pro-frontend
npm run ng -- generate pipe shared/pipes/currency-inr --skip-tests
```

Step 2: Implement transform logic

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyInr',
  standalone: false,
})
export class CurrencyInrPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    const amount = Number(value ?? 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  }
}
```

Step 3: Register in `SharedModule`

- Add the pipe in `declarations`.
- Add the pipe in `exports`.

Step 4: Use it in templates

```html
{{ stock.currentPrice | currencyInr }}
```

## 15. How To Add a New Frontend Feature (Recommended Workflow)

1. Create feature module under `features/<feature-name>`.
1. Add routing module and protect with `roleGuard` where needed.
1. Create components with Reactive Forms for inputs.
1. Add/extend typed models under `shared/models`.
1. Add a service method in `core/services` for backend call.
1. Use `LoadingService` + `ToastService` in async operations.
1. Add sidebar navigation entry if route should be visible.
1. Add unit tests for key component/service logic.

## 16. Current Strengths

- Clear module boundaries.
- Good role-based routing and security checks.
- Reusable shared UI and utilities.
- Typed service APIs and model contracts.
- Consistent user feedback pattern (spinner + toast).

## 17. Practical Improvements You Can Do Next

- Add stronger HTTP error normalization in one shared utility.
- Add more unit tests for guards/interceptor/forms.
- Introduce request caching for static lists (like stocks/advisors).
- Consider signal-based state or NgRx only if app complexity grows significantly.
