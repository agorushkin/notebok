import { Payload, PayloadType } from './payload.ts';

interface Events {
  'close': () => void;
  'receive': (payload: string) => void;
}

export class Client {
  #socket : WebSocket;
  #alive  = true;

  #events: Events = {
    close: () => {},
    receive: () => {},
  };

  constructor(socket: WebSocket) {
    this.#socket  = socket;

    socket.onmessage = ({ data }) => this.receive(data);
  }

  heartbeat = () => {
    if (!this.#alive) return this.#socket.close();

    this.send(Payload.create(PayloadType.Ping));
    this.#alive = false;
  };

  receive = (data: string) => {
    const payload = Payload.parse(data);
    if (!payload) return;

    ({
      [ payload.type ]: () => {},
      [ PayloadType.Pong ]: () => {
        this.#alive = true;
      },

      [ PayloadType.Data ]: () => {
        this.#events.receive(data);
      },

      [ PayloadType.Error ]: () => {
        this.#socket.close();
        this.#events.close();
      },

    })[ payload.type ]()
  };

  send = (payload: string) => {
    if (this.#socket.readyState !== this.#socket.OPEN) return;
    this.#socket.send(payload);
  };

  on = <K extends keyof Events>(event: K, callback: Events[K]) => {
    if (event === 'close') this.#events.close = callback as () => void;
    if (event === 'receive') this.#events.receive = callback as (payload: string) => void;
  };
}