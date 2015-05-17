using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Reflection;
using System.Resources;
using System.Text.RegularExpressions;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace ExcelApiTest.Formatters
{
    public class ExcelFormatter : BufferedMediaTypeFormatter
    {
        public ExcelFormatter(bool wildcardAcceptEnabled)
        {
            SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            if (wildcardAcceptEnabled)
            {
                this.MediaTypeMappings.Add(new RequestHeaderMapping("Accept", "*/*", StringComparison.Ordinal, true, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            }
        }

        public override bool CanReadType(Type type)
        {
            return false;
        }

        public override bool CanWriteType(Type type)
        {
            var canWrite = type.ImplementsGenericInterface(typeof(IEnumerable<>));
            return canWrite;
        }

        public override void WriteToStream(Type type, object value, Stream writeStream, HttpContent content)
        {
            var enumerable = value as IEnumerable<object>;
            var items = enumerable != null ? enumerable.ToList() : null;
            var itemType = type.GetFirstGenericTypeParameter(typeof(IEnumerable<>));

            using (ExcelPackage pck = new ExcelPackage())
            {
                ExcelWorksheet ws = pck.Workbook.Worksheets.Add(itemType.Name);

                var colCount = WriteColumns(itemType, ws);

                WriteDataRows(items, itemType, ws);

                for (var i = 1; i <= colCount; i++)
                {
                    ws.Column(i).AutoFit();
                }

                content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attacment")
                {
                    FileName = string.Format("{0}Report_{1}.xlsx", itemType.Name, DateTime.UtcNow.ToString("yyyyMMdd-HHmmss"))
                };
                pck.SaveAs(writeStream);
            }
        }

        private int WriteColumns(Type type, ExcelWorksheet ws)
        {
            PropertyInfo[] propInfos = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);

            var colIndex = 0;
            foreach (var propInfo in propInfos.Where(propInfo => propInfo.PropertyType.IsSupportedPropertyType()))
            {
                colIndex++;
                string label = null;
                var displayAttrib = propInfo.GetFirstCustomAttribute<DisplayAttribute>();
                if (displayAttrib != null)
                {
                    try
                    {
                        if (displayAttrib.ResourceType != null)
                        {
                            var resourceManager = new ResourceManager(displayAttrib.ResourceType);
                            label = resourceManager.GetString(displayAttrib.Name);
                        }
                        else
                        {
                            label = displayAttrib.Name;
                        }
                    }
                    catch
                    {
                        // ignored
                    }
                }

                if (label == null)
                {
                    label = propInfo.Name;
                }

                ws.Cells[1, colIndex].Value = label;
                ApplyColumnFormat(propInfo, ws.Column(colIndex));

            }

            //Format the header for column 1-3
            using (ExcelRange rng = ws.Cells[1, 1, 1, colIndex])
            {
                rng.Style.Font.Bold = true;
                rng.Style.Fill.PatternType = ExcelFillStyle.Solid;                      //Set Pattern for the background to Solid
                rng.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(79, 129, 189));  //Set color to dark blue
                rng.Style.Font.Color.SetColor(Color.White);
            }

            return colIndex;
        }

        private void ApplyColumnFormat(PropertyInfo propertyInfo, ExcelColumn column)
        {
            var type = propertyInfo.PropertyType;
            var formatAttrib = propertyInfo.GetFirstCustomAttribute<DisplayFormatAttribute>();
            var format = formatAttrib != null ? formatAttrib.DataFormatString : null;

            if (type == typeof(Decimal))
            {
                column.Style.Numberformat.Format = GetExcelNumberFormat(format, 2);
                column.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
            }
            if (type == typeof (int) || type == typeof (double))
            {
                column.Style.Numberformat.Format = GetExcelNumberFormat(format, 0);
                column.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
            }
        }

        private void WriteDataRows(List<object> entities, Type entityType, ExcelWorksheet ws)
        {
            var rowIndex = 1;
            foreach (var entity in entities)
            {
                rowIndex++;
                PropertyInfo[] propInfos = entityType.GetProperties(BindingFlags.Public | BindingFlags.Instance);

                var colIndex = 0;
                foreach (var propInfo in propInfos)
                {
                    if (propInfo.PropertyType.IsSupportedPropertyType())
                    {
                        colIndex++;
                        ws.Cells[rowIndex, colIndex].Value = propInfo.GetValue(entity, null);
                    }
                }

            }
        }

        private static readonly Regex SupportedNumberFormatRegex = new Regex(@"^N(\d+)$");

        private string GetExcelNumberFormat(string csNumberFormat, int fallbackDecimalCount = 0)
        {
            var numberFormat = "#,##0";
            if (csNumberFormat != null)
            {
                var match = SupportedNumberFormatRegex.Match(csNumberFormat);
                if (match.Success)
                {
                    fallbackDecimalCount = int.Parse(match.Groups[1].ToString());
                }
            }
            if (fallbackDecimalCount > 0)
            {
                numberFormat += ".";
            }
            for (var i = 0; i < fallbackDecimalCount; i++)
            {
                numberFormat += "0";
            }

            return numberFormat;
        }

        private TimeZoneInfo GetUserTimeZoneInfo()
        {

            // TODO: Get user time zone either from f.ex.
            // a) User profile settings 
            // b) Client Device (add request cookie/request custom header with the device timezone or timezoneoffset).
            return TimeZoneInfo.FindSystemTimeZoneById("Romance Standard Time");
        }

    }
}
