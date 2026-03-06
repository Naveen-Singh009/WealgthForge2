$ErrorActionPreference = 'Stop'

$root = 'c:\Users\naveen.singh\Downloads\WealthForgeProject\Merged_StockProject update\Merged_StockProject\Merged_stock_project\Merged_stock_project\pro'
$outDir = Join-Path $root 'postman'
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

function New-UrlObject {
    param(
        [Parameter(Mandatory = $true)][string]$BaseVar,
        [Parameter(Mandatory = $true)][string]$Path,
        [array]$Query
    )

    $normalizedPath = if ([string]::IsNullOrWhiteSpace($Path)) { '/' } else { $Path }
    $trimmedPath = $normalizedPath.Trim('/')
    $pathParts = if ([string]::IsNullOrWhiteSpace($trimmedPath)) { @() } else { $trimmedPath.Split('/') }

    $url = [ordered]@{
        raw  = "{{${BaseVar}}}$normalizedPath"
        host = @("{{${BaseVar}}}")
        path = $pathParts
    }

    if ($Query -and $Query.Count -gt 0) {
        $url.query = @()
        foreach ($q in $Query) {
            $url.query += [ordered]@{
                key   = $q.key
                value = $q.value
            }
        }
    }

    return $url
}

function New-Request {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Method,
        [Parameter(Mandatory = $true)][string]$BaseVar,
        [Parameter(Mandatory = $true)][string]$Path,
        [bool]$AuthRequired = $true,
        [string]$Body = $null,
        [array]$Query = $null,
        [hashtable]$Headers = @{},
        [string]$Description = ''
    )

    $headerList = @()

    if ($Body) {
        $headerList += [ordered]@{ key = 'Content-Type'; value = 'application/json' }
    }

    foreach ($k in $Headers.Keys) {
        $headerList += [ordered]@{ key = $k; value = [string]$Headers[$k] }
    }

    $request = [ordered]@{
        method = $Method
        header = $headerList
        url    = New-UrlObject -BaseVar $BaseVar -Path $Path -Query $Query
    }

    if ($Description) {
        $request.description = $Description
    }

    if ($AuthRequired) {
        $request.auth = [ordered]@{
            type   = 'bearer'
            bearer = @(
                [ordered]@{ key = 'token'; value = '{{jwt_token}}'; type = 'string' }
            )
        }
    }

    if ($Body) {
        $request.body = [ordered]@{
            mode    = 'raw'
            raw     = $Body
            options = [ordered]@{
                raw = [ordered]@{ language = 'json' }
            }
        }
    }

    return [ordered]@{
        name     = $Name
        request  = $request
        response = @()
    }
}

function New-Folder {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][array]$Items
    )

    return [ordered]@{
        name = $Name
        item = $Items
    }
}

$bodyRegister = @'
{
  "name": "Investor One",
  "email": "investor1@example.com",
  "password": "invest123",
  "role": "INVESTOR",
  "initialBalance": 100000
}
'@

$bodyLogin = @'
{
  "email": "investor1@example.com",
  "password": "invest123"
}
'@

$bodyOtp = @'
{
  "email": "investor1@example.com",
  "otp": "123456"
}
'@

$bodyCompany = @'
{
  "companyName": "Apple Inc",
  "symbol": "AAPL",
  "sector": "Technology",
  "currentPrice": 220.5,
  "available_quantity": 10000
}
'@

$bodyStock = @'
{
  "symbol": "AAPL",
  "name": "Apple Inc",
  "sector": "Technology",
  "currentPrice": 220.5,
  "availableQuantity": 10000
}
'@

$bodyUpdatePrice = @'
{
  "symbol": "AAPL",
  "price": 225.75
}
'@

$bodyUpdateQty = @'
{
  "symbol": "AAPL",
  "quantity": 5
}
'@

$bodyBuy = @'
{
  "portfolioId": {{portfolio_id}},
  "symbol": "AAPL",
  "quantity": 2
}
'@

$bodySell = @'
{
  "portfolioId": {{portfolio_id}},
  "assetName": "AAPL",
  "quantity": 1
}
'@

