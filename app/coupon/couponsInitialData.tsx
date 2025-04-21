interface Data {
  title: string;
  content: string;
  requiredInput: string;
  disabledInput: string;
}

interface YourType {
  [key: string]: Data;
}

const createDataMap = <const T extends YourType>(data: T) => data;

const initialData = createDataMap({
  "1": {
    title: "Promotion",
    content: "Enter Promotion ID. Returns promotion details of the Coupon.",
    requiredInput: "couponId",
    disabledInput: "customerId",
  },
  "2": {
    title: "Coupon By Ids",
    content:
      "Enter supports List of scannableCode, keyInCode, couponId. Returns coupons information for the given any coupon id. Currently accepts 30 coupon id as input argument.",
    requiredInput: "couponId",
    disabledInput: "customerId",
  },
  "3": {
    title: "Customer Coupons",
    content:
      "Enter Customer ID. Returns all coupons and voucher for given UUID depending on the confidence level of the access token used. A confidence level 12 access token will return coupons only and no vouchers details. A confidence level 16 access token will return all coupons and vouchers.",
    requiredInput: "customerId",
    disabledInput: "couponId",
  },
  "4": {
    title: "Expiry Date",
    content:
      "Enter Customer ID. Returns coupon or voucher max expiry date for given customer UUID.",
    requiredInput: "customerId",
    disabledInput: "couponId",
  },
  "5": {
    title: "Vouchers Value",
    content:
      "Enter Customer ID. Returns the spent, unspent and total voucher balance a customer has with a minimum of confidence level 12 access token.",
    requiredInput: "customerId",
    disabledInput: "couponId",
  },
});

export default initialData;
