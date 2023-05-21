import { HttpServer, files } from 'server';
import { Channel } from './src/channel.ts';
import { Client } from './src/client.ts';

import { template as MainPage } from './client/main.tsx';
import { render } from 'preact/render';

import { validateUUID } from './src/validate-uuid.ts';

const server = new HttpServer();

const channels = new Map<string, Channel>();

server.route('/', 'GET')(({ respond }) => {
  const uuid = crypto.randomUUID();

  respond({ status: 302, headers: { location: `/${ uuid }` } });
});

server.route('/:uuid')(({ params: { uuid } }) => {
  if (!uuid || !validateUUID(uuid)) return;
  if (!channels.has(uuid)) channels.set(uuid, new Channel());
});

server.route('/:uuid')(({ respond, headers, cookies, params: { uuid } }) => {
  if (!uuid || !validateUUID(uuid)) return;

  const dark = cookies?.theme === 'dark';

  if (headers?.upgrade) return;

  const text = channels.get(uuid)?.data || '';
  const page = MainPage(text, dark);

  respond({
    body: render(page),
    headers: { 'content-type': 'text/html' },
  });
});

server.route('/:uuid')(async ({ upgrade, headers, params: { uuid } }) => {
  if (!uuid || !validateUUID(uuid)) return;

  if (!headers?.upgrade) return;

  const client = await upgrade();
  if (client) channels.get(uuid)?.connect(new Client(client));
});

server.route('/*')(({ respond }) => { respond({ status: 400 }) });

server.plugin(files('/client/', './client/'));

server.listen(8000);
console.log('Server running on http://localhost:8000');
