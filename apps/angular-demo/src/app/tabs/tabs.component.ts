import { Component } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgSwitch, NgSwitchCase, NgSwitchDefault],
  template: `
    <article class="demo-card">
      <h2>Tabs</h2>
      <div class="row">
        <button (click)="active = 'criteria'">Критерии</button>
        <button (click)="active = 'profiles'">Профили</button>
      </div>
      <p [ngSwitch]="active">
        <span *ngSwitchCase="'criteria'">K1-K10 описывают свойства технологий.</span>
        <span *ngSwitchDefault>P-A...P-D описывают профили проектов.</span>
      </p>
    </article>
  `,
  styles: [
    `
      .row {
        display: flex;
        gap: 8px;
      }
    `
  ]
})
export class TabsComponent {
  active: 'criteria' | 'profiles' = 'criteria';
}
