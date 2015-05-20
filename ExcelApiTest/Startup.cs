using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Batch;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using System.Web.UI.WebControls.WebParts;
using ExcelApiTest.Filters;
using ExcelApiTest.Formatters;
using ExcelApiTest.Model;
using Microsoft.OData.Edm;
using Newtonsoft.Json.Converters;
using Owin;

namespace ExcelApiTest
{
	public static class Startup
	{
        private static IEdmModel GetEdmModel()
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            //builder.Namespace = "Demos";
            //builder.ContainerName = "DefaultContainer";
            builder.EntitySet<Person>("Persons");
            var edmModel = builder.GetEdmModel();
            return edmModel;
        }


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

            //config.MapODataServiceRoute("odata", null, GetEdmModel(),
            //    new DefaultHttpBatchHandler(GlobalConfiguration.DefaultServer));
            //    config.EnsureInitialized();

		}
	}
}
