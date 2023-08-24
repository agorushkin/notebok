/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

const $ = document.querySelector.bind(document);

const body        = $('body')!;
const counter     = $('#counter')!;
const textField   = $('#text')! as HTMLTextAreaElement;
const themeButton = $('#theme')!;

const uuid = location.pathname.slice(1);

const connect = () => {
  const socket = new WebSocket(`${ location.protocol === 'https:' ? 'wss:' : 'ws:' }//${ location.host }/${ uuid }`);

  textField.addEventListener('input', () => socket.send(getText()));
  socket.onclose = () => setTimeout(connect, 2000);

  socket.onmessage = ({ data }) => {
    setText(data);

    console.log('Received: ', data);
  };
};

const updateCounter = (text: string) => {
  counter.textContent = `${text.length}, ${
    text.split(/\s+/).filter(Boolean).length
  }`;
};

const getText = () => {
  return ($('#text') as HTMLTextAreaElement).value;
};

const setText = (text: string) => {
  ($('#text') as HTMLTextAreaElement).value = text;
  updateCounter(text);
};

textField.addEventListener('input', () => {
  updateCounter(textField.value);
});

themeButton.addEventListener('click', () => {
  body.classList.toggle('dark');
  document.cookie = `theme=${ body.classList.contains('dark') ? 'dark' : 'light' }; path=/`;
});

connect();