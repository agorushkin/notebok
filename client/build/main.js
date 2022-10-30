// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

var PayloadType;
(function(PayloadType) {
    PayloadType[PayloadType["Ping"] = 0x00] = "Ping";
    PayloadType[PayloadType["Pong"] = 0x01] = "Pong";
    PayloadType[PayloadType["Data"] = 0x02] = "Data";
    PayloadType[PayloadType["Error"] = 0x03] = "Error";
})(PayloadType || (PayloadType = {}));
const createPayload = (type, data = '')=>{
    return JSON.stringify({
        type,
        data
    });
};
const validatePayload = (payload)=>{
    if (typeof payload !== 'object' || payload === null) return false;
    const { type , data  } = payload;
    return typeof type === 'number' && typeof data === 'string';
};
const parsePayload = (data)=>{
    try {
        data = JSON.parse(`${data}`);
    } catch  {
        data = null;
    }
    return validatePayload(data) ? data : null;
};
const $ = document.querySelector.bind(document);
const body = $('body');
const setTheme = (theme)=>{
    theme === 'dark' ? body.classList.add('dark') : body.classList.remove('dark');
    document.cookie = `theme=${theme}; path=/; max-age=31536000`;
};
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const counter = $('#counter');
const textField = $('#text');
const themeButton = $('#theme');
const uuid = location.pathname.slice(1);
const updateCounter = ()=>{
    const text = textField.value;
    counter.textContent = `${text.length}, ${text.split(/\s+/).filter(Boolean).length}`;
};
const getText = ()=>{
    return $('#text').value;
};
const setText = (text)=>{
    $('#text').value = text;
};
textField.addEventListener('input', ()=>{
    updateCounter();
});
const cycleTheme = ()=>{
    body.classList.contains('dark') ? setTheme('light') : setTheme('dark');
};
themeButton.addEventListener('click', ()=>{
    cycleTheme();
});
let socket = new WebSocket(`${protocol}//${window.location.host}/${uuid}/connect`);
const send = (type, data = '')=>{
    socket.send(createPayload(type, data));
};
socket.addEventListener('message', (event)=>{
    const payload = parsePayload(event.data);
    if (!payload) return;
    const { type , data  } = payload;
    switch(type){
        case PayloadType.Ping:
            send(PayloadType.Pong);
            break;
        case PayloadType.Data:
            setText(data);
            updateCounter();
            break;
        case PayloadType.Error:
            console.error(data);
    }
});
socket.onclose = ()=>{
    const interval = setInterval(()=>{
        socket = new WebSocket(`${protocol}//${window.location.host}/${uuid}/connect`);
        socket.onopen = ()=>{
            clearInterval(interval);
        };
    }, 2000);
};
textField.addEventListener('input', ()=>send(PayloadType.Data, getText()));
export { body as body };
export { counter as counter };
export { textField as textField };
export { themeButton as themeButton };
export { uuid as uuid };
export { updateCounter as updateCounter };
export { getText as getText };
export { setText as setText };
