const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const socket = new WebSocket(`${ protocol }://${ window.location.host }/ws/${ pageUUID }`);

socket.onmessage = ({ data }) => {
  contentField.value = data;
};

const sendUpdate = () => {
  socket.send(contentField.value);
}