import { WebServer } from 'server';
import { Channel } from './src/channel.ts';

import { template as MainPage } from '/client/main.tsx';
import { render } from 'preact/render';

import { validateUUID } from './src/validate-uuid.ts';

const server = new WebServer();

const channels = new Map<string, Channel>();

server.static('/client', './client');

server.use('/', 'GET', ({ respond }) => {
  const uuid = crypto.randomUUID();

  respond({ status: 302, headers: { location: `/${ uuid }` } });
});

server.use('/:uuid/*', 'GET', ({ respond, params: { uuid } }) => {
  if (!validateUUID(uuid)) return respond({ status: 404 });

  const channel = new Channel();
  if (!channels.has(uuid)) channels.set(uuid, channel);
});

server.use('/:uuid', 'GET', ({ respond, headers, params: { uuid } }) => {
  const cookie = headers.cookie;
  const dark   = cookie?.includes('theme=dark');

  const text = channels.get(uuid)?.data || '';
  const page = MainPage(text, dark);
  
  respond({
    body: render(page),
    headers: { 'content-type': 'text/html' }
  });
});

server.use('/:uuid/connect', 'GET', async ({ upgrade, params: { uuid } }) => {
  const client = await upgrade();

  if (client) channels.get(uuid)?.connect(client);
});

server.open(8000);
console.log('Server running on http://localhost:8000');