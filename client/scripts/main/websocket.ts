import { textArea, uuid } from './main.ts';

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

const createSocket = () => new WebSocket(`${ protocol }//${ window.location.host }/ws/${ uuid }`)

let socket = createSocket();

socket.onmessage = ({ data }) => textArea.value = data;
socket.onclose = () => socket = createSocket();

setInterval(() => socket.send(JSON.stringify({ type: 0 })), 10000);

export const sendUpdatedText = () => socket.send(textArea.value);