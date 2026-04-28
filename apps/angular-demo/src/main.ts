import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { CounterComponent } from './app/counter/counter.component';
import { TodoListComponent } from './app/todo-list/todo-list.component';
import { ProductCardComponent } from './app/product-card/product-card.component';
import { TabsComponent } from './app/tabs/tabs.component';
import { FormComponent } from './app/form-component/form-component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    CounterComponent,
    TodoListComponent,
    ProductCardComponent,
    TabsComponent,
    FormComponent
  ],
  template: `
    <main class="shell">
      <header>
        <span>Angular demo</span>
        <h1>Сопоставимые Angular-компоненты</h1>
        <p>Отдельное приложение монорепозитория подтверждает присутствие Angular в проекте.</p>
      </header>

      <section class="grid">
        <app-counter />
        <app-todo-list />
        <app-product-card />
        <app-tabs />
        <app-form-component />
      </section>
    </main>
  `
})
class AppComponent {}

bootstrapApplication(AppComponent).catch((error) => console.error(error));
