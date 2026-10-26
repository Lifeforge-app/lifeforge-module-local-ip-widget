export interface Contract {
  getLocalIp: EndpointGetLocalIp;
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
