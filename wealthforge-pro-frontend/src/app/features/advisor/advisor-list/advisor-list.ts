import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize, map, of, switchMap, timer } from 'rxjs';

import { AdvisorService } from '../../../core/services/advisor.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ToastService } from '../../../core/services/toast.service';
import { Advisor } from '../../../shared/models/advisor.model';
import { InvestorSummary } from '../../../shared/models/investor.model';
import { UserRole } from '../../../shared/models/user.model';

interface ChatMessage {
  sender: 'INVESTOR' | 'ADVISOR' | 'SYSTEM';
  text: string;
  timestamp: string;
}

@Component({
  selector: 'app-advisor-list',
  standalone: false,
  templateUrl: './advisor-list.html',
  styleUrl: './advisor-list.scss',
})
export class AdvisorListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly advisorService = inject(AdvisorService);
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);

  advisors: Advisor[] = [];
  userRole: UserRole | null = null;
  allocatedAdvisorIds: number[] = [];
  assignedInvestors: InvestorSummary[] = [];
  mappedAdvisor: Advisor | null = null;
  activeChatAdvisor: Advisor | null = null;
  advisorChatHistory: Record<number, ChatMessage[]> = {};
  isAdvisorTyping = false;
  removingAdvisorId: number | null = null;

  readonly allocationForm = this.fb.nonNullable.group({
    advisorId: [0, [Validators.required, Validators.min(1)]],
  });

  readonly chatForm = this.fb.nonNullable.group({
    message: ['', [Validators.required, Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    this.loadAdvisors();
  }

  loadAdvisors(): void {
    this.loadingService.show();

    this.advisorService.getAdvisors().pipe(
      switchMap((response) => {
        this.advisors = response.data ?? [];
        this.allocatedAdvisorIds = [];
        this.assignedInvestors = [];
        this.mappedAdvisor = null;

        if (this.isInvestor) {
          const investorId = this.authService.getCurrentUserId();
          if (!investorId) {
            return of(null);
          }

          return this.advisorService.getAllocatedAdvisorIds(investorId).pipe(
            map((allocatedAdvisorIds) => {
              this.allocatedAdvisorIds = allocatedAdvisorIds ?? [];
              return null;
            })
          );
        }

        if (this.isAdvisor) {
          this.mappedAdvisor = this.resolveLoggedInAdvisor();
          if (!this.mappedAdvisor) {
            return of(null);
          }

          return this.advisorService.getAllocatedInvestorIds(this.mappedAdvisor.id).pipe(
            switchMap((investorIds) => this.advisorService.getInvestorsByIds(investorIds)),
            map((investors) => {
              this.assignedInvestors = investors ?? [];
              return null;
            })
          );
        }

        return of(null);
      })
    ).subscribe({
      next: () => {},
      error: () => {
        this.toastService.show('error', 'Advisor Error', 'Unable to fetch advisor list.');
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  get isInvestor(): boolean {
    return this.userRole === 'INVESTOR';
  }

  get isAdvisor(): boolean {
    return this.userRole === 'ADVISOR';
  }

  get isInChatMode(): boolean {
    return this.isInvestor && !!this.activeChatAdvisor;
  }

  get allocatedAdvisors(): Advisor[] {
    return this.advisors.filter((advisor) => this.isAllocated(advisor.id));
  }

  get activeChatMessages(): ChatMessage[] {
    if (!this.activeChatAdvisor) {
      return [];
    }

    return this.advisorChatHistory[this.activeChatAdvisor.id] ?? [];
  }

  allocate(): void {
    const advisorId = Number(this.allocationForm.controls.advisorId.value);
    const selectedAdvisor = this.advisors.find((advisor) => Number(advisor.id) === advisorId) ?? null;

    if (!advisorId || !selectedAdvisor) {
      this.allocationForm.markAllAsTouched();
      this.toastService.show('error', 'Advisor Error', 'Selected advisor was not found.');
      return;
    }

    if (this.isInvestor) {
      const investorId = this.authService.getCurrentUserId();
      if (!investorId) {
        this.allocationForm.markAllAsTouched();
        this.toastService.show('error', 'Allocation Failed', 'Investor profile is unavailable for allocation.');
        return;
      }

      this.loadingService.show();

      this.advisorService.allocateAdvisor({ advisorId, investorId }).subscribe({
        next: () => {
          if (!this.allocatedAdvisorIds.includes(advisorId)) {
            this.allocatedAdvisorIds.push(advisorId);
          }
          this.startChat(selectedAdvisor);
        },
        error: () => {
          this.toastService.show('error', 'Allocation Failed', 'Unable to allocate selected advisor.');
        },
        complete: () => {
          this.loadingService.hide();
        },
      });
      return;
    }

    const investorId = this.authService.getCurrentUserId();
    if (!investorId) {
      this.allocationForm.markAllAsTouched();
      this.toastService.show('error', 'Allocation Failed', 'Investor profile is unavailable for allocation.');
      return;
    }

    this.loadingService.show();

    this.advisorService.allocateAdvisor({ advisorId, investorId }).subscribe({
      next: () => {
        this.toastService.show('success', 'Advisor Allocated', 'Advisor allocation completed.');
        if (!this.allocatedAdvisorIds.includes(advisorId)) {
          this.allocatedAdvisorIds.push(advisorId);
        }
      },
      error: () => {
        this.toastService.show('error', 'Allocation Failed', 'Unable to allocate selected advisor.');
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  isAllocated(advisorId: number): boolean {
    return this.allocatedAdvisorIds.includes(advisorId);
  }

  removeAdvisor(advisorId: number): void {
    if (!this.isInvestor || this.removingAdvisorId === advisorId) {
      return;
    }

    const investorId = this.authService.getCurrentUserId();
    if (!investorId) {
      this.toastService.show('error', 'Remove Failed', 'Investor profile is unavailable.');
      return;
    }

    this.removingAdvisorId = advisorId;
    this.loadingService.show();

    this.advisorService.deallocateAdvisor({ advisorId, investorId }).subscribe({
      next: () => {
        this.allocatedAdvisorIds = this.allocatedAdvisorIds.filter((id) => id !== advisorId);
        if (this.activeChatAdvisor?.id === advisorId) {
          this.exitChat();
        }

        if (Number(this.allocationForm.controls.advisorId.value) === advisorId) {
          this.allocationForm.controls.advisorId.setValue(0);
        }

        this.toastService.show('success', 'Advisor Removed', 'Advisor removed from your allocation list.');
      },
      error: () => {
        this.toastService.show('error', 'Remove Failed', 'Unable to remove selected advisor.');
      },
      complete: () => {
        this.loadingService.hide();
        this.removingAdvisorId = null;
      },
    });
  }

  exitChat(): void {
    this.activeChatAdvisor = null;
    this.isAdvisorTyping = false;
    this.chatForm.reset({ message: '' });
  }

  sendMessage(): void {
    if (!this.activeChatAdvisor) {
      return;
    }

    const text = this.chatForm.controls.message.value.trim();
    if (!text) {
      this.chatForm.markAllAsTouched();
      return;
    }

    const advisorId = this.activeChatAdvisor.id;
    this.appendChatMessage(advisorId, {
      sender: 'INVESTOR',
      text,
      timestamp: new Date().toISOString(),
    });

    this.chatForm.reset({ message: '' });
    this.isAdvisorTyping = true;
    timer(900)
      .pipe(
        switchMap(() => this.advisorService.askChatbot(text)),
        finalize(() => {
          this.isAdvisorTyping = false;
        })
      )
      .subscribe({
        next: (answer) => {
          this.appendChatMessage(advisorId, {
            sender: 'ADVISOR',
            text: answer || "Sorry, I don't know this answer.",
            timestamp: new Date().toISOString(),
          });
        },
        error: () => {
          this.appendChatMessage(advisorId, {
            sender: 'ADVISOR',
            text: 'Unable to fetch response right now. Please try again.',
            timestamp: new Date().toISOString(),
          });
        },
      });
  }

  private startChat(advisor: Advisor, showToast = true): void {
    this.activeChatAdvisor = advisor;

    if (!this.advisorChatHistory[advisor.id]) {
      this.advisorChatHistory[advisor.id] = [];
    }

    if (this.advisorChatHistory[advisor.id].length === 0) {
      this.appendChatMessage(advisor.id, {
        sender: 'SYSTEM',
        text: `You are now connected with ${advisor.name}.`,
        timestamp: new Date().toISOString(),
      });
    }

    if (showToast) {
      this.toastService.show('success', 'Chat Ready', `You can now chat with ${advisor.name}.`);
    }
  }

  private appendChatMessage(advisorId: number, message: ChatMessage): void {
    if (!this.advisorChatHistory[advisorId]) {
      this.advisorChatHistory[advisorId] = [];
    }

    this.advisorChatHistory[advisorId].push(message);
  }

  private resolveLoggedInAdvisor(): Advisor | null {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return null;
    }

    const normalizedEmail = currentUser.email?.trim().toLowerCase() ?? '';
    const advisorByEmail = this.advisors.find((advisor) => advisor.email?.trim().toLowerCase() === normalizedEmail) ?? null;
    if (advisorByEmail) {
      return advisorByEmail;
    }

    return this.advisors.find((advisor) => Number(advisor.id) === Number(currentUser.id)) ?? null;
  }
}
