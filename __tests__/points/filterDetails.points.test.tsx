import filtersInitialDetails from "~/points/filtersDetails";

describe("filtersInitialDetails function", () => {
  it('should return ["test"] for toggle "1"', () => {
    const toggle = "1";
    const expectedFilters = ["test"];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it('should return an array of filters for toggle "2"', () => {
    const toggle = "2";
    const expectedFilters = [
      "eventId",
      "activityType",
      "amount",
      "dateTime",
      "authorisedId",
      "customerId",
    ];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it('should return ["preferenceType", "details"] for toggle "3"', () => {
    const toggle = "3";
    const expectedFilters = ["preferenceType", "details"];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it('should return ["members", "createdAt"] for toggle "4"', () => {
    const toggle = "4";
    const expectedFilters = ["members", "createdAt"];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it('should return ["schemes"] for toggle "5"', () => {
    const toggle = "5";
    const expectedFilters = ["schemes"];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it('should return an empty array for toggle "6"', () => {
    const toggle = "6";
    const expectedFilters: string[] = [""];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it('should return an array of filters for toggle "7"', () => {
    const toggle = "7";
    const expectedFilters = [
      "createdAt",
      "schemaVersion",
      "createdBy",
      "customerId",
      "id",
      "schemes",
      "type",
    ];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it('should return an array of filters for toggle "8"', () => {
    const toggle = "8";
    const expectedFilters = [
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
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });

  it("should return an empty array for unknown toggle", () => {
    const toggle = "9";
    const expectedFilters: string[] = [""];
    expect(filtersInitialDetails(toggle)).toEqual(expectedFilters);
  });
});
