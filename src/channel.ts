import { createPayload, parsePayload, PayloadType } from './payload.ts';

export class Channel {
  #clients = new Set<WebSocket>();
  #unresponded = new Set<WebSocket>();

  data = '';

  constructor() {
    setInterval(this.heartbeat, 5000);
  }

  private heartbeat = () => {
    for (const client of this.#clients) {
      if (this.#unresponded.has(client)) {
        this.disconnect(client);
      }
    }

    this.#unresponded = new Set(this.#clients);

    this.send(PayloadType.Ping);
  };

  send = (type: PayloadType, data = '') => {
    const payload = createPayload(type, data);

    for (const client of this.#clients) {
      if (client.readyState === client.OPEN) client.send(payload);
    }
  };

  connect = (client: WebSocket) => {
    this.#clients.add(client);

    client.onmessage = ({ data }) => {
      const payload = parsePayload(data);

      if (!payload) return;

      switch (payload.type) {
        case PayloadType.Pong:
          this.#unresponded.delete(client);
          break;

        case PayloadType.Data:
          this.send(PayloadType.Data, payload.data);
          this.data = payload.data;
          break;

        default:
          this.disconnect(client);
      }
    };
  };

  disconnect = (client: WebSocket) => {
    this.#clients.delete(client);
    client.close();
  };
}
