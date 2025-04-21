import handleGetCouponDetails from "~/coupon/couponDetails";
global.open = vi.fn();

describe("handleGetCouponDetails function", () => {
  it("should open the correct URL in a new window with extracted coupon ID", () => {
    const selectedText = '{"couponId": "coupon123"}';

    handleGetCouponDetails(selectedText);

    expect(global.open).toHaveBeenCalledWith(
      `${window.location.origin}/dashboard/coupons?CouponID=coupon123`,
      "_blank"
    );
  });
  it("should open the correct URL in a new window with extracted coupon ID", () => {
    const selectedText = '{"coupon123"}';

    handleGetCouponDetails(selectedText);

    expect(global.open).toHaveBeenCalledWith(
      `${window.location.origin}/dashboard/coupons?CouponID=coupon123`,
      "_blank"
    );
  });
});