$bodyTransfer = @'
{
  "fromPortfolioId": {{from_portfolio_id}},
  "toPortfolioId": {{to_portfolio_id}},
  "amount": 1000
}
'@

$bodyInvestorRegister = @'
{
  "investorId": {{investor_id}},
  "investorName": "Investor One",
  "email": "investor1@example.com",
  "initialBalance": 100000
}
'@

$bodyCreatePortfolio = @'
{
  "name": "Growth Portfolio",
  "balance": 50000
}
'@

$bodyAdvisor = @'
{
  "name": "Advisor One",
  "email": "advisor1@example.com",
  "phone": "9876543210"
}
'@

$bodyAdviceList = @'
[
  {
    "investorId": {{investor_id}},
    "question": "How should I rebalance my portfolio?",
    "adviceText": "Shift 10% into lower-volatility assets."
  }
]
'@

$bodyAssign = @'
{
  "advisorId": {{advisor_id}},
  "investorId": {{investor_id}}
}
'@

$bodyChat = @'
{
  "question": "What is SIP?",
  "answer": "Systematic Investment Plan"
}
'@

$bodyNotification = @'
{
  "email": "investor1@example.com",
  "message": "Trade executed successfully"
}
'@

$authAuthentication = @(
    New-Request -Name 'POST /auth/register' -Method 'POST' -BaseVar 'auth_service_base_url' -Path '/auth/register' -AuthRequired:$false -Body $bodyRegister -Description 'Public investor/advisor/admin registration endpoint.'
    New-Request -Name 'POST /register (alias)' -Method 'POST' -BaseVar 'auth_service_base_url' -Path '/register' -AuthRequired:$false -Body $bodyRegister
    New-Request -Name 'POST /auth/login' -Method 'POST' -BaseVar 'auth_service_base_url' -Path '/auth/login' -AuthRequired:$false -Body $bodyLogin
    New-Request -Name 'POST /login (alias)' -Method 'POST' -BaseVar 'auth_service_base_url' -Path '/login' -AuthRequired:$false -Body $bodyLogin
    New-Request -Name 'POST /auth/verify-login-otp' -Method 'POST' -BaseVar 'auth_service_base_url' -Path '/auth/verify-login-otp' -AuthRequired:$false -Body $bodyOtp
    New-Request -Name 'POST /verify-login-otp (alias)' -Method 'POST' -BaseVar 'auth_service_base_url' -Path '/verify-login-otp' -AuthRequired:$false -Body $bodyOtp
    New-Request -Name 'POST /auth/mfa' -Method 'POST' -BaseVar 'auth_service_base_url' -Path '/auth/mfa' -AuthRequired:$true -Query @(@{key='email';value='investor1@example.com'}, @{key='enable';value='true'}) -Description 'Requires JWT unless email fallback is accepted by current security context.'
    New-Request -Name 'POST /mfa (alias)' -Method 'POST' -BaseVar 'auth_service_base_url' -Path '/mfa' -AuthRequired:$true -Query @(@{key='email';value='investor1@example.com'}, @{key='enable';value='true'})
    New-Request -Name 'POST /auth/logout' -Method 'POST' -BaseVar 'auth_service_base_url' -Path '/auth/logout' -AuthRequired:$true
    New-Request -Name 'POST /logout (alias)' -Method 'POST' -BaseVar 'auth_service_base_url' -Path '/logout' -AuthRequired:$true
)

$authRoleTest = @(
    New-Request -Name 'GET /api/admin/dashboard' -Method 'GET' -BaseVar 'auth_service_base_url' -Path '/api/admin/dashboard' -AuthRequired:$true
    New-Request -Name 'GET /api/admin/users' -Method 'GET' -BaseVar 'auth_service_base_url' -Path '/api/admin/users' -AuthRequired:$true
    New-Request -Name 'GET /api/advisor/clients' -Method 'GET' -BaseVar 'auth_service_base_url' -Path '/api/advisor/clients' -AuthRequired:$true
    New-Request -Name 'GET /api/advisor/recommendations' -Method 'GET' -BaseVar 'auth_service_base_url' -Path '/api/advisor/recommendations' -AuthRequired:$true
    New-Request -Name 'GET /api/investor/portfolio' -Method 'GET' -BaseVar 'auth_service_base_url' -Path '/api/investor/portfolio' -AuthRequired:$true
    New-Request -Name 'GET /api/investor/trading' -Method 'GET' -BaseVar 'auth_service_base_url' -Path '/api/investor/trading' -AuthRequired:$true
)

