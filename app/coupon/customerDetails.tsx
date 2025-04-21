import extractNeededText from "./extractInput";

export const handleGetDetails = (selectedText: string) => {
  console.log("handleGetCouponDetails called with selectedText:", selectedText);
  // Assuming credentials hold the customer ID
  const extractedCustomerId = extractNeededText(
    [
      /"issuedToCustomerId": "([^"]+)"/,
      /^trn:tesco:uid:uuid:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
    ],

    selectedText
  );
  if (extractedCustomerId === null) {
    console.log("i am here");
    return;
  }

  const urlParams = new URLSearchParams({
    CustomerID: selectedText,
  });

  const url = `${window.location.origin}/dashboard/coupons?${urlParams}`;

  window.open(url, "_blank");
};

export default handleGetDetails;
