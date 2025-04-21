export const isPromotion = (input: string): boolean => {
  const regex =
    /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
  return regex.test(input);
};
export const isCoupon = (input: string): boolean => {
  const regex =
    /^(?:(?:\d{22})|(?:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})|(?:[A-Z0-9]{12}))$/;
  return regex.test(input);
};
export const isCustomerUuid = (input: string): boolean => {
  const regex =
    /^trn:tesco:uid:uuid:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  return regex.test(input);
};
