# WealthForge API Smoke Report

Generated on: 2026-03-04 15:11:09

Total endpoints in collection: 81

## Service-wise Count

| Service | Endpoint Count |
|---|---:|
| Admin Service | 19 |
| Advisor Service | 10 |
| Auth Service | 16 |
| Investor Service | 20 |
| Notification Service | 2 |
| Portfolio Service | 14 |

## Smoke Matrix

| Service | Folder | Method | Endpoint | Auth | Request Name |
|---|---|---|---|---|---|
| Auth Service | Authentication | POST | {{auth_service_base_url}}/auth/register | Public / Header-only | POST /auth/register |
| Auth Service | Authentication | POST | {{auth_service_base_url}}/register | Public / Header-only | POST /register (alias) |
| Auth Service | Authentication | POST | {{auth_service_base_url}}/auth/login | Public / Header-only | POST /auth/login |
| Auth Service | Authentication | POST | {{auth_service_base_url}}/login | Public / Header-only | POST /login (alias) |
| Auth Service | Authentication | POST | {{auth_service_base_url}}/auth/verify-login-otp | Public / Header-only | POST /auth/verify-login-otp |
| Auth Service | Authentication | POST | {{auth_service_base_url}}/verify-login-otp | Public / Header-only | POST /verify-login-otp (alias) |
| Auth Service | Authentication | POST | {{auth_service_base_url}}/auth/mfa | Bearer JWT | POST /auth/mfa |
| Auth Service | Authentication | POST | {{auth_service_base_url}}/mfa | Bearer JWT | POST /mfa (alias) |
| Auth Service | Authentication | POST | {{auth_service_base_url}}/auth/logout | Bearer JWT | POST /auth/logout |
| Auth Service | Authentication | POST | {{auth_service_base_url}}/logout | Bearer JWT | POST /logout (alias) |
| Auth Service | Role Test APIs | GET | {{auth_service_base_url}}/api/admin/dashboard | Bearer JWT | GET /api/admin/dashboard |
| Auth Service | Role Test APIs | GET | {{auth_service_base_url}}/api/admin/users | Bearer JWT | GET /api/admin/users |
| Auth Service | Role Test APIs | GET | {{auth_service_base_url}}/api/advisor/clients | Bearer JWT | GET /api/advisor/clients |
| Auth Service | Role Test APIs | GET | {{auth_service_base_url}}/api/advisor/recommendations | Bearer JWT | GET /api/advisor/recommendations |
| Auth Service | Role Test APIs | GET | {{auth_service_base_url}}/api/investor/portfolio | Bearer JWT | GET /api/investor/portfolio |
| Auth Service | Role Test APIs | GET | {{auth_service_base_url}}/api/investor/trading | Bearer JWT | GET /api/investor/trading |
| Admin Service | Companies | GET | {{admin_service_base_url}}/api/admin/companies | Bearer JWT | GET /api/admin/companies |
| Admin Service | Companies | GET | {{admin_service_base_url}}/api/admin/companiesList | Bearer JWT | GET /api/admin/companiesList |
| Admin Service | Companies | POST | {{admin_service_base_url}}/api/admin/companies | Bearer JWT | POST /api/admin/companies |
| Admin Service | Companies | POST | {{admin_service_base_url}}/api/admin/add | Bearer JWT | POST /api/admin/add |
| Admin Service | Companies | PUT | {{admin_service_base_url}}/api/admin/companies/{{company_id}} | Bearer JWT | PUT /api/admin/companies/{id} |
| Admin Service | Companies | PUT | {{admin_service_base_url}}/api/admin/update/{{company_id}} | Bearer JWT | PUT /api/admin/update/{id} |
| Admin Service | Companies | DELETE | {{admin_service_base_url}}/api/admin/companies/{{company_id}} | Bearer JWT | DELETE /api/admin/companies/{id} |
| Admin Service | Companies | DELETE | {{admin_service_base_url}}/api/admin/delete/{{company_id}} | Bearer JWT | DELETE /api/admin/delete/{id} |
| Admin Service | Investors | GET | {{admin_service_base_url}}/api/admin/investors | Bearer JWT | GET /api/admin/investors |
| Admin Service | Investors | GET | {{admin_service_base_url}}/api/admin/investorsList | Bearer JWT | GET /api/admin/investorsList |
| Admin Service | Stocks | POST | {{admin_service_base_url}}/api/admin/stocks | Bearer JWT | POST /api/admin/stocks |
| Admin Service | Stocks | GET | {{admin_service_base_url}}/api/admin/stocks | Bearer JWT | GET /api/admin/stocks |
| Admin Service | Stocks | GET | {{admin_service_base_url}}/api/admin/stocks/{{symbol}} | Bearer JWT | GET /api/admin/stocks/{symbol} |
| Admin Service | Stocks | GET | {{admin_service_base_url}}/api/admin/stocks/price/{{symbol}} | Bearer JWT | GET /api/admin/stocks/price/{symbol} |
| Admin Service | Stocks | PUT | {{admin_service_base_url}}/api/admin/stocks/update-price | Bearer JWT | PUT /api/admin/stocks/update-price |
| Admin Service | Stocks | PUT | {{admin_service_base_url}}/api/admin/stocks/update-quantity-buy | Bearer JWT | PUT /api/admin/stocks/update-quantity-buy |
| Admin Service | Stocks | PUT | {{admin_service_base_url}}/api/admin/stocks/update-quantity-sell | Bearer JWT | PUT /api/admin/stocks/update-quantity-sell |
| Admin Service | Stocks | DELETE | {{admin_service_base_url}}/api/admin/stocks/id/{{stock_id}} | Bearer JWT | DELETE /api/admin/stocks/id/{id} |
| Admin Service | Stocks | DELETE | {{admin_service_base_url}}/api/admin/stocks/symbol/{{symbol}} | Bearer JWT | DELETE /api/admin/stocks/symbol/{symbol} |
| Investor Service | Market & Advisor | GET | {{investor_service_base_url}}/api/investor/companyList | Bearer JWT | GET /api/investor/companyList |
| Investor Service | Market & Advisor | GET | {{investor_service_base_url}}/api/investor/stockList | Bearer JWT | GET /api/investor/stockList |
| Investor Service | Market & Advisor | GET | {{investor_service_base_url}}/api/investor/list | Bearer JWT | GET /api/investor/list |
| Investor Service | Market & Advisor | GET | {{investor_service_base_url}}/api/investor/searchAdvisor | Bearer JWT | GET /api/investor/searchAdvisor |
| Investor Service | Market & Advisor | GET | {{investor_service_base_url}}/api/investor/getAdvice | Bearer JWT | GET /api/investor/getAdvice |
| Investor Service | Market & Advisor | GET | {{investor_service_base_url}}/api/investor/advisor/list/all | Bearer JWT | GET /api/investor/advisor/list/all |
| Investor Service | Market & Advisor | GET | {{investor_service_base_url}}/api/investor/investors | Bearer JWT | GET /api/investor/investors |
| Investor Service | Trading | POST | {{investor_service_base_url}}/api/investor/buy | Bearer JWT | POST /api/investor/buy |
| Investor Service | Trading | POST | {{investor_service_base_url}}/api/investor/sell | Bearer JWT | POST /api/investor/sell |
| Investor Service | Trading | POST | {{investor_service_base_url}}/api/investor/transfer | Bearer JWT | POST /api/investor/transfer |
| Investor Service | History | GET | {{investor_service_base_url}}/api/investor/history | Bearer JWT | GET /api/investor/history |
| Investor Service | History | GET | {{investor_service_base_url}}/api/investor/history/{{portfolio_id}} | Bearer JWT | GET /api/investor/history/{portfolioId} |
| Investor Service | Portfolios | POST | {{investor_service_base_url}}/api/investor/portfolios | Bearer JWT | POST /api/investor/portfolios |
| Investor Service | Portfolios | GET | {{investor_service_base_url}}/api/investor/portfolios | Bearer JWT | GET /api/investor/portfolios |
| Investor Service | Portfolios | GET | {{investor_service_base_url}}/api/investor/portfolios/{{portfolio_id}} | Bearer JWT | GET /api/investor/portfolios/{portfolioId} |
| Investor Service | Portfolios | GET | {{investor_service_base_url}}/api/investor/portfolios/{{portfolio_id}}/holdings | Bearer JWT | GET /api/investor/portfolios/{portfolioId}/holdings |
| Investor Service | Portfolios | GET | {{investor_service_base_url}}/api/investor/portfolios/{{portfolio_id}}/performance | Bearer JWT | GET /api/investor/portfolios/{portfolioId}/performance |
| Investor Service | Portfolios | POST | {{investor_service_base_url}}/api/investor/portfolios/transfer | Bearer JWT | POST /api/investor/portfolios/transfer |
| Investor Service | Portfolios | GET | {{investor_service_base_url}}/api/investor/portfolios/overall-performance | Bearer JWT | GET /api/investor/portfolios/overall-performance |
| Investor Service | Internal | POST | {{investor_service_base_url}}/api/investor/internal/register | Public / Header-only | POST /api/investor/internal/register |
| Portfolio Service | Investor Portfolio APIs | POST | {{portfolio_service_base_url}}/api/portfolios | Bearer JWT | POST /api/portfolios |
| Portfolio Service | Investor Portfolio APIs | GET | {{portfolio_service_base_url}}/api/portfolios/my | Bearer JWT | GET /api/portfolios/my |
| Portfolio Service | Investor Portfolio APIs | GET | {{portfolio_service_base_url}}/api/portfolios/{{portfolio_id}} | Bearer JWT | GET /api/portfolios/{id} |
| Portfolio Service | Investor Portfolio APIs | GET | {{portfolio_service_base_url}}/api/portfolios/{{portfolio_id}}/holdings | Bearer JWT | GET /api/portfolios/{id}/holdings |
| Portfolio Service | Investor Portfolio APIs | GET | {{portfolio_service_base_url}}/api/portfolios/{{portfolio_id}}/performance | Bearer JWT | GET /api/portfolios/{id}/performance |
| Portfolio Service | Investor Portfolio APIs | GET | {{portfolio_service_base_url}}/api/portfolios/{{portfolio_id}}/allocation | Bearer JWT | GET /api/portfolios/{id}/allocation |
| Portfolio Service | Investor Portfolio APIs | POST | {{portfolio_service_base_url}}/api/portfolios/transfer | Bearer JWT | POST /api/portfolios/transfer |
| Portfolio Service | Investor Portfolio APIs | POST | {{portfolio_service_base_url}}/api/portfolios/{{portfolio_id}}/buy | Bearer JWT | POST /api/portfolios/{id}/buy |
| Portfolio Service | Investor Portfolio APIs | POST | {{portfolio_service_base_url}}/api/portfolios/{{portfolio_id}}/sell | Bearer JWT | POST /api/portfolios/{id}/sell |
| Portfolio Service | Investor Portfolio APIs | GET | {{portfolio_service_base_url}}/api/portfolios/overall-performance | Bearer JWT | GET /api/portfolios/overall-performance |
| Portfolio Service | Investor Portfolio APIs | GET | {{portfolio_service_base_url}}/api/portfolios/{{portfolio_id}}/transactions | Bearer JWT | GET /api/portfolios/{id}/transactions |
| Portfolio Service | Investor Portfolio APIs | GET | {{portfolio_service_base_url}}/api/portfolios/transactions | Bearer JWT | GET /api/portfolios/transactions |
| Portfolio Service | Admin Portfolio APIs | GET | {{portfolio_service_base_url}}/api/admin/portfolios | Bearer JWT | GET /api/admin/portfolios |
| Portfolio Service | Advisor Portfolio APIs | GET | {{portfolio_service_base_url}}/api/advisor/portfolios/{{investor_id}} | Bearer JWT | GET /api/advisor/portfolios/{investorId} |
| Advisor Service | Advisor Management | POST | {{advisor_service_base_url}}/api/advisor/register | Public / Header-only | POST /api/advisor/register |
| Advisor Service | Advisor Management | GET | {{advisor_service_base_url}}/api/advisor/list/{{advisor_id}} | Bearer JWT | GET /api/advisor/list/{advisorId} |
| Advisor Service | Advisor Management | GET | {{advisor_service_base_url}}/api/advisor/list | Bearer JWT | GET /api/advisor/list?advisorId= |
| Advisor Service | Advisor Management | GET | {{advisor_service_base_url}}/api/advisor/list/all | Bearer JWT | GET /api/advisor/list/all |
| Advisor Service | Advisor Management | POST | {{advisor_service_base_url}}/api/advisor/suggest/{{advisor_id}} | Bearer JWT | POST /api/advisor/suggest/{advisorId} |
| Advisor Service | Advisor Management | POST | {{advisor_service_base_url}}/api/advisor/advice/{{advisor_id}} | Bearer JWT | POST /api/advisor/advice/{advisorId} |
| Advisor Service | Advisor Management | POST | {{advisor_service_base_url}}/api/advisor/assign | Bearer JWT | POST /api/advisor/assign |
| Advisor Service | Advisor Management | GET | {{advisor_service_base_url}}/api/advisor/listInvestors/{{advisor_id}} | Bearer JWT | GET /api/advisor/listInvestors/{advisorId} |
| Advisor Service | Chatbot | POST | {{advisor_service_base_url}}/api/advisor/chatbot/add | Bearer JWT | POST /api/advisor/chatbot/add |
| Advisor Service | Chatbot | GET | {{advisor_service_base_url}}/api/advisor/chatbot/ask | Bearer JWT | GET /api/advisor/chatbot/ask |
| Notification Service | Notifications | POST | {{notification_service_base_url}}/api/notifications/send | Public / Header-only | POST /api/notifications/send |
| Notification Service | Notifications | POST | {{notification_service_base_url}}/notification/send | Public / Header-only | POST /notification/send (alias) |

## Notes

- Fill `jwt_token` after login before running protected endpoints.
- `internal_key` defaults to `WEALTHFORGE_INTERNAL_KEY` from investor-service config.
- This is a smoke collection; all requests assert success status (200/201/202/204).
