using Olx.BLL.Exceptions;
using System.Net;
using System.Text.Json;
using FluentValidation;

namespace OLX.API.Middlewares
{
    public class GlobalExceptionHandlerMiddleware(RequestDelegate next)
    {
        
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (HttpException httpError)
            {
                if (httpError.Value is not null)
                {
                    await CreateResponse(context, httpError.Status, httpError.Value);
                }
                else
                {
                    await CreateResponse(context, httpError.Status, httpError.Message);
                }
            }
            catch (ValidationException validationError)
            {
                await CreateResponse(context, HttpStatusCode.BadRequest, validationError.Errors);
            }
            catch (KeyNotFoundException error)
            {
                await CreateResponse(context, HttpStatusCode.NotFound, error.Message);
            }
            catch (Exception error)
            {
                await CreateResponse(context, HttpStatusCode.InternalServerError, error.Message);
            }
        }

        private async Task CreateResponse(HttpContext context,
                                    HttpStatusCode statusCode = HttpStatusCode.InternalServerError,
                                    string message = "Unknown error type!")
        {
            await CreateResponse(context, statusCode, new { message });
        }

        private async Task CreateResponse(HttpContext context,
                                    HttpStatusCode statusCode,
                                    object errors)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;
            var result = JsonSerializer.Serialize(errors);
            await context.Response.WriteAsync(result);
        }
    }
}
