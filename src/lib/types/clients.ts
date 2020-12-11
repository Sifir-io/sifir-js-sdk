type Command = string;
export interface Transport {
  get: <T>(command: Command, payload?: any) => Promise<T>;
  post: <T>(command: Command, payload: any) => Promise<T>;
}
export interface HTTPTransportParam {
  gatewayUrl: string;
  proxyUrl?: string;
  caCert: string;
  customHeaders?: ({
    payload,
    command
  }: {
    payload: any;
    command: string;
  }) => Promise<object> | null;
}
export interface ClientConfig {
  transport?: Transport;
}
