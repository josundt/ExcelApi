using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using ExcelApiTest.Filters;
using ExcelApiTest.Formatters;
using Newtonsoft.Json.Converters;
using Owin;

namespace ExcelApiTest
{
	public static class Startup
	{
		public static void Configuration(IAppBuilder app)
		{
            app.Use(async (context, next) =>
            {
                var languageCookie = context.Request.Cookies["language"];
                if (languageCookie != null)
                {
                    var culture = new CultureInfo(languageCookie);
                    Thread.CurrentThread.CurrentCulture = culture;
                    Thread.CurrentThread.CurrentUICulture = culture;
                }
                await next.Invoke();
            });
            
            var config = new HttpConfiguration();
			
			config.MapHttpAttributeRoutes();

			config.Formatters.JsonFormatter.Indent = true;
			config.Formatters.JsonFormatter.SerializerSettings.Converters.Add(new StringEnumConverter());
			
			config.Formatters.XmlFormatter.Indent = true;
			
			app.UseWebApi(config);

		}
	}
}
