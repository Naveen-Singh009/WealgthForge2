import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TransactionRoutingModule } from './transaction-routing-module';
import { TransactionHistoryComponent } from './transaction-history/transaction-history';
import { BuySellComponent } from './buy-sell/buy-sell';
import { FundTransferComponent } from './fund-transfer/fund-transfer';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [TransactionHistoryComponent, BuySellComponent, FundTransferComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, TransactionRoutingModule],
})
export class TransactionModule {}
