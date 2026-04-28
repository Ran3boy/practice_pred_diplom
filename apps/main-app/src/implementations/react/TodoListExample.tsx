import { useState } from 'react';

export function TodoListExample() {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState(['Описать сценарий']);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim()) return;
        setItems([...items, title]);
        setTitle('');
      }}
    >
      <input value={title} onChange={(event) => setTitle(event.target.value)} />
      <button>Добавить</button>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </form>
  );
}