$adminCompanies = @(
    New-Request -Name 'GET /api/admin/companies' -Method 'GET' -BaseVar 'admin_service_base_url' -Path '/api/admin/companies' -AuthRequired:$true
    New-Request -Name 'GET /api/admin/companiesList' -Method 'GET' -BaseVar 'admin_service_base_url' -Path '/api/admin/companiesList' -AuthRequired:$true
    New-Request -Name 'POST /api/admin/companies' -Method 'POST' -BaseVar 'admin_service_base_url' -Path '/api/admin/companies' -AuthRequired:$true -Body $bodyCompany
    New-Request -Name 'POST /api/admin/add' -Method 'POST' -BaseVar 'admin_service_base_url' -Path '/api/admin/add' -AuthRequired:$true -Body $bodyCompany
    New-Request -Name 'PUT /api/admin/companies/{id}' -Method 'PUT' -BaseVar 'admin_service_base_url' -Path '/api/admin/companies/{{company_id}}' -AuthRequired:$true -Body $bodyCompany
    New-Request -Name 'PUT /api/admin/update/{id}' -Method 'PUT' -BaseVar 'admin_service_base_url' -Path '/api/admin/update/{{company_id}}' -AuthRequired:$true -Body $bodyCompany
    New-Request -Name 'DELETE /api/admin/companies/{id}' -Method 'DELETE' -BaseVar 'admin_service_base_url' -Path '/api/admin/companies/{{company_id}}' -AuthRequired:$true
    New-Request -Name 'DELETE /api/admin/delete/{id}' -Method 'DELETE' -BaseVar 'admin_service_base_url' -Path '/api/admin/delete/{{company_id}}' -AuthRequired:$true
)

$adminInvestors = @(
    New-Request -Name 'GET /api/admin/investors' -Method 'GET' -BaseVar 'admin_service_base_url' -Path '/api/admin/investors' -AuthRequired:$true
    New-Request -Name 'GET /api/admin/investorsList' -Method 'GET' -BaseVar 'admin_service_base_url' -Path '/api/admin/investorsList' -AuthRequired:$true
)

$adminStocks = @(
    New-Request -Name 'POST /api/admin/stocks' -Method 'POST' -BaseVar 'admin_service_base_url' -Path '/api/admin/stocks' -AuthRequired:$true -Body $bodyStock
    New-Request -Name 'GET /api/admin/stocks' -Method 'GET' -BaseVar 'admin_service_base_url' -Path '/api/admin/stocks' -AuthRequired:$true
    New-Request -Name 'GET /api/admin/stocks/{symbol}' -Method 'GET' -BaseVar 'admin_service_base_url' -Path '/api/admin/stocks/{{symbol}}' -AuthRequired:$true
    New-Request -Name 'GET /api/admin/stocks/price/{symbol}' -Method 'GET' -BaseVar 'admin_service_base_url' -Path '/api/admin/stocks/price/{{symbol}}' -AuthRequired:$true
    New-Request -Name 'PUT /api/admin/stocks/update-price' -Method 'PUT' -BaseVar 'admin_service_base_url' -Path '/api/admin/stocks/update-price' -AuthRequired:$true -Body $bodyUpdatePrice
    New-Request -Name 'PUT /api/admin/stocks/update-quantity-buy' -Method 'PUT' -BaseVar 'admin_service_base_url' -Path '/api/admin/stocks/update-quantity-buy' -AuthRequired:$true -Body $bodyUpdateQty
    New-Request -Name 'PUT /api/admin/stocks/update-quantity-sell' -Method 'PUT' -BaseVar 'admin_service_base_url' -Path '/api/admin/stocks/update-quantity-sell' -AuthRequired:$true -Body $bodyUpdateQty
    New-Request -Name 'DELETE /api/admin/stocks/id/{id}' -Method 'DELETE' -BaseVar 'admin_service_base_url' -Path '/api/admin/stocks/id/{{stock_id}}' -AuthRequired:$true
    New-Request -Name 'DELETE /api/admin/stocks/symbol/{symbol}' -Method 'DELETE' -BaseVar 'admin_service_base_url' -Path '/api/admin/stocks/symbol/{{symbol}}' -AuthRequired:$true
)

