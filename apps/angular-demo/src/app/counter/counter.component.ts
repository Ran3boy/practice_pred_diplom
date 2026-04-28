import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <article class="demo-card">
      <h2>Counter</h2>
      <div class="row">
        <button (click)="value = value - 1">-</button>
        <strong>{{ value }}</strong>
        <button (click)="value = value + 1">+</button>
      </div>
    </article>
  `,
  styles: [
    `
      .row {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      strong {
        min-width: 42px;
        text-align: center;
        font-size: 24px;
      }
    `
  ]
})
export class CounterComponent {
  value = 0;
}
