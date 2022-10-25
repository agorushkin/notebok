/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { cycleTheme } from './theme.ts';
import { sendUpdatedText } from './websocket.ts';

const $ = document.querySelector.bind(document);

export const body        = $('body')!;
export const counter     = $('#counter')!;
export const textArea    = $('#text')! as HTMLTextAreaElement;
export const themeButton = $('#theme')!;

export const uuid = location.pathname.slice(1);

const updateCounter = () => {
  const text = textArea.value;
  counter.textContent = `${ text.length }, ${ text.split(/\s+/).filter(Boolean).length }`;
};

textArea.addEventListener('input', () => {
  updateCounter();
  sendUpdatedText();
});

themeButton.addEventListener('click', () => {
  cycleTheme();
});