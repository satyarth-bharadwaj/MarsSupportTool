const filtersInitialDetails = (toggle: string): string[] => {
  let filters: string[] = [];

  switch (toggle) {
    case "1":
      filters = ["reasonType", "message"];
      break;

    case "2":
      filters = ["fdvFreezePeriod", "statementFreezePeriod"];
      break;

    case "3":
      filters = [
        "collectionPeriodNumber",
        "collectionPeriodDescription",
        "collectionPeriodStartDate",
        "collectionPeriodEndDate",
        "statementLandingDate",
        "pointsThreshold",
        "pointsToRewardConversion",
      ];
      break;

    case "4":
      filters = ["pointsToVouchers", "pointsToSaversVouchers"];
      break;

    case "5":
      filters = ["schemes"];
      break;

    case "6":
      filters = [""];
      break;

    default:
      filters = [""];
  }

  return filters;
};

export default filtersInitialDetails;
