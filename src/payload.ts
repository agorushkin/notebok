export enum PayloadType {
  Ping = 0x00,
  Pong = 0x01,
  Data = 0x02,
  Error = 0x03,
}

export interface Payload {
  type: PayloadType;
  data: string;
}

export class Payload {
  static create = (type: PayloadType, data = '') => {
    return JSON.stringify({ type, data });
  };

  static validate = (payload: unknown): payload is Payload => {
    if (typeof payload !== 'object' || payload === null) return false;

    const { type, data } = payload as Payload;

    return typeof type === 'number' && typeof data === 'string';
  };

  static parse = (data: unknown): Payload | null => {
    try {
      data = JSON.parse(`${data}`);
    } catch {
      data = null;
    }

    return Payload.validate(data) ? data : null;
  };
}