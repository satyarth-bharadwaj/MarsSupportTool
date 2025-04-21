import handleGetDetails from "~/coupon/customerDetails";

global.open = vi.fn();

describe("handleGetCouponDetails function", () => {
  it("should open the correct URL in a new window with extracted customer ID", () => {
    const selectedText = '{"issuedToCustomerId": "tesco:uuid:123"}';

    handleGetDetails(selectedText);

    expect(global.open).toHaveBeenCalledWith(
      `${window.location.origin}/dashboard/coupons?CustomerID=%7B%22issuedToCustomerId%22%3A+%22tesco%3Auuid%3A123%22%7D`,
      "_blank"
    );
  });
  it("should open the correct URL in a new window with extracted customer ID", () => {
    const selectedText = '{"tesco:uuid:123"}';

    handleGetDetails(selectedText);

    expect(global.open).toHaveBeenCalledWith(
      `${window.location.origin}/dashboard/coupons?CustomerID=%7B%22issuedToCustomerId%22%3A+%22tesco%3Auuid%3A123%22%7D`,
      "_blank"
    );
  });
});
