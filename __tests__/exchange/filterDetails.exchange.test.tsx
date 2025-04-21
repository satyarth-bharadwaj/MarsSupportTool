import filtersInitialDetails from "~/exchange/filtersDetails";

describe("filtersInitialDetails function", () => {
  it('should return correct filters for toggle "1"', () => {
    const toggle = "1";
    const expectedFilters = ["reasonType", "message"];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it('should return correct filters for toggle "2"', () => {
    const toggle = "2";
    const expectedFilters = ["fdvFreezePeriod", "statementFreezePeriod"];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it('should return correct filters for toggle "3"', () => {
    const toggle = "3";
    const expectedFilters = [
      "collectionPeriodNumber",
      "collectionPeriodDescription",
      "collectionPeriodStartDate",
      "collectionPeriodEndDate",
      "statementLandingDate",
      "pointsThreshold",
      "pointsToRewardConversion",
    ];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it('should return correct filters for toggle "4"', () => {
    const toggle = "4";
    const expectedFilters = ["pointsToVouchers", "pointsToSaversVouchers"];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it('should return correct filters for toggle "5"', () => {
    const toggle = "5";
    const expectedFilters = ["schemes"];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it('should return empty array for toggle "6"', () => {
    const toggle = "6";
    const expectedFilters: string[] = [""];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it("should return empty array for unknown toggle", () => {
    const toggle = "7";
    const expectedFilters: string[] = [""];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });
});
