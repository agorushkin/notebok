// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const $ = document.querySelector.bind(document);
const body = $('body');
const counter = $('#counter');
const textField = $('#text');
const themeButton = $('#theme');
const uuid = location.pathname.slice(1);
const connect = ()=>{
    const socket = new WebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/${uuid}`);
    textField.oninput = ()=>socket.send(getText());
    socket.onmessage = ({ data })=>setText(data);
    socket.onclose = ()=>setTimeout(connect, 2000);
};
const updateCounter = (text)=>{
    counter.textContent = `${text.length}, ${text.split(/\s+/).filter(Boolean).length}`;
};
const getText = ()=>{
    return $('#text').value;
};
const setText = (text)=>{
    $('#text').value = text;
    updateCounter(text);
};
textField.oninput = ()=>updateCounter(getText());
themeButton.addEventListener('click', ()=>{
    body.classList.toggle('dark');
    document.cookie = `theme=${body.classList.contains('dark') ? 'dark' : 'light'}; path=/`;
});
connect();
