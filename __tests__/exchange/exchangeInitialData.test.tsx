import initialData from "~/exchange/exchangeInitialdata";
type DataKey = "1" | "2" | "3" | "4" | "5" | "6";
describe("dummyData", () => {
  it("should have correct keys", () => {
    const keys = Object.keys(initialData);
    expect(keys).toEqual(["1", "2", "3", "4", "5", "6"]);
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
  it("should have correct values for each key", () => {
    expect(initialData["1"]).toEqual({
      title: "Get eligibility",
      content:
        "Enter schemeID and customerID.Check if customer is eligible for requesting FDV",
      requiredInput: ["SchemeId", "customerId"],
      disabledInput: "",
    });

    expect(initialData["2"]).toEqual({
      title: "Get Freeze Period",
      content:
        "Enter schemeID and customerID.Endpoint to check for freeze dates",
      requiredInput: ["SchemeId"],
      disabledInput: "customerId",
    });

    expect(initialData["3"]).toEqual({
      title: "Get Collection period",
      content:
        "Enter SchemeID.Gets the customer statement preference in given scheme. Scheme can be only be Clubcard for respective country ( UKClubcard / IEClubcard)",
      requiredInput: ["SchemeId"],
      disabledInput: "customerId",
    });

    expect(initialData["4"]).toEqual({
      title: "Get Estimation",
      content:
        "Enter schemeID and customerID.Get the details of any group that customer_id within scheme_id is currently associated with. A customer can only be associated with a single group at a time, per scheme.",
      requiredInput: ["SchemeId", "customerId"],
      disabledInput: "",
    });

    expect(initialData["5"]).toEqual({
      title: "Get Status",
      content: "Enter Customer ID.Returns the active schemes for customer_id",
      requiredInput: ["customerId"],
      disabledInput: "SchemeId",
    });

    expect(initialData["6"]).toEqual({
      title: "Get Campaign",
      content: "Enter schemeID.Get Active Campaign by scheme",
      requiredInput: ["SchemeId"],
      disabledInput: "customerId",
    });
  });
});
