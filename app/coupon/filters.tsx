interface FilteredResponse {
    [key: string]: any; // Index signature to allow any string key
  }
 export let filteredJsonString:string;
 const filteringLogic = (toggle:string, filteredResponse :any,selectedFilters:string[],filters:string[]) =>{
    switch (toggle) {
        case '1': {
          const filteredResult: FilteredResponse = {}; //this is for object {}.
          for (const key of Object.keys(filteredResponse) as Array<keyof typeof filteredResponse>) {
            if (typeof key === 'string') {
              const value = filteredResponse[key];
              if (selectedFilters.includes(key)) {
                if (Array.isArray(value)) {
                  filteredResult[key] = value.filter(item => selectedFilters.includes(item));
                } else {
                  filteredResult[key] = value;
                }
              }
            }
             filteredJsonString = JSON.stringify(filteredResult, null, 2);
          }
    
          break;
        }
        case '2': {
          const filteredResult: FilteredResponse = {};
    
          for (const key of Object.keys(filteredResponse)) {
            const originalArray = filteredResponse[key];
            if (Array.isArray(originalArray) && originalArray.length > 0) {
              const filteredArray = originalArray.map(obj => {
                const filteredObj: FilteredResponse = {};
                for (const objKey of Object.keys(obj)) {
                  if (selectedFilters.includes(objKey)) {
                    filteredObj[objKey] = obj[objKey];
                  }
                }
                return filteredObj;
              });
              filteredResult[key] = filteredArray;
            } else {
              filteredResult[key] = [];
            }
          }
           filteredJsonString = JSON.stringify(filteredResult, null, 2);
          break;
        }
        case '3': {
          const filteredResult: FilteredResponse = filteredResponse.map((obj: any) => {
            const filteredObj: FilteredResponse = {};
            filters.forEach(prop => {
              if (selectedFilters.includes(prop)) {
                filteredObj[prop] = obj[prop];
              }
            });
    
            return filteredObj;
          });
          filteredJsonString = JSON.stringify(filteredResult, null, 2);
    
         
          break;
    
        }
        case '5': {
          const filteredResult: FilteredResponse = {}; 
          for (const key of Object.keys(filteredResponse)) {
            const value = filteredResponse[key];
    
            if (selectedFilters.includes(key)) {
    
    
              if (Array.isArray(value)) {
    
                filteredResult[key] = value.filter(item => selectedFilters.includes(item));
              } else {
                filteredResult[key] = value;
              }
            }
          }
           filteredJsonString = JSON.stringify(filteredResult, null, 2);
          break;
        }
        default:
          break;
      }
    return filteredJsonString
 }
export default filteringLogic;