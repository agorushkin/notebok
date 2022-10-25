// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const $ = document.querySelector.bind(document);
const body = $('body');
const setTheme = (theme)=>{
    theme === 'dark' ? body.classList.add('dark') : body.classList.remove('dark');
    document.cookie = `theme=${theme}; path=/; max-age=31536000`;
};
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const counter = $('#counter');
const textArea = $('#text');
const themeButton = $('#theme');
const uuid = location.pathname.slice(1);
const socket = new WebSocket(`${protocol}//${window.location.host}/ws/${uuid}`);
socket.onmessage = ({ data  })=>{
    const decoded = JSON.parse(data);
    if (decoded.type === 0) return;
    textArea.value = decoded.data;
};
export { textArea as textArea };
const updateCounter = ()=>{
    const text = textArea.value;
    counter.textContent = `${text.length}, ${text.split(/\s+/).filter(Boolean).length}`;
};
setInterval(()=>socket.send(JSON.stringify({
        type: 0
    })), 10000);
const sendUpdatedText = ()=>socket.send(JSON.stringify({
        type: 1,
        data: textArea.value
    }));
textArea.addEventListener('input', ()=>{
    updateCounter();
    sendUpdatedText();
});
const cycleTheme = ()=>{
    body.classList.contains('dark') ? setTheme('light') : setTheme('dark');
};
themeButton.addEventListener('click', ()=>{
    cycleTheme();
});
export { body as body };
export { counter as counter };
export { themeButton as themeButton };
export { uuid as uuid };
