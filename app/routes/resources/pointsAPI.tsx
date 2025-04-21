import {
  GetBalance,
  GetGroupProfile,
  GetPreference,
  GetScheme,
  GetStatement,
  getGroup,
} from "utils/zod-utils";
export default async function callPointsAPI(
  customerId: string | null,
  schemeId: string | null,
  api: string,
  token: string,
  dbValue: string | null
): Promise<any[]> {
  let baseurl: string;
  let APIUrl: string;
  const groupObj = {
    groupID: "",
    primary: "",
    secondary: "",
  };
  if (dbValue === "PROD") {
    baseurl = `https://api.tesco.com/storedvalue/points/`;
  } else {
    baseurl = `https://api-ppe.tesco.com/storedvalue/points/`;
  }
  let resfromendpoint: Response | undefined;
  let requiredData: any;
  const accessToken = `Bearer ${token}`;
  const headers = new Headers();
  headers.append("Authorization", accessToken);

  APIUrl = `${baseurl}customer/${customerId}/scheme/${schemeId}/group`;
  try {
    resfromendpoint = await fetch(APIUrl, {
      method: "GET",
      headers,
    });
    const requiredData = await resfromendpoint.json();

    if (resfromendpoint.status.toString() === "200") {
      const member = requiredData.members;
      groupObj.primary = member[0];
      groupObj.secondary = member[1];
      groupObj.groupID = requiredData.groupId;
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
  switch (api) {
    case "Get Balances":
      APIUrl = `${baseurl}customer/${customerId}/scheme/${schemeId}`;
      try {
        resfromendpoint = await fetch(APIUrl, {
          method: "GET",
          headers,
        });
        requiredData = await resfromendpoint.json();
        if (resfromendpoint.status.toString() === "200") {
          GetBalance.parse(requiredData);
        }
        return [requiredData, resfromendpoint.status.toString(), groupObj];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2", groupObj];
      }
      break;

    case "Get Statement":
      APIUrl = `${baseurl}customer/${customerId}/scheme/${schemeId}/statement`;
      try {
        resfromendpoint = await fetch(APIUrl, {
          method: "GET",
          headers,
        });
        requiredData = await resfromendpoint.json();
        if (resfromendpoint.status.toString() === "200") {
          GetStatement.parse(requiredData);
        }
        return [requiredData, resfromendpoint.status.toString(), groupObj];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2", groupObj];
      }
      break;
    case "Get Statement preference":
      APIUrl = `${baseurl}customer/${customerId}/scheme/${schemeId}/statement/preference`;
      try {
        resfromendpoint = await fetch(APIUrl, {
          method: "GET",
          headers,
        });
        requiredData = await resfromendpoint.json();
        if (
          resfromendpoint !== undefined &&
          resfromendpoint.status.toString() === "200"
        ) {
          GetPreference.parse(requiredData);
        }
        return [requiredData, resfromendpoint.status.toString(), groupObj];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2", groupObj];
      }
      break;
    case "Get Group":
      APIUrl = `${baseurl}customer/${customerId}/scheme/${schemeId}/group`;
      try {
        resfromendpoint = await fetch(APIUrl, {
          method: "GET",
          headers,
        });
        requiredData = await resfromendpoint.json();
        if (
          resfromendpoint !== undefined &&
          resfromendpoint.status.toString() === "200"
        ) {
          getGroup.parse(requiredData);
        }
        return [requiredData, resfromendpoint.status.toString(), groupObj];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2", groupObj];
      }
      break;
    case "Get Schemes":
      APIUrl = `${baseurl}customer/${customerId}/schemes`;
      try {
        resfromendpoint = await fetch(APIUrl, {
          method: "GET",
          headers,
        });
        requiredData = await resfromendpoint.json();
        if (
          resfromendpoint !== undefined &&
          resfromendpoint.status.toString() === "200"
        )
          GetScheme.parse(requiredData);
        return [requiredData, resfromendpoint.status.toString(), groupObj];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2", groupObj];
      }
      break;
    case "Get Group Profile":
      APIUrl = `${baseurl}document/group-profile:${customerId}`;
      try {
        resfromendpoint = await fetch(APIUrl, {
          method: "GET",
          headers,
        });
        requiredData = await resfromendpoint.json();
        if (
          resfromendpoint !== undefined &&
          resfromendpoint.status.toString() === "200"
        )
          GetGroupProfile.parse(requiredData);
        return [requiredData, resfromendpoint.status.toString(), groupObj];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2", groupObj];
      }
      break;
    case "Get Account Profile":
      APIUrl = `${baseurl}document/account-profile:${customerId}`;
      try {
        resfromendpoint = await fetch(APIUrl, {
          method: "GET",
          headers,
        });
        requiredData = await resfromendpoint.json();
        // if (
        //   resfromendpoint !== undefined &&
        //   resfromendpoint.status.toString() === "200"
        // )
        //   GetAccountprofile.parse(requiredData);
        return [requiredData, resfromendpoint.status.toString(), groupObj];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2", groupObj];
      }
      break;
    case "Get Account TXN_Doc":
      APIUrl = `${baseurl}document/account-txn:${schemeId}:${customerId}`;
      try {
        resfromendpoint = await fetch(APIUrl, {
          method: "GET",
          headers,
        });
        requiredData = await resfromendpoint.json();
        // if (
        //   resfromendpoint !== undefined &&
        //   resfromendpoint.status.toString() === "200"
        // )
        //   GetAccountprofileDoc.parse(requiredData);
        return [requiredData, resfromendpoint.status.toString(), groupObj];
      } catch (error) {
        console.error("An error occurred:", error);
        return [JSON.stringify(error, null, 2), "2", groupObj];
      }
      break;

    default:
      return [];
      break;
  }
}
