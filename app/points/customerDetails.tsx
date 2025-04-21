const handleCustomerdetails = (selectedText: string) => {
  const urlParams = new URLSearchParams({
    CustomerID: selectedText,
    //SchemeId: SchemeId,
  });
  const url = `${window.location.origin}/dashboard/points?${urlParams}`;

  window.open(url, "_blank");
};
export default handleCustomerdetails;
