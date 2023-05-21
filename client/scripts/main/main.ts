/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { toggleTheme } from './theme.ts';
import './websocket.ts';

const $ = document.querySelector.bind(document);

export const body = $('body')!;
export const counter = $('#counter')!;
export const textField = $('#text')! as HTMLTextAreaElement;
export const themeButton = $('#theme')!;

export const uuid = location.pathname.slice(1);

export const updateCounter = (text: string) => {
  counter.textContent = `${text.length}, ${
    text.split(/\s+/).filter(Boolean).length
  }`;
};

export const getText = () => {
  return ($('#text') as HTMLTextAreaElement).value;
};

export const setText = (text: string) => {
  ($('#text') as HTMLTextAreaElement).value = text;
};

textField.addEventListener('input', () => {
  updateCounter(getText());
});

themeButton.addEventListener('click', toggleTheme);