$investorMarket = @(
    New-Request -Name 'GET /api/investor/companyList' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/companyList' -AuthRequired:$true
    New-Request -Name 'GET /api/investor/stockList' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/stockList' -AuthRequired:$true
    New-Request -Name 'GET /api/investor/list' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/list' -AuthRequired:$true
    New-Request -Name 'GET /api/investor/searchAdvisor' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/searchAdvisor' -AuthRequired:$true
    New-Request -Name 'GET /api/investor/getAdvice' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/getAdvice' -AuthRequired:$true -Query @(@{key='question';value='{{question}}'})
    New-Request -Name 'GET /api/investor/advisor/list/all' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/advisor/list/all' -AuthRequired:$true
    New-Request -Name 'GET /api/investor/investors' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/investors' -AuthRequired:$true -Description 'Admin role required by method-level authorization.'
)

$investorTrading = @(
    New-Request -Name 'POST /api/investor/buy' -Method 'POST' -BaseVar 'investor_service_base_url' -Path '/api/investor/buy' -AuthRequired:$true -Body $bodyBuy
    New-Request -Name 'POST /api/investor/sell' -Method 'POST' -BaseVar 'investor_service_base_url' -Path '/api/investor/sell' -AuthRequired:$true -Body $bodySell
    New-Request -Name 'POST /api/investor/transfer' -Method 'POST' -BaseVar 'investor_service_base_url' -Path '/api/investor/transfer' -AuthRequired:$true -Body $bodyTransfer
)

$investorHistory = @(
    New-Request -Name 'GET /api/investor/history' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/history' -AuthRequired:$true
    New-Request -Name 'GET /api/investor/history/{portfolioId}' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/history/{{portfolio_id}}' -AuthRequired:$true
)

$investorPortfolios = @(
    New-Request -Name 'POST /api/investor/portfolios' -Method 'POST' -BaseVar 'investor_service_base_url' -Path '/api/investor/portfolios' -AuthRequired:$true -Body $bodyCreatePortfolio
    New-Request -Name 'GET /api/investor/portfolios' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/portfolios' -AuthRequired:$true
    New-Request -Name 'GET /api/investor/portfolios/{portfolioId}' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/portfolios/{{portfolio_id}}' -AuthRequired:$true
    New-Request -Name 'GET /api/investor/portfolios/{portfolioId}/holdings' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/portfolios/{{portfolio_id}}/holdings' -AuthRequired:$true
    New-Request -Name 'GET /api/investor/portfolios/{portfolioId}/performance' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/portfolios/{{portfolio_id}}/performance' -AuthRequired:$true
    New-Request -Name 'POST /api/investor/portfolios/transfer' -Method 'POST' -BaseVar 'investor_service_base_url' -Path '/api/investor/portfolios/transfer' -AuthRequired:$true -Body $bodyTransfer
    New-Request -Name 'GET /api/investor/portfolios/overall-performance' -Method 'GET' -BaseVar 'investor_service_base_url' -Path '/api/investor/portfolios/overall-performance' -AuthRequired:$true
)

$investorInternal = @(
    New-Request -Name 'POST /api/investor/internal/register' -Method 'POST' -BaseVar 'investor_service_base_url' -Path '/api/investor/internal/register' -AuthRequired:$false -Body $bodyInvestorRegister -Headers @{ 'X-Internal-Key' = '{{internal_key}}' }
)

