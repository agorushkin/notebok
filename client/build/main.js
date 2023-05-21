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
class Payload {
    static create = (type, data = '')=>{
        return JSON.stringify({
            type,
            data
        });
    };
    static validate = (payload)=>{
        if (typeof payload !== 'object' || payload === null) return false;
        const { type , data  } = payload;
        return typeof type === 'number' && typeof data === 'string';
    };
    static parse = (data)=>{
        try {
            data = JSON.parse(`${data}`);
        } catch  {
            data = null;
        }
        return Payload.validate(data) ? data : null;
    };
}
const $ = document.querySelector.bind(document);
const body = $('body');
const toggleTheme = ()=>{
    body.classList.toggle('dark');
};
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const counter = $('#counter');
const textField = $('#text');
const themeButton = $('#theme');
const uuid = location.pathname.slice(1);
const updateCounter = (text)=>{
    counter.textContent = `${text.length}, ${text.split(/\s+/).filter(Boolean).length}`;
};
const getText = ()=>{
    return $('#text').value;
};
const setText = (text)=>{
    $('#text').value = text;
};
textField.addEventListener('input', ()=>{
    updateCounter(getText());
});
themeButton.addEventListener('click', toggleTheme);
const address = `${protocol}//${window.location.host}/${uuid}`;
let socket = new WebSocket(address);
const send = (type, data = '')=>{
    socket.send(Payload.create(type, data));
};
socket.onmessage = ({ data  })=>{
    const payload = Payload.parse(data);
    ({
        [payload.type]: ()=>{},
        [PayloadType.Ping]: ()=>{
            send(PayloadType.Pong);
        },
        [PayloadType.Data]: ()=>{
            console.log(payload.data);
            setText(payload.data);
            updateCounter(payload.data);
        }
    })[payload.type]();
};
socket.onclose = ()=>{
    const interval = setInterval(()=>{
        if (socket.readyState !== socket.CLOSED) return;
        socket = new WebSocket(address);
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
