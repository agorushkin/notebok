import { body } from './main.ts';

export const toggleTheme = () => {
  body.classList.toggle('dark');
};
