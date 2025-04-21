const filtersInitialDetails = (toggle: string): string[] => {
  let filters: string[] = [];

  switch (toggle) {
    case "1":
      filters = ["test"];
      break;

    case "2":
      filters = [
        "eventId",
        "activityType",
        "amount",
        "dateTime",
        "authorisedId",
        "customerId",
      ];
      break;

    case "3":
      filters = ["preferenceType", "details"];
      break;

    case "4":
      filters = ["members", "createdAt"];
      break;

    case "5":
      filters = ["schemes"];
      break;

    case "6":
      filters = [""];
      break;

    case "7":
      filters = [
        "createdAt",
        "schemaVersion",
        "createdBy",
        "customerId",
        "id",
        "schemes",
        "type",
      ];
      break;

    case "8":
      filters = [
        "snapshots",
        "createdAt",
        "schemaVersion",
        "balance",
        "createdBy",
        "customerId",
        "schemeId",
        "id",
        "type",
        "events",
      ];
      break;

    default:
      filters = [""];
      break;
  }

  return filters;
};

export default filtersInitialDetails;
