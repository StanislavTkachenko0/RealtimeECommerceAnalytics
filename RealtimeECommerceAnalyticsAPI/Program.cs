using RealtimeECommerceAnalytics.HUBs;
using RealtimeECommerceAnalytics.Shared.Extensions;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Configuration



// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddServices();
builder.Services.AddHttpClients();
builder.Services.AddHostedServices();

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(o => o.SetIsOriginAllowed(_ => true)
                                   .AllowAnyMethod()
                                   .AllowAnyHeader()
                                   .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.MapHub<MarketplaceHub>("/HUBs/marketplaceHub");

app.Run();
