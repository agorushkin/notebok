import { body } from './main.ts';

const setTheme = (theme: string) => {
  theme === 'dark' ? body.classList.add('dark') : body.classList.remove('dark');

  document.cookie = `theme=${theme}; path=/; max-age=31536000`;
};

export const cycleTheme = () => {
  body.classList.contains('dark') ? setTheme('light') : setTheme('dark');
};
