const handleCustomerdetails = (selectedText: string) => {
  const urlParams = new URLSearchParams({
    CustomerID: selectedText,
  });
  const url = `${window.location.origin}/dashboard/exchange?${urlParams}`;

  window.open(url, "_blank");
};
export default handleCustomerdetails;
