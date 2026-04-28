const baseStyles = `
  :host { display: block; font-family: Inter, system-ui, sans-serif; color: #16202a; }
  button { border: 0; border-radius: 6px; padding: 8px 12px; background: #0f766e; color: white; cursor: pointer; font-weight: 700; }
  button.secondary { background: #e8eef2; color: #16202a; }
  input, textarea { border: 1px solid #c8d3dc; border-radius: 6px; padding: 9px 10px; font: inherit; }
  .stack { display: grid; gap: 10px; }
  .row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  .panel { border: 1px solid #d7e0e7; border-radius: 8px; padding: 14px; background: #ffffff; }
`;

class LabCounter extends HTMLElement {
  private value = 0;

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  private update(delta: number) {
    this.value += delta;
    this.render();
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>${baseStyles} strong { min-width: 42px; text-align: center; font-size: 22px; }</style>
      <div class="row panel">
        <button class="secondary" id="dec">-</button>
        <strong>${this.value}</strong>
        <button id="inc">+</button>
      </div>
    `;
    this.shadowRoot!.querySelector('#dec')!.addEventListener('click', () => this.update(-1));
    this.shadowRoot!.querySelector('#inc')!.addEventListener('click', () => this.update(1));
  }
}

class LabTodoList extends HTMLElement {
  private items = [
    { title: 'Описать сценарий', done: true },
    { title: 'Сравнить реализацию', done: false }
  ];

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>${baseStyles} li { margin: 7px 0; } label { display: flex; gap: 8px; align-items: center; }</style>
      <div class="stack panel">
        <form class="row">
          <input name="title" placeholder="Новая задача" />
          <button>Добавить</button>
        </form>
        <ul>${this.items
          .map(
            (item, index) =>
              `<li><label><input type="checkbox" data-index="${index}" ${item.done ? 'checked' : ''} />${item.title}</label></li>`
          )
          .join('')}</ul>
      </div>
    `;
    this.shadowRoot!.querySelector('form')!.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = new FormData(event.currentTarget as HTMLFormElement).get('title')?.toString().trim();
      if (title) {
        this.items = [...this.items, { title, done: false }];
        this.render();
      }
    });
    this.shadowRoot!.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((input) => {
      input.addEventListener('change', () => {
        const index = Number(input.dataset.index);
        this.items[index].done = input.checked;
      });
    });
  }
}

class LabProductCard extends HTMLElement {
  private favorite = false;

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>${baseStyles} h3 { margin: 0; } .price { font-size: 24px; font-weight: 800; }</style>
      <article class="stack panel">
        <h3>Design System Kit</h3>
        <p>Компонентная библиотека для UI-исследования.</p>
        <span class="price">4 900 ₽</span>
        <button>${this.favorite ? 'В избранном' : 'В избранное'}</button>
      </article>
    `;
    this.shadowRoot!.querySelector('button')!.addEventListener('click', () => {
      this.favorite = !this.favorite;
      this.render();
    });
  }
}

class LabTabs extends HTMLElement {
  private active: 'criteria' | 'profiles' = 'criteria';

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  private render() {
    const text =
      this.active === 'criteria'
        ? 'Критерии K1-K10 фиксируют свойства технологии.'
        : 'Профили P-A...P-D показывают область целесообразного применения.';

    this.shadowRoot!.innerHTML = `
      <style>${baseStyles} .active { background: #0f766e; color: #fff; }</style>
      <div class="stack panel">
        <div class="row">
          <button class="${this.active === 'criteria' ? 'active' : 'secondary'}" data-tab="criteria">Критерии</button>
          <button class="${this.active === 'profiles' ? 'active' : 'secondary'}" data-tab="profiles">Профили</button>
        </div>
        <p>${text}</p>
      </div>
    `;
    this.shadowRoot!.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        this.active = button.dataset.tab as 'criteria' | 'profiles';
        this.render();
      });
    });
  }
}

class LabForm extends HTMLElement {
  private message = '';

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>${baseStyles} form { display: grid; gap: 10px; } output { min-height: 22px; font-weight: 700; color: #0f766e; }</style>
      <form class="panel">
        <input name="email" placeholder="email@example.com" />
        <textarea name="comment" placeholder="Комментарий"></textarea>
        <button>Отправить</button>
        <output>${this.message}</output>
      </form>
    `;
    this.shadowRoot!.querySelector('form')!.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget as HTMLFormElement);
      const email = data.get('email')?.toString() ?? '';
      const comment = data.get('comment')?.toString() ?? '';
      this.message = email.includes('@') && comment.length > 3 ? 'Данные приняты' : 'Проверьте email и комментарий';
      this.render();
    });
  }
}

const define = (name: string, constructor: CustomElementConstructor) => {
  if (!customElements.get(name)) {
    customElements.define(name, constructor);
  }
};

define('lab-counter', LabCounter);
define('lab-todo-list', LabTodoList);
define('lab-product-card', LabProductCard);
define('lab-tabs', LabTabs);
define('lab-form', LabForm);
