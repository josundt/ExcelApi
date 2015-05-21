using System.Linq;
using System.Web.Http;
using System.Web.OData;
using ExcelApiTest.Data;
using ExcelApiTest.Filters;

namespace ExcelApiTest.Controllers.OData
{
    //[EnableCsvFormat]
    //[EnableExcelFormat(WildcardAcceptEnabled = true)]
    public class PeopleController : ODataController
    {
        private readonly DataStore _dataStore;
        
        public PeopleController()
        {
            _dataStore = new DataStore();
        }

        [NoCache]
        [EnableQuery]
        public IHttpActionResult Get()
        {
            return Ok(this._dataStore.Persons.AsQueryable());
        }
    }
}
