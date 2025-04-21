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
  1: {
    title: "Get Balances",
    content: `Enter schemeID and customerID.Get the current balance for the account associated with customer_id within scheme_ids.`,
    requiredInput: ["SchemeId", "customerId"],
    disabledInput: "",
  },
  2: {
    title: "Get Statement",
    content:
      "Enter schemeID and customerID.Generate a statement for customer_id within scheme_id.",
    requiredInput: ["SchemeId", "customerId"],
    disabledInput: "",
  },
  3: {
    title: "Get Statement preference",
    content:
      "Enter Customer ID and SchemeID.Gets the customer statement preference in given scheme. Scheme can be only be Clubcard for respective country ( UKClubcard / IEClubcard)",
    requiredInput: ["SchemeId", "customerId"],
    disabledInput: "",
  },

  4: {
    title: "Get Schemes",
    content: "Enter Customer ID.Returns the active schemes for customer_id",
    requiredInput: ["customerId"],
    disabledInput: "SchemeId",
  },
  5: {
    title: "Get Group",
    content:
      "Enter Customer ID.Get the details of any group that customer_id within scheme_id is currently associated with. A customer can only be associated with a single group at a time, per scheme.",
    requiredInput: ["SchemeId", "customerId"],
    disabledInput: "",
  },
  6: {
    title: "Get Group Profile",
    content: "Enter Group ID.Returns the Group profile Details for Group_ID",
    requiredInput: ["customerId"],
    disabledInput: "SchemeId",
  },
  7: {
    title: "Get Account Profile",
    content:
      "Enter Customer ID.Returns the Account Profile Details for customer_id",
    requiredInput: ["SchemeId", "customerId"],
    disabledInput: "",
  },
  8: {
    title: "Get Account TXN_Doc",
    content: "Enter Customer ID.Returns the Account TXN_Doc for customer_id",
    requiredInput: ["SchemeId", "customerId"],
    disabledInput: "",
  },
});
export default initialData;
