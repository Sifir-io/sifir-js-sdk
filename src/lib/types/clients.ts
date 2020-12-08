type CypherNodeCommand = string;
export interface Transport {
  get: <T>(command: CypherNodeCommand, payload?: any) => Promise<T>;
  post: <T>(command: CypherNodeCommand, payload: any) => Promise<T>;
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
