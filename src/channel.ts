import { Payload } from './payload.ts';
import { Client } from './client.ts';

export class Channel {
  #clients = new Set<Client>();
  data     = '';

  broadcast = (payload: string) => {
    const { data } = Payload.parse(payload)!;
    this.data = data;

    for (const client of this.#clients) client.send(payload);
  }

  connect = (client: Client) => {
    const heartbeat = setInterval(client.heartbeat, 3000);

    this.#clients.add(client);

    client.on('close', () => {
      clearInterval(heartbeat);
      this.#clients.delete(client);
    });
    client.on('receive', (payload) => {
      this.broadcast(payload);
    });
  };
}