using Greet.V1;
using Grpc.Core;

namespace GrpcAspNetCore.Host.Services;

public class GreeterService : Greet.V1.GreeterService.GreeterServiceBase
{
    public override Task<GreeterServiceSayHelloResponse> SayHello(GreeterServiceSayHelloRequest request, ServerCallContext context)
    {
        return Task.FromResult(new GreeterServiceSayHelloResponse
        {
            Message = "Hello " + request.Name
        });
    }
}
