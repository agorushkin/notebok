const socket = new WebSocket(`ws://${ window.location.host }/ws/${ pageUUID }`);

socket.onmessage = ({ data }) => {
  contentField.value = data;
};

const sendUpdate = () => {
  socket.send(contentField.value);
}