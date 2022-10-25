import { WebServer } from 'https://agorushkin.deno.dev/modules/http-server';
import { render } from 'preact/render';

import MainPage from './client/main.tsx';

const server = new WebServer();

const texts: Record<string, string> = {};
const clients: Record<string, Set<WebSocket>> = {};

server.use('/')(({ respond }) => {
  respond({ status: 302, headers: { Location: `/${ crypto.randomUUID() }` } });
});

server.use('/:uuid')(({ respond, params: { uuid }, headers }) => {
  const cookie = headers.cookie;
  const dark   = cookie?.includes('theme=dark');

  const text = texts[uuid] || '';
  const page = MainPage(text, dark);

  respond({
    body: render(page),
    headers: { 'Content-Type': 'text/html' }
  });
});

server.use('/ws/:uuid')(async ({ upgrade, params: { uuid } }) => {
  const socket = await upgrade();
  if (!socket) return;

  if (!clients[uuid]) clients[uuid] = new Set();
  clients[uuid].add(socket);

  socket.onmessage = ({ data }) => {
    const decoded = JSON.parse(data);

    if (decoded.type === 0) return socket.send(JSON.stringify({ type: 1 }));

    const text = decoded.data as string;
    texts[uuid] = text;
    [...clients[uuid]].filter(client => client != socket).forEach(client => {
      client.send(text);
    });
  };

  socket.onclose = () => clients[uuid].delete(socket);
});

server.use('/save/:uuid', 'POST')(async ({ body, params: { uuid } }) => {
  const text = await body.text();

  if (texts[uuid] === text) return;
  texts[uuid] = text;
});

server.static('/client', './client');
server.open(8000);
console.log('Server running on http://localhost:8000');