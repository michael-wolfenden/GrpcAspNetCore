import {
  createGrpcWebTransport,
  createPromiseClient,
} from "@bufbuild/connect-web";
import { GreeterService } from "./grpc/greet/v1/greet_connectweb";

const transport = createGrpcWebTransport({
  baseUrl: window.location.origin,
});

export const grpcClient = createPromiseClient(GreeterService, transport);
