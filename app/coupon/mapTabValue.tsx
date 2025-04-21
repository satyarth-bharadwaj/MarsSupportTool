export default function mapTabvalue(api: string) {
  switch (api) {
    case "Promotion":
      return "1";

    case "Coupon By Ids":
      return "2";

    case "Customer Coupons":
      return "3";
    case "Expiry Date":
      return "4";
    case "Vouchers Value":
      return "5";

    default:
      throw new Error(`Unsupported API value: ${api}`);
  }
}
