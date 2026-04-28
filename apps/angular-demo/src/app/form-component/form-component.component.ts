import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-component',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form class="demo-card" (ngSubmit)="submit()">
      <h2>Form Component</h2>
      <input name="email" [(ngModel)]="email" placeholder="email@example.com" />
      <textarea name="comment" [(ngModel)]="comment" placeholder="Комментарий"></textarea>
      <button>Отправить</button>
      <output>{{ message }}</output>
    </form>
  `
})
export class FormComponent {
  email = '';
  comment = '';
  message = '';

  submit() {
    this.message = this.email.includes('@') && this.comment.length > 3 ? 'Данные приняты' : 'Проверьте email и комментарий';
  }
}
