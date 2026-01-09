import { useState } from 'react';

const DEFAULT_CONTENT = `---
marp: true
theme: default
---

# Hello Marp!

This is a slide.

---

# Another Slide

- Bullet point 1
- Bullet point 2
`;

export const useEditor = () => {
  const [content, setContent] = useState<string>(DEFAULT_CONTENT);

  return {
    content,
    setContent,
  };
};
