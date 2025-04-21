import filteringLogic from "~/exchange/filters";

describe("filteringLogic function", () => {
  const mockResponse1 = [
    {
      collectionPeriodNumber: 132,
      collectionPeriodDescription: "Oct2025",
      collectionPeriodStartDate: "2024-10-18T00:00:00.000Z",
      collectionPeriodEndDate: "2024-11-27T23:59:59.999Z",
      statementLandingDate: "2024-12-22T00:00:00.000Z",
      pointsThreshold: 150,
      pointsToRewardConversion: 0.01,
    },
    {
      collectionPeriodNumber: 130,
      collectionPeriodDescription: "Nov2024",
      collectionPeriodStartDate: "2024-07-19T00:00:00.000Z",
      collectionPeriodEndDate: "2024-10-17T23:59:59.999Z",
      statementLandingDate: "2024-10-28T00:00:00.000Z",
      pointsThreshold: 150,
      pointsToRewardConversion: 0.01,
    },
  ];

  it('should correctly filter array of objects for toggle "3"', () => {
    const toggle = "3";
    const selectedFilters = ["collectionPeriodNumber", "pointsThreshold"];
    //please dont change the indendation of the expectedJson string else the test case will fail.
    const expectedJsonString = `[
  {
    "collectionPeriodNumber": 132,
    "pointsThreshold": 150
  },
  {
    "collectionPeriodNumber": 130,
    "pointsThreshold": 150
  }
]`;
    expect(filteringLogic(toggle, selectedFilters, mockResponse1)).toEqual(
      expectedJsonString
    );
  });
});