$portfolioInvestor = @(
    New-Request -Name 'POST /api/portfolios' -Method 'POST' -BaseVar 'portfolio_service_base_url' -Path '/api/portfolios' -AuthRequired:$true -Body $bodyCreatePortfolio
    New-Request -Name 'GET /api/portfolios/my' -Method 'GET' -BaseVar 'portfolio_service_base_url' -Path '/api/portfolios/my' -AuthRequired:$true
    New-Request -Name 'GET /api/portfolios/{id}' -Method 'GET' -BaseVar 'portfolio_service_base_url' -Path '/api/portfolios/{{portfolio_id}}' -AuthRequired:$true
    New-Request -Name 'GET /api/portfolios/{id}/holdings' -Method 'GET' -BaseVar 'portfolio_service_base_url' -Path '/api/portfolios/{{portfolio_id}}/holdings' -AuthRequired:$true
    New-Request -Name 'GET /api/portfolios/{id}/performance' -Method 'GET' -BaseVar 'portfolio_service_base_url' -Path '/api/portfolios/{{portfolio_id}}/performance' -AuthRequired:$true
    New-Request -Name 'GET /api/portfolios/{id}/allocation' -Method 'GET' -BaseVar 'portfolio_service_base_url' -Path '/api/portfolios/{{portfolio_id}}/allocation' -AuthRequired:$true
    New-Request -Name 'POST /api/portfolios/transfer' -Method 'POST' -BaseVar 'portfolio_service_base_url' -Path '/api/portfolios/transfer' -AuthRequired:$true -Body $bodyTransfer
    New-Request -Name 'POST /api/portfolios/{id}/buy' -Method 'POST' -BaseVar 'portfolio_service_base_url' -Path '/api/portfolios/{{portfolio_id}}/buy' -AuthRequired:$true -Body @'
{
  "assetSymbol": "AAPL",
  "quantity": 2,
  "price": 220.5,
  "assetType": "EQUITY"
}
'@
    New-Request -Name 'POST /api/portfolios/{id}/sell' -Method 'POST' -BaseVar 'portfolio_service_base_url' -Path '/api/portfolios/{{portfolio_id}}/sell' -AuthRequired:$true -Body @'
{
  "assetSymbol": "AAPL",
  "quantity": 1,
  "price": 220.5,
  "assetType": "EQUITY"
}
'@
    New-Request -Name 'GET /api/portfolios/overall-performance' -Method 'GET' -BaseVar 'portfolio_service_base_url' -Path '/api/portfolios/overall-performance' -AuthRequired:$true
    New-Request -Name 'GET /api/portfolios/{id}/transactions' -Method 'GET' -BaseVar 'portfolio_service_base_url' -Path '/api/portfolios/{{portfolio_id}}/transactions' -AuthRequired:$true
    New-Request -Name 'GET /api/portfolios/transactions' -Method 'GET' -BaseVar 'portfolio_service_base_url' -Path '/api/portfolios/transactions' -AuthRequired:$true
)

$portfolioAdmin = @(
    New-Request -Name 'GET /api/admin/portfolios' -Method 'GET' -BaseVar 'portfolio_service_base_url' -Path '/api/admin/portfolios' -AuthRequired:$true
)

$portfolioAdvisor = @(
    New-Request -Name 'GET /api/advisor/portfolios/{investorId}' -Method 'GET' -BaseVar 'portfolio_service_base_url' -Path '/api/advisor/portfolios/{{investor_id}}' -AuthRequired:$true
)

