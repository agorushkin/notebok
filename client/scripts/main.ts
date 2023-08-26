/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

const $ = document.querySelector.bind(document);

const body  = $('body')!;
const count = $('#counter')!;
const input = $('#text')! as HTMLTextAreaElement;
const theme = $('#theme')! as HTMLButtonElement;
const uuid  = location.pathname.slice(1);

let socket: WebSocket

const connect = () => {
  socket = new WebSocket(`${ location.protocol === 'https:' ? 'wss:' : 'ws:' }//${ location.host }/${ uuid }`);

  socket.onclose = () => {
    input.disabled = true;
    setTimeout(connect, 1000);
  };

  socket.onmessage = ({ data }) => {
    count.textContent = `${ data.length }, ${ data.split(/\s+/).filter(Boolean).length }`;
    input.value = data;
  };

  socket.onopen = () => {
    input.disabled = false;
  };
};

input.oninput = () => {
  count.textContent = `${ input.value.length }, ${ input.value.split(/\s+/).filter(Boolean).length }`;
  socket?.send(input.value);
};

theme.onclick = () => {
  body.classList.toggle('dark');
  document.cookie = `theme=${ body.classList.contains('dark') ? 'dark' : 'light' }; path=/`;
};

connect();