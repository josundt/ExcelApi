using System.Linq;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Query;
using System.Web.OData.Routing;
using ExcelApiTest.Data;
using ExcelApiTest.Filters;
using ExcelApiTest.Model;

namespace ExcelApiTest.Controllers
{
    [EnableCsvFormat]
    [EnableExcelFormat(WildcardAcceptEnabled = true)]
    public class PersonsController : ApiController //ODataController
    {
        private readonly DataStore _dataStore;
        
        public PersonsController()
        {
            _dataStore = new DataStore();
        }

        [NoCache]
        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.Count)]
        [Route("persons")]
        public IQueryable<Person> /*IHttpActionResult*/ Get()
        {
            return this._dataStore.Persons.AsQueryable(); //Ok(_dataStore.Persons.AsQueryable());
        }
    }
}
