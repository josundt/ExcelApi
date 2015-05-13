using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace ExcelApiTest.Formatters
{
    public static class TypeExtensions
    {
        private static readonly List<Type> SupportedPropertyTypes = new List<Type>
        {
            typeof(string), 
            typeof(decimal), 
            typeof(int), 
            typeof(double), 
            typeof(bool), 
            typeof(DateTime), 
            typeof(DateTimeOffset)
        };

        public static bool IsSupportedPropertyType(this Type type)
        {
            return type.IsEnum || SupportedPropertyTypes.Any(sp => sp == type);
        }

        public static Type GetFirstGenericTypeParameter(this Type type, Type interf)
        {
            Type result = null;

            foreach (Type i in type.GetInterfaces())
            {
                if (i.IsGenericType && i.GetGenericTypeDefinition() == interf)
                {
                    var genericArguments = i.GetGenericArguments();
                    if (genericArguments.Length >= 1)
                    {
                        result = genericArguments[0];
                    }
                }
            }

            return result;
        }

        public static bool ImplementsGenericInterface(this Type type, Type interf, Type typeparameter = null)
        {
            bool result = false;

            foreach (Type i in type.GetInterfaces())
            {
                if (i.IsGenericType && i.GetGenericTypeDefinition() == interf)
                {
                    if (typeparameter == null)
                    {
                        result = true;
                    }
                    else if (i.GetGenericArguments()[0] == typeparameter)
                    {
                        result = true;
                    }
                }

            }

            return result;
        }
    }

    public static class PropertyInfoExtensions
    {
        public static T GetFirstCustomAttribute<T>(this PropertyInfo propInfo) where T : Attribute
        {
            var attributes = propInfo.GetCustomAttributes(typeof(T));
            return attributes.FirstOrDefault() as T;
        }
    }

}

