import { getText, setText, textField, uuid } from './main.ts';
import { updateCounter } from './main.ts';

import {
  createPayload,
  parsePayload,
  PayloadType,
} from '../../../src/payload.ts';

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

let socket = new WebSocket(
  `${protocol}//${window.location.host}/${uuid}/connect`,
);

const send = (type: PayloadType, data = '') => {
  socket.send(createPayload(type, data));
};

socket.addEventListener('message', (event) => {
  const payload = parsePayload(event.data);

  if (!payload) return;

  const { type, data } = payload;

  switch (type) {
    case PayloadType.Ping:
      send(PayloadType.Pong);
      break;

    case PayloadType.Data:
      setText(data);
      updateCounter(data);
      break;

    case PayloadType.Error:
      console.error(data);
  }
});

socket.onclose = () => {
  const interval = setInterval(() => {
    socket = new WebSocket(
      `${protocol}//${window.location.host}/${uuid}/connect`,
    );

    socket.onopen = () => {
      clearInterval(interval);
    };
  }, 2000);
};

textField.addEventListener('input', () => send(PayloadType.Data, getText()));
