import { getText, setText, textField, uuid } from './main.ts';
import { updateCounter } from './main.ts';

import { Payload, PayloadType } from '/src/payload.ts';


const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const address = `${ protocol }//${ window.location.host }/${ uuid }`;

let socket = new WebSocket(address);

const send = (type: PayloadType, data = '') => {
  socket.send(Payload.create(type, data));
};

socket.onmessage = ({ data }) => {
  const payload = Payload.parse(data)!;

  ({
    [ payload.type ]: () => {},
    [ PayloadType.Ping ]: () => {
      send(PayloadType.Pong);
    },

    [ PayloadType.Data ]: () => {
      console.log(payload.data);
      setText(payload.data);
      updateCounter(payload.data);
    },

  })[ payload.type ]();
};

socket.onclose = () => {
  const interval = setInterval(() => {
    if (socket.readyState !== socket.CLOSED) return;
    socket = new WebSocket(address);

    socket.onopen = () => { clearInterval(interval) };
  }, 2000);
};

textField.addEventListener('input', () => send(PayloadType.Data, getText()));
