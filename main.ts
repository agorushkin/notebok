import { WebServer } from 'https://agorushkin.deno.dev/modules/http-server';

import { Template } from './src/template.ts';
import { getText, setText } from './src/storage.ts';
import { file } from './src/file.ts';

const server = new WebServer();

const texts: Record<string, string> = {};
const dates: Record<string, number> = {};
const stacks: Record<string, [ number, number | string ][]> = {};
const clients: Record<string, Set<WebSocket>> = {};

server.use('/')(({ respond }) => {
  respond({ status: 302, headers: { Location: `/${ crypto.randomUUID() }` } });
});

const html = await file('./client/main.html');

server.use('/:uuid')(async ({ respond, params, headers }) => {
  if (!html) return respond({ status: 404 });
  const uuid = params.uuid;
  
  const cookie = headers.cookie;
  const theme  = cookie?.includes('theme=dark') ? 'dark' : 'light';
  
  const template = new Template(html);

  const text = texts[uuid] ?? await getText(uuid) ?? '';
  
  if (theme == 'dark') template.insert('class="dark"', 'theme');
  template.insert(text, 'text');
  template.clear();
  respond({ body: template.text, headers: { 'Content-Type': 'text/html' } });
});

server.use('/ws/:uuid')(async ({ upgrade, params }) => {
  const socket = await upgrade();

  if (!socket) return;

  const uuid = params.uuid;

  if (!clients[uuid]) clients[uuid] = new Set();

  clients[uuid].add(socket);

  socket.onmessage = ({ data }) => {
    texts[uuid] = data;
    [...clients[uuid]].filter(client => client != socket).forEach(client => {
      client.send(data);
    });
  };

  socket.onclose = () => clients[uuid].delete(socket);
});

server.use('/save/:uuid', 'POST')(async ({ body, params }) => {
  const text = await body.text();
  const uuid = params.uuid;

  if (texts[uuid] === text) return;
  texts[uuid] = text;
  
  if (dates[uuid] > Date.now() - 1000 * 60 * 5) return;
  dates[uuid] = Date.now();
  setText(uuid, text);
});

server.static('/client', './client');
server.open(8000);
console.log('Server running on http://localhost:8000');