import { parseCouponFormData } from "~/routes/resources/readFormData";

// Helper function to create a mock request with form data
const createMockRequest = (
  formDataEntries: Array<[string, string]>
): Partial<Request> => {
  return {
    formData: async () => {
      const formData = new Map(formDataEntries);
      return {
        get: (key: string) => formData.get(key) || null,
      };
    },
  } as Partial<Request>;
};

describe("parseCouponFormData", () => {
  test("should return valid coupon input for Promotion API", async () => {
    const request = createMockRequest([
      ["api", "Promotion"],
      ["couponID", "1234567890123456789012"],
      ["credentials", "some-credentials"],
    ]);
    const result = await parseCouponFormData(request as Request);
    expect(result).toEqual({
      input: "1234567890123456789012",
      credentials: "some-credentials",
      api: "Promotion",
      isValidCouponInput: true,
      isValidCustomerInput: false,
    });
  });

  test("should return valid coupon input for Coupon By Ids API", async () => {
    const request = createMockRequest([
      ["api", "Coupon By Ids"],
      ["couponID", "123456789012"],
      ["credentials", "some-credentials"],
    ]);
    const result = await parseCouponFormData(request as Request);
    expect(result).toEqual({
      input: "123456789012",
      credentials: "some-credentials",
      api: "Coupon By Ids",
      isValidCouponInput: true,
      isValidCustomerInput: false,
    });
  });

  test("should return valid customer input for Customer API", async () => {
    const request = createMockRequest([
      ["api", "Customer"],
      ["customerID", "trn:tesco:uid:uuid:123e4567-e89b-12d3-a456-426614174000"],
      ["credentials", "some-credentials"],
    ]);
    const result = await parseCouponFormData(request as Request);
    expect(result).toEqual({
      input: "trn:tesco:uid:uuid:123e4567-e89b-12d3-a456-426614174000",
      credentials: "some-credentials",
      api: "Customer",
      isValidCouponInput: false,
      isValidCustomerInput: true,
    });
  });

  test("should return invalid coupon input for Promotion API", async () => {
    const request = createMockRequest([
      ["api", "Promotion"],
      ["couponID", "invalid_coupon_id"],
      ["credentials", "some-credentials"],
    ]);
    const result = await parseCouponFormData(request as Request);
    expect(result).toEqual({
      input: "invalid_coupon_id",
      credentials: "some-credentials",
      api: "Promotion",
      isValidCouponInput: false,
      isValidCustomerInput: false,
    });
  });

  test("should return invalid customer input for Customer API", async () => {
    const request = createMockRequest([
      ["api", "Customer"],
      ["customerID", "invalid_customer_id"],
      ["credentials", "some-credentials"],
    ]);
    const result = await parseCouponFormData(request as Request);
    expect(result).toEqual({
      input: "invalid_customer_id",
      credentials: "some-credentials",
      api: "Customer",
      isValidCouponInput: false,
      isValidCustomerInput: false,
    });
  });

  test("should handle missing credentials", async () => {
    const request = createMockRequest([
      ["api", "Promotion"],
      ["couponID", "1234567890123456789012"],
    ]);
    const result = await parseCouponFormData(request as Request);
    expect(result).toEqual({
      input: "1234567890123456789012",
      credentials: null,
      api: "Promotion",
      isValidCouponInput: true,
      isValidCustomerInput: false,
    });
  });

  test("should handle missing API key", async () => {
    const request = createMockRequest([
      ["couponID", "1234567890123456789012"],
      ["credentials", "some-credentials"],
    ]);
    const result = await parseCouponFormData(request as Request);
    expect(result).toEqual({
      input: null,
      credentials: "some-credentials",
      api: null,
      isValidCouponInput: false,
      isValidCustomerInput: false,
    });
  });

  test("should handle missing couponID and customerID", async () => {
    const request = createMockRequest([
      ["api", "Promotion"],
      ["credentials", "some-credentials"],
    ]);
    const result = await parseCouponFormData(request as Request);
    expect(result).toEqual({
      input: null,
      credentials: "some-credentials",
      api: "Promotion",
      isValidCouponInput: false,
      isValidCustomerInput: false,
    });
  });
});
