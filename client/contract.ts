export type EndpointQuotesRandom_OutputOK = {
  q: string;
  a: string;
  url: string;
}[];

export interface Contract {
  getLocalIp: EndpointGetLocalIp;
  quotes: {
    random: EndpointQuotesRandom;
  };
}
export interface EndpointGetLocalIp {
  method: "get";
  input: {};
  output: {
    OK: EndpointGetLocalIp_OutputOK;
  };
  media: null;
}
export interface EndpointGetLocalIp_OutputOK {
  addresses: string[];
}
export interface EndpointQuotesRandom {
  method: "get";
  input: {};
  output: {
    OK: EndpointQuotesRandom_OutputOK;
  };
  media: null;
}
