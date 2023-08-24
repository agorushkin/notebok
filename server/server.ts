import { Server, serve } from 'http';

import { render } from 'preact/render';

import { template } from '/client/main.tsx';

const clients  = new Map<string, WebSocket[]>();
const channels = new Map<string, string>();
const channel  = Deno.env.get('DEPLOY') === 'true' ? new BroadcastChannel('network') : null;
const server   = new Server();

if (channel) channel.onmessage = ({ data: { uuid, text } }) => broadcast(uuid, text);

const broadcast = (uuid: string, text: string) => {
  const [ ...sockets ] = clients.get(uuid) ?? [];

  for (const socket of sockets) socket.send(text);
  channel?.postMessage({ uuid, text });

  channels.set(uuid, text);
};

const isUUID = (uuid: string) => /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(uuid);

server.get('/', ({ redirect }) => {
  const uuid = crypto.randomUUID();
  redirect(`/${ uuid }`);
});

server.get('/:uuid', async ({ upgrade, respond, params: { uuid }, headers }) => {
  if (headers['upgrade'] !== 'websocket') return;
  if (!uuid || !isUUID(uuid)) return respond({ status: 400 });

  const socket = await upgrade();
  if (!socket) return;

  socket.onmessage = ({ data }) => broadcast(uuid, data);
  socket.onclose = () => {
    const [ ...sockets ] = clients.get(uuid) ?? [];
    clients.set(uuid, sockets.filter(s => s !== socket));
  };
  
  clients.get(uuid)?.push(socket);
});

server.get('/:uuid', ({ respond, params: { uuid }, cookies: { theme }, headers }) => {
  if (headers['upgrade'] === 'websocket') return;
  if (!uuid || !isUUID(uuid)) return respond({ status: 400 });

  const text = channels.get(uuid);

  respond({ body: render(template(text ?? '', theme === 'dark')), headers: { 'content-type': 'text/html' } });
});

server.get('/client/*', serve('./client/'));

server.listen(8000);
console.log('Server running on http://localhost:8000');