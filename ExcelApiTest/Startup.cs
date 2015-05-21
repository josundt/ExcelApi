using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Batch;
using System.Web.OData;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using System.Web.UI.WebControls.WebParts;
using ExcelApiTest.Data;
using ExcelApiTest.Filters;
using ExcelApiTest.Formatters;
using ExcelApiTest.Model;
using Microsoft.Framework.DependencyInjection;
using Microsoft.OData.Edm;
using Newtonsoft.Json.Converters;
using Owin;

namespace ExcelApiTest
{
	public class Startup
	{
        private IEdmModel GetEdmModel()
        {
            var builder = new ODataConventionModelBuilder
            {
                Namespace = "ExcelApiTest.Model",
                ContainerName = "DefaultContainer"
            };

            builder.EntitySet<Person>("People");
            //builder.AddEnumType(typeof (Gender));
            var edmModel = builder.GetEdmModel();
            
            return edmModel;
        }

		public void Configuration(IAppBuilder app)
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
			
            //config.Formatters.JsonFormatter.Indent = true;
            //config.Formatters.JsonFormatter.SerializerSettings.Converters.Add(new StringEnumConverter());
			
            //config.Formatters.XmlFormatter.Indent = true;

            config.MapHttpAttributeRoutes();
		    config.Routes.MapHttpRoute(
		        name: "DefaultApi",
		        routeTemplate: "api/{controller}/{id}",
		        defaults: new {id = RouteParameter.Optional});

            //config.AddODataQueryFilter();
            //config.MessageHandlers.Add(new ETagMessageHandler());
            config.MapODataServiceRoute(
                "odata",
                "odata",
                GetEdmModel(),
                null//new DefaultHttpBatchHandler(GlobalConfiguration.DefaultServer)
                );

            config.EnsureInitialized();

            app.UseWebApi(config);
        }
	}
}
