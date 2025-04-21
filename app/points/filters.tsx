export let filteredJsonString: string;
const filteringLogic = (
  toggle: string,
  selectedStartDate: string,
  selectedEndDate: string,
  selectedFilters: string[],
  filteredResponse: any
) => {
  let filteredResult: any = {}; // Define type for filteredResult
  let filteredJsonString: string = ""; // Define type for filteredJsonString
  switch (toggle) {
    case "2":
      filteredResult = {};
      if (selectedStartDate && selectedEndDate && selectedFilters.length > 0) {
        const startDate = new Date(selectedStartDate);
        const endDate = new Date(selectedEndDate);
        filteredResult.lineItems = filteredResponse.lineItems.map(
          (item: any) => {
            const filteredLineItem: any = {};
            const itemDateTime = new Date(item.dateTime);
            for (const key of selectedFilters) {
              if (
                item.hasOwnProperty(key) &&
                itemDateTime >= startDate &&
                itemDateTime <= endDate
              ) {
                filteredLineItem[key] = item[key];
              }
            }
            return filteredLineItem;
          }
        );
      } else if (selectedFilters.length > 0) {
        filteredResult.lineItems = filteredResponse.lineItems.map(
          (item: any) => {
            const filteredLineItem: any = {};
            for (const key of selectedFilters) {
              if (item.hasOwnProperty(key)) {
                filteredLineItem[key] = item[key];
              }
            }
            return filteredLineItem;
          }
        );
      } else {
        const startDate = new Date(selectedStartDate);
        const endDate = new Date(selectedEndDate);
        filteredResult.lineItems = filteredResponse.lineItems.filter(
          (item: any) => {
            const itemDateTime = new Date(item.dateTime);
            return itemDateTime >= startDate && itemDateTime <= endDate;
          }
        );
      }
      filteredJsonString = JSON.stringify(filteredResult, null, 2);

      break;

    case "7":
      filteredResult = {}; // Object to hold filtered properties
      for (const key of Object.keys(filteredResponse)) {
        const value: string = filteredResponse[key];
        if (selectedFilters.includes(key)) {
          if (Array.isArray(value)) {
            filteredResult[key] = value.filter((item: any) =>
              selectedFilters.includes(item)
            );
          } else {
            filteredResult[key] = value;
          }
        }
      }
      filteredJsonString = JSON.stringify(filteredResult, null, 2);

      break;

    case "8":
      filteredResult = [];
      for (const key of Object.keys(filteredResponse)) {
        const value = filteredResponse[key];
        if (Array.isArray(value)) {
          const filteredArray = value.filter((item: any) => {
            const itemDate = new Date(item.dateTime);
            const startDate = new Date(selectedStartDate);
            const endDate = new Date(selectedEndDate);
            return itemDate >= startDate && itemDate <= endDate;
          });
          if (filteredArray.length > 0) {
            filteredResult = [...filteredResult, { [key]: filteredArray }];
          }
        }
      }
      filteredJsonString = JSON.stringify(filteredResult, null, 2);

      break;

    default:
      break;
  }
  return filteredJsonString;
};
export default filteringLogic;
