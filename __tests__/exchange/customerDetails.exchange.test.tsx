import handleCustomerdetails from "~/exchange/customerDetails";

global.open = vi.fn();

describe("handleGetCouponDetails function", () => {
  it("should open the correct URL in a new window with extracted coupon ID", () => {
    const selectedText = '{"tesco:uuid:123"}';

    handleCustomerdetails(selectedText);

    expect(global.open).toHaveBeenCalledWith(
      `${window.location.origin}/dashboard/exchange?CustomerID=%7B%22tesco%3Auuid%3A123%22%7D`,
      "_blank"
    );
  });
});
