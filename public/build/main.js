// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const $ = document.querySelector.bind(document);
const body = $('body');
const count = $('#counter');
const input = $('#text');
const theme = $('#theme');
const uuid = location.pathname.slice(1);
let socket;
const connect = ()=>{
    const client = new WebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/${uuid}`);
    socket = client;
    client.onclose = ()=>setTimeout(connect, 1000);
    client.onmessage = ({ data })=>input.value = data;
};
input.oninput = ()=>{
    count.textContent = `${input.value.length}, ${input.value.split(/\s+/).filter(Boolean).length}`;
    socket?.send(input.value);
};
theme.onclick = ()=>{
    body.classList.toggle('dark');
    document.cookie = `theme=${body.classList.contains('dark') ? 'dark' : 'light'}; path=/`;
};
connect();
