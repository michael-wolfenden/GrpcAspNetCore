using GrpcAspNetCore.Host.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddGrpc();

var app = builder.Build();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.UseRouting();
app.UseGrpcWeb();
app.UseEndpoints(endpoints =>
{
    endpoints.MapGrpcService<GreeterService>().EnableGrpcWeb();
});

app.Run();
