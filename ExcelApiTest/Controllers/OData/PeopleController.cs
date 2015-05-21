using System.Linq;
using System.Web.Http;
using System.Web.OData;
using ExcelApiTest.Data;

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

        //[NoCache]
        //[EnableQuery(AllowedQueryOptions = AllowedQueryOptions.Count)]
        //[Route("people")]        [HttpGet]
        [EnableQuery]
        public IHttpActionResult Get()
        {
            return Ok(this._dataStore.Persons.AsQueryable()); //Ok(_dataStore.Persons.AsQueryable());
        }
    }
}
