import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role-guard';
import { TransactionHistoryComponent } from './transaction-history/transaction-history';
import { BuySellComponent } from './buy-sell/buy-sell';
import { FundTransferComponent } from './fund-transfer/fund-transfer';

const routes: Routes = [
  {
    path: '',
    component: TransactionHistoryComponent,
    canActivate: [roleGuard],
    data: { roles: ['INVESTOR', 'ADMIN'] },
  },
  {
    path: 'trade',
    component: BuySellComponent,
    canActivate: [roleGuard],
    data: { roles: ['INVESTOR', 'ADMIN'] },
  },
  {
    path: 'transfer',
    component: FundTransferComponent,
    canActivate: [roleGuard],
    data: { roles: ['INVESTOR'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule {}
