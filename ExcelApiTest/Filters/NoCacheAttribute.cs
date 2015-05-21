using System.Net.Http.Headers;
using System.Web.Http.Filters;

namespace ExcelApiTest.Filters
{
    public class NoCacheAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext context)
        {
            if (context != null && context.Response != null)
            {
                context.Response.Headers.CacheControl = new CacheControlHeaderValue()
                {
                    NoCache = true,
                    Private = true
                };
            }

            base.OnActionExecuted(context);
        }
    }
}
