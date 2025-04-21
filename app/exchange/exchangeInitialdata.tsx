interface Data {
  title: string;
  content: string;
  requiredInput: string[];
  disabledInput: string;
}
interface YourType {
  [key: string]: Data;
}
const createDataMap = <const T extends YourType>(data: T) => data;
const initialData = createDataMap({
  "1": {
    title: "Get eligibility",
    content:
      "Enter schemeID and customerID.Check if customer is eligible for requesting FDV",
    requiredInput: ["SchemeId", "customerId"],
    disabledInput: "",
  },
  "2": {
    title: "Get Freeze Period",
    content: "Enter schemeID and customerID.Endpoint to check for freeze dates",
    requiredInput: ["SchemeId"],
    disabledInput: "customerId",
  },
  "3": {
    title: "Get Collection period",
    content:
      "Enter SchemeID.Gets the customer statement preference in given scheme. Scheme can be only be Clubcard for respective country ( UKClubcard / IEClubcard)",
    requiredInput: ["SchemeId"],
    disabledInput: "customerId",
  },
  "4": {
    title: "Get Estimation",
    content:
      "Enter schemeID and customerID.Get the details of any group that customer_id within scheme_id is currently associated with. A customer can only be associated with a single group at a time, per scheme.",
    requiredInput: ["SchemeId", "customerId"],
    disabledInput: "",
  },
  "5": {
    title: "Get Status",
    content: "Enter Customer ID.Returns the active schemes for customer_id",
    requiredInput: ["customerId"],
    disabledInput: "SchemeId",
  },
  "6": {
    title: "Get Campaign",
    content: "Enter schemeID.Get Active Campaign by scheme",
    requiredInput: ["SchemeId"],
    disabledInput: "customerId",
  },
});
export default initialData;
