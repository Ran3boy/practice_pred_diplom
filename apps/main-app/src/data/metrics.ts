import type { ComponentId, ImplementationRecord, TechnologyId } from './types';

const componentWeight: Record<ComponentId, number> = {
  counter: 0,
  todo: 9,
  'product-card': 7,
  tabs: 6,
  form: 11
};

const baseMetrics: Record<TechnologyId, Omit<ImplementationRecord['metrics'], 'lines' | 'files'>> = {
  'web-components': {
    dependencies: 0,
    buildKb: 8,
    buildMs: 420,
    renderMs: 12,
    responseMs: 18,
    readability: 3,
    complexity: 3,
    maintainability: 3,
    reuse: 5,
    realWorldFit: 4
  },
  react: {
    dependencies: 2,
    buildKb: 44,
    buildMs: 780,
    renderMs: 14,
    responseMs: 16,
    readability: 5,
    complexity: 2,
    maintainability: 5,
    reuse: 4,
    realWorldFit: 5
  },
  vue: {
    dependencies: 2,
    buildKb: 38,
    buildMs: 740,
    renderMs: 13,
    responseMs: 15,
    readability: 5,
    complexity: 2,
    maintainability: 4,
    reuse: 4,
    realWorldFit: 4
  },
  angular: {
    dependencies: 6,
    buildKb: 86,
    buildMs: 1300,
    renderMs: 18,
    responseMs: 20,
    readability: 4,
    complexity: 4,
    maintainability: 5,
    reuse: 3,
    realWorldFit: 5
  },
  vanilla: {
    dependencies: 0,
    buildKb: 5,
    buildMs: 250,
    renderMs: 10,
    responseMs: 14,
    readability: 3,
    complexity: 3,
    maintainability: 2,
    reuse: 2,
    realWorldFit: 2
  }
};

const descriptions: Record<TechnologyId, string> = {
  'web-components':
    'Реализация строится вокруг Custom Element и Shadow DOM: DOM и CSS изолированы, но состояние и события описываются вручную.',
  react:
    'React-вариант использует функциональный компонент, хуки состояния и декларативное описание UI.',
  vue:
    'Vue-вариант представлен как Single File Component: шаблон, script setup и scoped-стили собраны в одном модуле.',
  angular:
    'Angular-вариант вынесен в отдельное приложение монорепозитория и показывает компонентную модель с template, class и metadata.',
  vanilla:
    'Vanilla JS служит контрольной реализацией без фреймворка: DOM создается и обновляется напрямую.'
};

