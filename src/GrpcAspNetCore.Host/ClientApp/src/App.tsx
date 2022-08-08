import { useQuery } from "@tanstack/react-query";
import { grpcClient } from "./grpc-client";

export default function App() {
  const { isLoading, error, data } = useQuery(["say-hello"], ({ signal }) =>
    grpcClient.sayHello({ name: "world" }, { signal })
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error has occurred: {String(error)}</p>;

  return <div className="App">{data?.message}</div>;
}
