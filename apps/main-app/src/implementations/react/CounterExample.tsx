import { useState } from 'react';

export function CounterExample() {
  const [value, setValue] = useState(0);

  return (
    <div>
      <button onClick={() => setValue(value - 1)}>-</button>
      <strong>{value}</strong>
      <button onClick={() => setValue(value + 1)}>+</button>
    </div>
  );
}
