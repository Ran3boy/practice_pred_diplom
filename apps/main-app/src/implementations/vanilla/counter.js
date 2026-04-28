let value = 0;

export function mountCounter(root) {
  function render() {
    root.innerHTML = `
      <button id="dec">-</button>
      <strong>${value}</strong>
      <button id="inc">+</button>
    `;
    root.querySelector('#dec').addEventListener('click', () => update(-1));
    root.querySelector('#inc').addEventListener('click', () => update(1));
  }

  function update(delta) {
    value += delta;
    render();
  }

  render();
}
