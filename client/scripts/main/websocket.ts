import { textArea, uuid } from './main.ts';

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

const socket = new WebSocket(`${ protocol }//${ window.location.host }/ws/${ uuid }`)

socket.onmessage = ({ data }) => {
  const decoded = JSON.parse(data);

  if (decoded.type === 0) return;
  textArea.value = decoded.data;
}

setInterval(() => socket.send(JSON.stringify({ type: 0 })), 10000);

export const sendUpdatedText = () => socket.send(JSON.stringify({ type: 1, data: textArea.value }));