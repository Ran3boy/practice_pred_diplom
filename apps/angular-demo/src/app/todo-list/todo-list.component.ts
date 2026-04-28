import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule, NgFor],
  template: `
    <article class="demo-card">
      <h2>Todo List</h2>
      <form (ngSubmit)="addItem()">
        <input name="title" [(ngModel)]="title" placeholder="Новая задача" />
        <button>Добавить</button>
      </form>
      <ul>
        <li *ngFor="let item of items">{{ item }}</li>
      </ul>
    </article>
  `,
  styles: [
    `
      form {
        display: flex;
        gap: 8px;
      }
    `
  ]
})
export class TodoListComponent {
  title = '';
  items = ['Описать сценарий', 'Сравнить реализацию'];

  addItem() {
    if (!this.title.trim()) {
      return;
    }

    this.items = [...this.items, this.title];
    this.title = '';
  }
}