$advisorManagement = @(
    New-Request -Name 'POST /api/advisor/register' -Method 'POST' -BaseVar 'advisor_service_base_url' -Path '/api/advisor/register' -AuthRequired:$false -Body $bodyAdvisor
    New-Request -Name 'GET /api/advisor/list/{advisorId}' -Method 'GET' -BaseVar 'advisor_service_base_url' -Path '/api/advisor/list/{{advisor_id}}' -AuthRequired:$true
    New-Request -Name 'GET /api/advisor/list?advisorId=' -Method 'GET' -BaseVar 'advisor_service_base_url' -Path '/api/advisor/list' -AuthRequired:$true -Query @(@{key='advisorId';value='{{advisor_id}}'})
    New-Request -Name 'GET /api/advisor/list/all' -Method 'GET' -BaseVar 'advisor_service_base_url' -Path '/api/advisor/list/all' -AuthRequired:$true
    New-Request -Name 'POST /api/advisor/suggest/{advisorId}' -Method 'POST' -BaseVar 'advisor_service_base_url' -Path '/api/advisor/suggest/{{advisor_id}}' -AuthRequired:$true -Body $bodyAdviceList
    New-Request -Name 'POST /api/advisor/advice/{advisorId}' -Method 'POST' -BaseVar 'advisor_service_base_url' -Path '/api/advisor/advice/{{advisor_id}}' -AuthRequired:$true -Body $bodyAdviceList
    New-Request -Name 'POST /api/advisor/assign' -Method 'POST' -BaseVar 'advisor_service_base_url' -Path '/api/advisor/assign' -AuthRequired:$true -Body $bodyAssign
    New-Request -Name 'GET /api/advisor/listInvestors/{advisorId}' -Method 'GET' -BaseVar 'advisor_service_base_url' -Path '/api/advisor/listInvestors/{{advisor_id}}' -AuthRequired:$true
)

$advisorChatbot = @(
    New-Request -Name 'POST /api/advisor/chatbot/add' -Method 'POST' -BaseVar 'advisor_service_base_url' -Path '/api/advisor/chatbot/add' -AuthRequired:$true -Body $bodyChat
    New-Request -Name 'GET /api/advisor/chatbot/ask' -Method 'GET' -BaseVar 'advisor_service_base_url' -Path '/api/advisor/chatbot/ask' -AuthRequired:$true -Query @(@{key='question';value='{{question}}'})
)

$notifications = @(
    New-Request -Name 'POST /api/notifications/send' -Method 'POST' -BaseVar 'notification_service_base_url' -Path '/api/notifications/send' -AuthRequired:$false -Body $bodyNotification
    New-Request -Name 'POST /notification/send (alias)' -Method 'POST' -BaseVar 'notification_service_base_url' -Path '/notification/send' -AuthRequired:$false -Body $bodyNotification
)

$collectionItems = @(
    New-Folder -Name 'Auth Service' -Items @(
        New-Folder -Name 'Authentication' -Items $authAuthentication
        New-Folder -Name 'Role Test APIs' -Items $authRoleTest
    )
    New-Folder -Name 'Admin Service' -Items @(
        New-Folder -Name 'Companies' -Items $adminCompanies
        New-Folder -Name 'Investors' -Items $adminInvestors
        New-Folder -Name 'Stocks' -Items $adminStocks
    )
    New-Folder -Name 'Investor Service' -Items @(
        New-Folder -Name 'Market & Advisor' -Items $investorMarket
        New-Folder -Name 'Trading' -Items $investorTrading
        New-Folder -Name 'History' -Items $investorHistory
        New-Folder -Name 'Portfolios' -Items $investorPortfolios
        New-Folder -Name 'Internal' -Items $investorInternal
    )
    New-Folder -Name 'Portfolio Service' -Items @(
        New-Folder -Name 'Investor Portfolio APIs' -Items $portfolioInvestor
        New-Folder -Name 'Admin Portfolio APIs' -Items $portfolioAdmin
        New-Folder -Name 'Advisor Portfolio APIs' -Items $portfolioAdvisor
    )
    New-Folder -Name 'Advisor Service' -Items @(
        New-Folder -Name 'Advisor Management' -Items $advisorManagement
        New-Folder -Name 'Chatbot' -Items $advisorChatbot
    )
    New-Folder -Name 'Notification Service' -Items @(
        New-Folder -Name 'Notifications' -Items $notifications
    )
)