const codeByTechnology: Record<TechnologyId, Record<ComponentId, string>> = {
  'web-components': {
    counter: `class LabCounter extends HTMLElement {
  #value = 0;

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = \`
      <style>button { padding: 8px 12px; }</style>
      <button id="dec">-</button>
      <strong>\${this.#value}</strong>
      <button id="inc">+</button>
    \`;
    this.shadowRoot.querySelector('#dec').onclick = () => this.update(-1);
    this.shadowRoot.querySelector('#inc').onclick = () => this.update(1);
  }

  update(delta) {
    this.#value += delta;
    this.render();
  }
}`,
    todo: `class LabTodoList extends HTMLElement {
  #items = ['Описать сценарий', 'Сравнить реализацию'];

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  add(title) {
    this.#items = [...this.#items, title];
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = \`
      <form><input placeholder="Новая задача" /><button>Добавить</button></form>
      <ul>\${this.#items.map((item) => \`<li>\${item}</li>\`).join('')}</ul>
    \`;
  }
}`,
    'product-card': `class LabProductCard extends HTMLElement {
  #favorite = false;

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = \`
      <article>
        <h3>Design System Kit</h3>
        <p>Компонентная библиотека для UI-исследования.</p>
        <button>\${this.#favorite ? 'В избранном' : 'В избранное'}</button>
      </article>
    \`;
    this.shadowRoot.querySelector('button').onclick = () => {
      this.#favorite = !this.#favorite;
      this.render();
    };
  }
}`,
    tabs: `class LabTabs extends HTMLElement {
  #active = 'criteria';

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    const content = this.#active === 'criteria'
      ? 'Критерии K1-K10'
      : 'Профили P-A...P-D';
    this.shadowRoot.innerHTML = \`
      <button data-tab="criteria">Критерии</button>
      <button data-tab="profiles">Профили</button>
      <p>\${content}</p>
    \`;
  }
}`,
    form: `class LabForm extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render('');
  }

  render(message) {
    this.shadowRoot.innerHTML = \`
      <form>
        <input name="email" placeholder="email@example.com" />
        <textarea name="comment" placeholder="Комментарий"></textarea>
        <button>Отправить</button>
        <output>\${message}</output>
      </form>
    \`;
  }
}`
  },
  react: {
    counter: `export function Counter() {
  const [value, setValue] = useState(0);

  return (
    <div className="counter">
      <button onClick={() => setValue(value - 1)}>-</button>
      <strong>{value}</strong>
      <button onClick={() => setValue(value + 1)}>+</button>
    </div>
  );
}`,
    todo: `export function TodoList() {
  const [items, setItems] = useState(['Описать сценарий']);
  const [title, setTitle] = useState('');

  function addItem(event) {
    event.preventDefault();
    setItems([...items, title]);
    setTitle('');
  }

  return <form onSubmit={addItem}>...</form>;
}`,
    'product-card': `export function ProductCard() {
  const [favorite, setFavorite] = useState(false);

  return (
    <article className="product-card">
      <h3>Design System Kit</h3>
      <p>Компонентная библиотека для UI-исследования.</p>
      <button onClick={() => setFavorite(!favorite)}>
        {favorite ? 'В избранном' : 'В избранное'}
      </button>
    </article>
  );
}`,
    tabs: `export function Tabs() {
  const [active, setActive] = useState('criteria');

  return (
    <>
      <button onClick={() => setActive('criteria')}>Критерии</button>
      <button onClick={() => setActive('profiles')}>Профили</button>
      {active === 'criteria' ? <Criteria /> : <Profiles />}
    </>
  );
}`,
    form: `export function FeedbackForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    setError(email.includes('@') ? '' : 'Введите корректный email');
  }

  return <form onSubmit={submit}>...</form>;
}`
  },
  vue: {
    counter: `<script setup lang="ts">
import { ref } from 'vue';
const value = ref(0);
</script>

<template>
  <button @click="value--">-</button>
  <strong>{{ value }}</strong>
  <button @click="value++">+</button>
</template>`,
    todo: `<script setup lang="ts">
import { ref } from 'vue';
const items = ref(['Описать сценарий']);
const title = ref('');
const addItem = () => {
  items.value.push(title.value);
  title.value = '';
};
</script>

<template>
  <form @submit.prevent="addItem">...</form>
</template>`,
    'product-card': `<script setup lang="ts">
import { ref } from 'vue';
const favorite = ref(false);
</script>

<template>
  <article>
    <h3>Design System Kit</h3>
    <button @click="favorite = !favorite">
      {{ favorite ? 'В избранном' : 'В избранное' }}
    </button>
  </article>
</template>`,
    tabs: `<script setup lang="ts">
import { ref } from 'vue';
const active = ref<'criteria' | 'profiles'>('criteria');
</script>

<template>
  <button @click="active = 'criteria'">Критерии</button>
  <button @click="active = 'profiles'">Профили</button>
  <Criteria v-if="active === 'criteria'" />
  <Profiles v-else />
</template>`,
    form: `<script setup lang="ts">
import { computed, ref } from 'vue';
const email = ref('');
const isValid = computed(() => email.value.includes('@'));
</script>

<template>
  <form>
    <input v-model="email" />
    <p v-if="!isValid">Введите корректный email</p>
  </form>
</template>`
  },
  angular: {
    counter: `@Component({
  selector: 'app-counter',
  template: \`
    <button (click)="value = value - 1">-</button>
    <strong>{{ value }}</strong>
    <button (click)="value = value + 1">+</button>
  \`
})
export class CounterComponent {
  value = 0;
}`,
    todo: `@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html'
})
export class TodoListComponent {
  items = ['Описать сценарий'];
  title = '';

  addItem() {
    this.items = [...this.items, this.title];
    this.title = '';
  }
}`,
    'product-card': `@Component({
  selector: 'app-product-card',
  template: \`
    <article>
      <h3>Design System Kit</h3>
      <button (click)="favorite = !favorite">
        {{ favorite ? 'В избранном' : 'В избранное' }}
      </button>
    </article>
  \`
})
export class ProductCardComponent {
  favorite = false;
}`,
    tabs: `@Component({
  selector: 'app-tabs',
  template: \`
    <button (click)="active = 'criteria'">Критерии</button>
    <button (click)="active = 'profiles'">Профили</button>
    <ng-container [ngSwitch]="active">...</ng-container>
  \`
})
export class TabsComponent {
  active: 'criteria' | 'profiles' = 'criteria';
}`,
    form: `@Component({
  selector: 'app-feedback-form',
  templateUrl: './form-component.component.html'
})
export class FormComponent {
  email = '';
  comment = '';
  get isValid() {
    return this.email.includes('@') && this.comment.length > 3;
  }
}`
  },
  vanilla: {
    counter: `let value = 0;
const root = document.querySelector('#counter');

function render() {
  root.innerHTML = \`
    <button id="dec">-</button>
    <strong>\${value}</strong>
    <button id="inc">+</button>
  \`;
  document.querySelector('#dec').onclick = () => update(-1);
  document.querySelector('#inc').onclick = () => update(1);
}

function update(delta) {
  value += delta;
  render();
}`,
    todo: `const state = { items: ['Описать сценарий'] };

function addItem(title) {
  state.items.push(title);
  render();
}

function render() {
  root.innerHTML = state.items
    .map((item) => \`<li>\${item}</li>\`)
    .join('');
}`,
    'product-card': `let favorite = false;

function renderProductCard() {
  root.innerHTML = \`
    <article>
      <h3>Design System Kit</h3>
      <button>\${favorite ? 'В избранном' : 'В избранное'}</button>
    </article>
  \`;
  root.querySelector('button').onclick = () => {
    favorite = !favorite;
    renderProductCard();
  };
}`,
    tabs: `let active = 'criteria';

function renderTabs() {
  root.innerHTML = \`
    <button data-tab="criteria">Критерии</button>
    <button data-tab="profiles">Профили</button>
    <p>\${active === 'criteria' ? 'K1-K10' : 'P-A...P-D'}</p>
  \`;
}`,
    form: `const form = document.querySelector('form');
const output = document.querySelector('output');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = new FormData(form).get('email');
  output.textContent = String(email).includes('@')
    ? 'Данные приняты'
    : 'Введите корректный email';
});`
  }
};

