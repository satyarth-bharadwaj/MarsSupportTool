import {
  GetCouponDetails,
  GetCustomerDetails,
  GetExpiryData,
  GetPromotion,
} from "utils/zod-utils";

export default async function callCouponAPI(
  input: string | null,
  api: string,
  token: string,
  dbValue: string | null
): Promise<any[]> {
  const baseurl =
    dbValue === "PROD"
      ? "https://api.tesco.com/storedvalue/coupons/"
      : "https://api-ppe.tesco.com/storedvalue/coupons/";

  const accessToken = `Bearer ${token}`;
  const headers = new Headers();
  headers.append("Authorization", accessToken);
  let resfromendpoint: Response | undefined;
  let requiredData: any;
  let identityTokenUrl: any;
  switch (api) {
    case "Promotion":
      identityTokenUrl = `${baseurl}v1/promotion/${input}`;
      try {
        resfromendpoint = await fetch(identityTokenUrl, {
          method: "GET",
          headers,
        });
        requiredData = await resfromendpoint.json();
        if (resfromendpoint.status.toString() === "200")
          GetPromotion.parse(requiredData);
        return [requiredData, resfromendpoint.status.toString(), api];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2"];
      }
      break;

    case "Coupon By Ids":
      identityTokenUrl = `${baseurl}v2/couponList/${input}?include=redemptionDetails&period=all`;
      try {
        resfromendpoint = await fetch(identityTokenUrl, {
          method: "GET",
          headers,
        });

        requiredData = await resfromendpoint.json();

        if (resfromendpoint.status.toString() === "200")
          GetCouponDetails.parse(requiredData);
        return [requiredData, resfromendpoint.status.toString(), api];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2"];
      }

      break;
    case "Customer Coupons":
      identityTokenUrl = `${baseurl}v3/customer/${input}?include=redemptionDetails`;
      try {
        resfromendpoint = await fetch(identityTokenUrl, {
          method: "GET",
          headers,
        });

        requiredData = await resfromendpoint.json();
        if (resfromendpoint.status.toString() === "200")
          GetCustomerDetails.parse(requiredData);
        return [requiredData, resfromendpoint.status.toString(), api];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2"];
      }
      break;
    case "Expiry Date":
      identityTokenUrl = `${baseurl}/customer/${input}/expirydate`;
      try {
        resfromendpoint = await fetch(identityTokenUrl, {
          method: "GET",
          headers,
        });

        requiredData = await resfromendpoint.json();
        if (
          resfromendpoint !== undefined &&
          resfromendpoint.status.toString() === "200"
        )
          GetExpiryData.parse(requiredData);
        return [requiredData, resfromendpoint.status.toString(), api];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2"];
      }
      break;
    case "Vouchers Value":
      identityTokenUrl = `${baseurl}v1/customer/${input}/value`;
      try {
        resfromendpoint = await fetch(identityTokenUrl, {
          method: "GET",
          headers,
        });
        requiredData = await resfromendpoint.json();
        return [requiredData, resfromendpoint.status.toString(), api];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2"];
      }
      break;

    default:
      break;
  }

  return [];
}
