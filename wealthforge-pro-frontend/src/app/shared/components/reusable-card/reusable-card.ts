import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-reusable-card',
  standalone: false,
  templateUrl: './reusable-card.html',
  styleUrl: './reusable-card.scss',
})
export class ReusableCardComponent {
  @Input() title = '';
  @Input() value: string | number | null = '';
  @Input() subtitle = '';
  @Input() subtitleHighlight = '';
  @Input() subtitleHighlightClass = '';
  @Input() trendClass = '';
  @Input() icon = 'bi-graph-up-arrow';
}
