import { Component } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: `
    <article class="demo-card">
      <h2>Product Card</h2>
      <h3>Design System Kit</h3>
      <p>Компонентная библиотека для UI-исследования.</p>
      <strong>4 900 ₽</strong>
      <button (click)="favorite = !favorite">{{ favorite ? 'В избранном' : 'В избранное' }}</button>
    </article>
  `
})
export class ProductCardComponent {
  favorite = false;
}