export const implementations: ImplementationRecord[] = Object.entries(codeByTechnology).flatMap(
  ([technologyId, records]) =>
    Object.entries(records).map(([componentId, code]) => {
      const typedTechnologyId = technologyId as TechnologyId;
      const typedComponentId = componentId as ComponentId;
      const weight = componentWeight[typedComponentId];
      const base = baseMetrics[typedTechnologyId];

      return {
        technologyId: typedTechnologyId,
        componentId: typedComponentId,
        description: descriptions[typedTechnologyId],
        code,
        metrics: {
          ...base,
          files: typedTechnologyId === 'angular' ? 3 : typedTechnologyId === 'vue' ? 1 : 1,
          lines: Math.round(code.split('\n').length + weight + (typedTechnologyId === 'angular' ? 14 : 0)),
          buildKb: base.buildKb + weight,
          buildMs: base.buildMs + weight * 18,
          renderMs: base.renderMs + Math.round(weight / 3),
          responseMs: base.responseMs + Math.round(weight / 4)
        }
      };
    })
);

export function getImplementation(technologyId: TechnologyId, componentId: ComponentId) {
  const record = implementations.find(
    (item) => item.technologyId === technologyId && item.componentId === componentId
  );

  if (!record) {
    throw new Error(`Implementation not found: ${technologyId}/${componentId}`);
  }

  return record;
}
