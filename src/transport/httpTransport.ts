import * as agent from "superagent";
import superproxy from "superagent-proxy";
import {HTTPTransportParam, Transport} from "../lib/types/clients";
export default (param: HTTPTransportParam):Transport => {
  const {gatewayUrl , proxyUrl , customHeaders , caCert} = param;
  // Extend superagent with proxyUrl
  if(proxyUrl && proxyUrl.length) {
    superproxy(agent);
  }
  const transport = {
    async get(command: string, payload?: any): Promise<any> {
      const request = agent
        .get(`${gatewayUrl}${command}/${payload ? payload : ""}`)
      if(proxyUrl) {
        request.proxy(proxyUrl)
      }
     if(caCert) {
       request.ca(caCert)
     }
    if(typeof customHeaders === 'function'){
            const headers = await customHeaders({ command, payload });
            if(headers)
            request.set(headers);

    }

    const {body} = await request.send();
    return body;
    },
    async post(command: string, payload: any): Promise<any> {
      const request = agent .post(`${gatewayUrl}${command}`)
        if(caCert) {
            request.ca(caCert)
        }
        if(typeof customHeaders === 'function'){
            const headers = await customHeaders({ command, payload });
            if(headers)
            request.set(headers);
        }
        const {body} = await request.send(payload);
      return body;
    }
  };

  return {
    ...transport
  };
};
