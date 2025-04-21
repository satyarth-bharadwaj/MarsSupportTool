interface FilteredResponse {
  [key: string]: any; // Index signature to allow any string key
}
export let filteredJsonString: string;
const filteringLogic = (
  toggle: string,
  selectedFilters: string[],
  filteredResponse: any
) => {
  const filteredJsonString: string = ""; // Define type for filteredJsonString
  switch (toggle) {
    case "3": {
      const filteredResult: FilteredResponse[] = []; // Array to hold filtered objects

      filteredResponse.forEach((obj: FilteredResponse) => {
        const filteredObj: FilteredResponse = {};
        Object.keys(obj).forEach((key) => {
          if (selectedFilters.includes(key)) {
            filteredObj[key] = obj[key];
          }
        });
        filteredResult.push(filteredObj);
      });

      const filteredJsonString = JSON.stringify(filteredResult, null, 2);
      return filteredJsonString;
    }

    // case "4": {
    //   const filteredResult: FilteredResponse = {};

    //   Object.keys(filteredResponse).forEach((outerKey) => {
    //     const innerObject = filteredResponse[outerKey];
    //     const filteredInnerObject: FilteredResponse = {};

    //     Object.keys(innerObject).forEach((innerKey) => {
    //       if (selectedFilters.includes(innerKey)) {
    //         filteredInnerObject[innerKey] = innerObject[innerKey];
    //       }
    //     });

    //     filteredResult[outerKey] = filteredInnerObject;
    //   });

    //   const filteredJsonString = JSON.stringify(filteredResult, null, 2);
    //   return filteredJsonString;
    // }

    // case "6": {
    //   const filteredResult6: FilteredResponse = {}; // Object to hold filtered properties
    //   for (const key of Object.keys(filteredResponse)) {
    //     const value = filteredResponse[key];
    //     if (selectedFilters.includes(key)) {
    //       if (Array.isArray(value)) {
    //         filteredResult6[key] = value.filter((item) =>
    //           selectedFilters.includes(item)
    //         );
    //       } else {
    //         filteredResult6[key] = value;
    //       }
    //     }
    //   }
    //   const filteredJsonString6 = JSON.stringify(filteredResult6, null, 2);
    //   return filteredJsonString6;
    // }

    default:
      break;
  }
  return filteredJsonString;
};

export default filteringLogic;
