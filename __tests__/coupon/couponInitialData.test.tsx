import initialData from "~/coupon/couponsInitialData";
type DataKey = "1" | "2" | "3" | "4" | "5";
describe("initialData object", () => {
  it("should contain keys 1, 2, 3, 4, and 5", () => {
    expect(Object.keys(initialData)).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("each key should have the correct structure", () => {
    Object.keys(initialData).forEach((key) => {
      const data = initialData[key as DataKey];
      expect(data).toHaveProperty("title");
      expect(data).toHaveProperty("content");
      expect(data).toHaveProperty("requiredInput");
      expect(data).toHaveProperty("disabledInput");
      expect(typeof data.title).toBe("string");
      expect(typeof data.content).toBe("string");
      expect(typeof data.requiredInput).toBe("string");
      expect(typeof data.disabledInput).toBe("string");
    });
  });

  it("each key should have the correct values", () => {
    expect(initialData["1"]).toEqual({
      title: "Promotion",
      content: "Enter Promotion ID. Returns promotion details of the Coupon.",
      requiredInput: "couponId",
      disabledInput: "customerId",
    });

    expect(initialData["2"]).toEqual({
      title: "Coupon By Ids",
      content:
        "Enter supports List of scannableCode, keyInCode, couponId. Returns coupons information for the given any coupon id. Currently accepts 30 coupon id as input argument.",
      requiredInput: "couponId",
      disabledInput: "customerId",
    });

    expect(initialData["3"]).toEqual({
      title: "Customer Coupons",
      content:
        "Enter Customer ID. Returns all coupons and voucher for given UUID depending on the confidence level of the access token used. A confidence level 12 access token will return coupons only and no vouchers details. A confidence level 16 access token will return all coupons and vouchers.",
      requiredInput: "customerId",
      disabledInput: "couponId",
    });

    expect(initialData["4"]).toEqual({
      title: "Expiry Date",
      content:
        "Enter Customer ID. Returns coupon or voucher max expiry date for given customer UUID.",
      requiredInput: "customerId",
      disabledInput: "couponId",
    });

    expect(initialData["5"]).toEqual({
      title: "Vouchers Value",
      content:
        "Enter Customer ID. Returns the spent, unspent and total voucher balance a customer has with a minimum of confidence level 12 access token.",
      requiredInput: "customerId",
      disabledInput: "couponId",
    });
  });
  it("should have non-empty requiredInput arrays for each key", () => {
    Object.keys(initialData).forEach((key) => {
      const data = initialData[key as DataKey];

      expect(data.requiredInput.length).toBeGreaterThan(0);
    });
  });
});