$collection = [ordered]@{
    info = [ordered]@{
        name        = 'WealthForge API Smoke Collection'
        description = 'Auto-generated smoke collection for all REST controllers in WealthForge microservices. Import directly into Postman.'
        schema      = 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    }
    event = @(
        [ordered]@{
            listen = 'test'
            script = [ordered]@{
                type = 'text/javascript'
                exec = @(
                    'pm.test("Smoke: status is successful", function () {',
                    '  pm.expect(pm.response.code).to.be.oneOf([200, 201, 202, 204]);',
                    '});'
                )
            }
        }
    )
    variable = @(
        [ordered]@{ key='auth_service_base_url'; value='http://localhost:8080' },
        [ordered]@{ key='admin_service_base_url'; value='http://localhost:8083' },
        [ordered]@{ key='advisor_service_base_url'; value='http://localhost:8084' },
        [ordered]@{ key='investor_service_base_url'; value='http://localhost:8085' },
        [ordered]@{ key='notification_service_base_url'; value='http://localhost:8087' },
        [ordered]@{ key='portfolio_service_base_url'; value='http://localhost:8088' },
        [ordered]@{ key='jwt_token'; value='' },
        [ordered]@{ key='internal_key'; value='WEALTHFORGE_INTERNAL_KEY' },
        [ordered]@{ key='company_id'; value='1' },
        [ordered]@{ key='stock_id'; value='1' },
        [ordered]@{ key='portfolio_id'; value='1' },
        [ordered]@{ key='from_portfolio_id'; value='1' },
        [ordered]@{ key='to_portfolio_id'; value='2' },
        [ordered]@{ key='advisor_id'; value='1' },
        [ordered]@{ key='investor_id'; value='1' },
        [ordered]@{ key='symbol'; value='AAPL' },
        [ordered]@{ key='question'; value='What is a balanced portfolio?' }
    )
    item = $collectionItems
}

$collectionPath = Join-Path $outDir 'WealthForge_API_Smoke.postman_collection.json'
$collection | ConvertTo-Json -Depth 100 | Set-Content -Path $collectionPath -Encoding UTF8

# Build smoke report rows from collection
$rows = @()
function Flatten-Items {
    param(
        [array]$Items,
        [string]$Service,
        [string]$Group
    )

    foreach ($it in $Items) {
        if ($it.Contains('item') -and -not $it.Contains('request')) {
            if (-not $Service) {
                Flatten-Items -Items $it.item -Service $it.name -Group ''
            } elseif (-not $Group) {
                Flatten-Items -Items $it.item -Service $Service -Group $it.name
            } else {
                Flatten-Items -Items $it.item -Service $Service -Group "$Group / $($it.name)"
            }
        } else {
            $authType = if ($it.request.auth) { 'Bearer JWT' } else { 'Public / Header-only' }
            $raw = $it.request.url.raw
            $script:rows += [PSCustomObject]@{
                Service  = $Service
                Group    = $Group
                Method   = $it.request.method
                Endpoint = $raw
                Auth     = $authType
                Name     = $it.name
            }
        }
    }
}

Flatten-Items -Items $collection.item -Service '' -Group ''

$totalCount = $rows.Count
$serviceCounts = $rows | Group-Object Service | Sort-Object Name

$report = @()
$report += '# WealthForge API Smoke Report'
$report += ''
$report += "Generated on: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$report += ''
$report += "Total endpoints in collection: $totalCount"
$report += ''
$report += '## Service-wise Count'
$report += ''
$report += '| Service | Endpoint Count |'
$report += '|---|---:|'
foreach ($sc in $serviceCounts) {
    $report += "| $($sc.Name) | $($sc.Count) |"
}
$report += ''
$report += '## Smoke Matrix'
$report += ''
$report += '| Service | Folder | Method | Endpoint | Auth | Request Name |'
$report += '|---|---|---|---|---|---|'
foreach ($r in $rows) {
    $report += "| $($r.Service) | $($r.Group) | $($r.Method) | $($r.Endpoint) | $($r.Auth) | $($r.Name) |"
}
$report += ''
$report += '## Notes'
$report += ''
$report += '- Fill `jwt_token` after login before running protected endpoints.'
$report += '- `internal_key` defaults to `WEALTHFORGE_INTERNAL_KEY` from investor-service config.'
$report += '- This is a smoke collection; all requests assert success status (200/201/202/204).'

$reportPath = Join-Path $outDir 'API_SMOKE_REPORT.md'
$report | Set-Content -Path $reportPath -Encoding UTF8

Write-Output "Generated: $collectionPath"
Write-Output "Generated: $reportPath"
Write-Output "Endpoint count: $totalCount"
