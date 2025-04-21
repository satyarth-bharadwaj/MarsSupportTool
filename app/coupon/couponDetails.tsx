import extractNeededText from "./extractInput";

const handleGetCouponDetails = (selectedText: string) => {
  const extractedCouponID = extractNeededText(
    [
      /"promotionId": "([^"]+)"/,
      /"couponId": "([^"]+)"/,
      /"scannableCode": "([^"]+)"/,
      /"keyInCode": "([^"]+)"/,
      /^(?:(?:\d{22})|(?:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})|(?:[A-Z0-9]{12}))$/,
      /^[A-Z]{3}\d{2}[A-Z]{2}\d[A-Z]{3}\d[A-Z]$/,
    ],
    selectedText
  );

  const urlParams = new URLSearchParams({
    CouponID: extractedCouponID,
  });
  const url = `${window.location.origin}/dashboard/coupons?${urlParams}`;

  window.open(url, "_blank");
};
export default handleGetCouponDetails;
