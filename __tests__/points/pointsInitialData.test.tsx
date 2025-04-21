import initialData from "~/points/pointsInitialData";
type DataKey = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
describe("initialData", () => {
  it("should have correct keys", () => {
    const keys = Object.keys(initialData);
    expect(keys).toEqual(["1", "2", "3", "4", "5", "6", "7", "8"]);
  });
  it("should contain required properties for each key", () => {
    // Loop through each key in initialData
    Object.keys(initialData).forEach((key) => {
      const data = initialData[key as DataKey];

      // Check if data has required properties
      expect(data).toHaveProperty("title");
      expect(data).toHaveProperty("content");
      expect(data).toHaveProperty("requiredInput");
      expect(data).toHaveProperty("disabledInput");

      // Check the types of properties
      expect(typeof data.title).toBe("string");
      expect(typeof data.content).toBe("string");
      expect(Array.isArray(data.requiredInput)).toBe(true);
      expect(typeof data.disabledInput).toBe("string");
    });
  });

  it("should have non-empty requiredInput arrays for each key", () => {
    Object.keys(initialData).forEach((key) => {
      const data = initialData[key as DataKey];

      expect(data.requiredInput.length).toBeGreaterThan(0);
    });
  });
  it("each key should have the correct values", () => {
    expect(initialData["1"]).toEqual({
      title: "Get Balances",
      content:
        "Enter schemeID and customerID.Get the current balance for the account associated with customer_id within scheme_ids.",
      requiredInput: ["SchemeId", "customerId"],
      disabledInput: "",
    });

    expect(initialData["2"]).toEqual({
      title: "Get Statement",
      content:
        "Enter schemeID and customerID.Generate a statement for customer_id within scheme_id.",
      requiredInput: ["SchemeId", "customerId"],
      disabledInput: "",
    });

    expect(initialData["3"]).toEqual({
      title: "Get Statement preference",
      content:
        "Enter Customer ID and SchemeID.Gets the customer statement preference in given scheme. Scheme can be only be Clubcard for respective country ( UKClubcard / IEClubcard)",
      requiredInput: ["SchemeId", "customerId"],
      disabledInput: "",
    });

    expect(initialData["4"]).toEqual({
      title: "Get Schemes",
      content: "Enter Customer ID.Returns the active schemes for customer_id",
      requiredInput: ["customerId"],
      disabledInput: "SchemeId",
    });

    expect(initialData["5"]).toEqual({
      title: "Get Group",
      content:
        "Enter Customer ID.Get the details of any group that customer_id within scheme_id is currently associated with. A customer can only be associated with a single group at a time, per scheme.",
      requiredInput: ["SchemeId", "customerId"],
      disabledInput: "",
    });

    expect(initialData["6"]).toEqual({
      title: "Get Group Profile",
      content: "Enter Group ID.Returns the Group profile Details for Group_ID",
      requiredInput: ["customerId"],
      disabledInput: "SchemeId",
    });

    expect(initialData["7"]).toEqual({
      title: "Get Account Profile",
      content:
        "Enter Customer ID.Returns the Account Profile Details for customer_id",
      requiredInput: ["SchemeId", "customerId"],
      disabledInput: "",
    });

    expect(initialData["8"]).toEqual({
      title: "Get Account TXN_Doc",
      content: "Enter Customer ID.Returns the Account TXN_Doc for customer_id",
      requiredInput: ["SchemeId", "customerId"],
      disabledInput: "",
    });
  });
});
