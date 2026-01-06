---
title: Web Components and Native APIs
sidebar_position: 5
sidebar_label: Web Components
description: Use custom elements instead of frameworks for interactivity
---

# Web Components and Native APIs

When you need interactivity, use custom elements (web components) with native JavaScript. Do not use React, Vue, Svelte, jQuery, or other frameworks.

## Why Custom Elements

- No framework runtime to ship
- Works natively with Astro's HTML-first approach
- State is managed in the component class
- No hydration complexity

See the [Astro documentation on custom elements](https://docs.astro.build/en/guides/client-side-scripts/#web-components-with-custom-elements) for more details.

## Counter Example

✅ Good (Custom Element):

```astro
<counter-button>
  <button>Count: <span>0</span></button>
</counter-button>

<script>
  class CounterButton extends HTMLElement {
    private count = 0

    connectedCallback() {
      const span = this.querySelector('span')
      this.querySelector('button')?.addEventListener('click', () => {
        this.count++
        if (span) span.textContent = String(this.count)
      })
    }
  }

  customElements.define('counter-button', CounterButton)
</script>
```

❌ Avoid (React in Astro):

```astro
---
import Counter from '../components/Counter.tsx'
---

<!-- Requires @astrojs/react integration, ships React runtime -->
<Counter client:load />
```

```tsx
// Counter.tsx - separate file needed
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

❌ Avoid (Pure JavaScript with global state):

```astro
<button id="counter-btn">Count: 0</button>

<script>
  let count = 0
  const btn = document.getElementById('counter-btn')
  btn?.addEventListener('click', () => {
    count++
    btn.textContent = `Count: ${count}`
  })
</script>
```

❌ Avoid (jQuery-style with querySelector):

```astro
<button class="js-counter">Count: 0</button>

<script>
  let count = 0
  document.querySelector('.js-counter')?.addEventListener('click', (e) => {
    count++
    ;(e.target as HTMLElement).textContent = `Count: ${count}`
  })
</script>
```

## Key Principles

1. **Custom element tag**: Use a hyphenated name (e.g., `counter-button`, `copy-link`)
2. **State in class**: Store state as class properties
3. **connectedCallback**: Initialize when element is added to DOM
4. **No global selectors**: Query within `this`, not `document`
