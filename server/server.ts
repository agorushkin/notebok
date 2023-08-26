import { Server, serve } from 'http';

import { render } from 'preact/render';

import { template } from '/client/pages/main.tsx';

const channels = new Map<string, string>();
const clients  = new Map<string, Set<WebSocket>>();
const uuids    = new Map<WebSocket, string>();

const region = Deno.env.get('DENO_REGION') ?? 'local';
const server = new Server();

const channel = new BroadcastChannel('network');
channel.onmessage = ({ data }: { data: Payload }) => {
  console.log(`[${ region }] ${ data.sender } (client, network) -> ${ data.channel } (channel, local, ${ clients.get(data.channel)?.size }) { ${ data.text.length ?? 0 } }`);
  data.origin = false;
  broadcast(data);
};

interface Payload {
  sender: string;
  channel: string;
  origin: boolean;
  text: string;
}

const broadcast = (payload: Payload) => {
  console.log(`[${ region }] ${ payload.sender } (client, ${ payload.origin ? 'broadcast' : 'network' }) -> ${ payload.channel } (channel, ${ clients.get(payload.channel)?.size }) { ${ payload.text.length ?? 0 } }`);

  const sockets = clients.get(payload.channel) ?? [];
  if (payload.origin) {
    console.log(`[${ region }] ${ payload.channel } (channel, broadcast) -> network { ${ payload.text.length ?? 0 } }`);
    channel.postMessage(payload);
  }

  for (const socket of sockets) if (uuids.get(socket) !== payload.sender) socket.send(payload.text);
  channels.set(payload.channel, payload.text);
};

const create = (channel: string) => {
  if (!channels.get(channel)) channels.set(channel, '');
  if (!clients.get(channel))  clients.set(channel, new Set());

  return channels.get(channel) ?? '';
};

server.get('/', ({ redirect }) => {
  const uuid = crypto.randomUUID();
  redirect(`/${ uuid }`);
});

server.get('/:channel', async ({ upgrade, respond, params: { channel }, headers }) => {
  if (headers['upgrade'] !== 'websocket') return;
  if (!channel) return respond({ status: 400 });

  const socket = await upgrade();
  if (!socket) return;

  const id = crypto.randomUUID();

  create(channel);

  uuids.set(socket, id);
  clients.get(channel)?.add(socket);

  console.log(`[${ region }] ${ channel } (channel, ${ clients.get(channel)?.size }) : ${ id } (client, open)`);

  socket.onmessage = ({ data }) => broadcast({ sender: id, channel, origin: true, text: data.toString() });
  socket.onclose = () => {
    clients.get(channel)?.delete(socket);
    uuids.delete(socket);
    
    console.log(`[${ region }] ${ channel } (channel, ${ clients.get(channel)?.size }) : ${ id } (client, closed)`);
  };
});

server.get('/:channel', ({ respond, params: { channel }, cookies: { theme }, headers }) => {
  if (headers['upgrade'] === 'websocket') return;
  if (!channel) return respond({ status: 400 });

  const text = create(channel);

  respond({ body: render(template(text ?? '', theme === 'dark')), headers: { 'content-type': 'text/html' } });
});

server.get('/public/*', serve('./public/'));

server.listen(8000);
console.log(`Server running on ${ region }`);
