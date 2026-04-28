import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <button (click)="value = value - 1">-</button>
    <strong>{{ value }}</strong>
    <button (click)="value = value + 1">+</button>
  `
})
export class CounterComponent {
  value = 0;
}
