# GrpcAspNetCore

[Connect-Web](https://buf.build/blog/connect-web-protobuf-grpc-in-the-browser), an idiomatic TypeScript library for calling RPC servers from web browsers was recently released. This is a sample demonstrating it's use with `Grpc.AspNetCore.Web`.

## Requirements

The following is required to run this application:

* [PNPM](https://pnpm.io/) - This is just the package manager that I use. Feel free to replace with your favourite package manager. If you decide to use something else you'll need to update the use of `PNPM` in the [package.json](src/GrpcAspNetCore.Host/ClientApp/package.json) scripts as well as the `PNPM` commands in [GrpcAspNetCore.Host.csproj](src/GrpcAspNetCore.Host/GrpcAspNetCore.Host.csproj)

* [docker](https://www.docker.com/) - The typescript grpc client is generated using [buf](https://github.com/bufbuild/buf). While you can use the `buf` binary, I wanted this repository to work cross platform so I chose to use `docker` to run `buf` instead. You can look at the `buf:lint` and `buf:generate` scripts in [package.json](src/GrpcAspNetCore.Host/ClientApp/package.json) for reference.

## Running

You can run the application either from your favourite IDE or by running the following command from the root directory and navigating to [https://localhost:5001](https://localhost:5001)

`dotnet run --project src\GrpcAspNetCore.Host`

This may take a while as on first build the application will

- Run `pnpm install`
- This will trigger a post install script that runs `pnpm generate-grpc-client`
- `pnpm generate-grpc-client` will pull down the `bufbuild/buf` docker image and run `buf lint` and `buf generate`

## GRPC client generation

The GRPC client is generated using [buf](https://github.com/bufbuild/buf). There is a configuration file [buf.gen.yaml](src/GrpcAspNetCore.Host/ClientApp/buf.gen.yaml) that controls where the client is output to and the language to generate.

The core command used to generate the client is:

`cross-env-shell docker run --rm -v $INIT_CWD/..:/workspace --workdir /workspace bufbuild/buf generate --template ClientApp/buf.gen.yaml ./Protos`

`cross-env-shell` is used so we can refer to `$INIT_CWD` in a cross platform way. `$INIT_CWD` will point to the directory the script is ran in and allows us mount the parent directory of `package.json` as a volume so the when we run `bufbuild/buf` container it has access to both the `Proto` folder containing the proto files and the `buf.gen.yaml` configuration file. 

## Endpoints

This application [listens on two endpoints](src/GrpcAspNetCore.Host/appsettings.json)

* [https://localhost:5001](https://localhost:5001) - This endpoint uses the `Http1AndHttp2` protocol. `gRPC-Web` works with both HTTP/1.1 and HTTP/2. Some platforms, such as UWP or Unity, can't use HTTP/2. To support all client apps, we configure the server to enable HTTP/1.1 and HTTP/2.
* [http://localhost:5000](http://localhost:5000) - This endpoint uses the `Http2` protocol and is `http` only. This endpoint exists to allow calling the service via grpc test tools. For example  [greeter-service.http](src/GrpcAspNetCore.Host/greeter-service.http).

## CORS

Vite is configured to proxy calls to the grpc service from the front end [https://localhost:3000](https://localhost:3000) to the backend [https://localhost:5001](https://localhost:5001) to prevent having to configure CORS. See [vite.config.ts](src/GrpcAspNetCore.Host/ClientApp/vite.config.ts) for details.

## License

This project is licensed under the [MIT License](LICENSE.md)