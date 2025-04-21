import { GetCollection, GetEstimation, GetFreezeperiod } from "utils/zod-utils";

export default async function callExchangeAPI(
  customerId: string | null,
  schemeId: string | null,
  api: string,
  token: string,
  dbValue: string | null
): Promise<any[]> {
  let headers: Headers;

  let baseurl: string;
  let apiUrl: string;
  if (dbValue === "PROD") {
    baseurl = `https://api.tesco.com/storedvalue/exchange/`;
  } else {
    baseurl = `https://api-ppe.tesco.com/storedvalue/exchange/`;
  }
  const accessToken = `Bearer ${token}`;
  headers = new Headers();
  headers.append("Authorization", accessToken);
  let resfromendpoint: Response | undefined;

  switch (api) {
    case "Get eligibility":
      apiUrl = `${baseurl}eligibility?customerId=${customerId}&scheme=${schemeId}&from=POINTS&to=VOUCHERS`;
      try {
        resfromendpoint = await fetch(apiUrl, {
          method: "GET",
          headers,
        });
        {
        }

        return [
          "The Customer with uuid " +
            customerId +
            " is eligible for the schemeID " +
            schemeId,
          resfromendpoint.status.toString(),
        ];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2"];
      }
    case "Get Freeze Period":
      apiUrl = `${baseurl}scheme/${schemeId}/freeze-period`;

      try {
        resfromendpoint = await fetch(apiUrl, {
          method: "GET",
          headers,
        });
        const requiredData = await resfromendpoint.json();
        if (
          resfromendpoint !== undefined &&
          resfromendpoint.status.toString() === "200"
        )
          GetFreezeperiod.parse(requiredData);
        return [requiredData, resfromendpoint.status.toString()];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2"];
      }

    case "Get Collection period":
      apiUrl = `${baseurl}scheme/${schemeId}/collectionperiods`;
      try {
        resfromendpoint = await fetch(apiUrl, {
          method: "GET",
          headers,
        });
        const requiredData = await resfromendpoint.json();
        if (
          resfromendpoint !== undefined &&
          resfromendpoint.status.toString() === "200"
        )
          GetCollection.parse(requiredData);
        return [requiredData, resfromendpoint.status.toString()];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2"];
      }

    case "Get Estimation":
      apiUrl = `${baseurl}customer/${customerId}/scheme/${schemeId}/estimate`;
      try {
        resfromendpoint = await fetch(apiUrl, {
          method: "GET",
          headers,
        });
        const requiredData = await resfromendpoint.json();

        // if (
        //   resfromendpoint !== undefined &&
        //   resfromendpoint.status.toString() === "200"
        // )
        //   GetEstimation.parse(requiredData);
        return [requiredData, resfromendpoint.status.toString()];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2"];
      }

    case "Get Status":
      apiUrl = `${baseurl}${customerId}/status`;
      try {
        resfromendpoint = await fetch(apiUrl, {
          method: "GET",
          headers,
        });
        const requiredData = await resfromendpoint.json();
        return [requiredData, resfromendpoint.status.toString()];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2"];
      }

    case "Get Campaign":
      apiUrl = `${baseurl}campaign/${schemeId}`;
      try {
        resfromendpoint = await fetch(apiUrl, {
          method: "GET",
          headers,
        });
        const requiredData = await resfromendpoint.json();
        return [requiredData, resfromendpoint.status.toString()];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2"];
      }

    default:
      return [];
  }
}
