import { 
    countryToSchemeMap, 
    allFunders, 
    BATCH_SIZE, 
    BATCH_DELAY, 
    extractTimestampFromFilename, 
    getFundersByCountry 
  } from "~/ops/opsData";
  
  describe("opsData", () => {
    describe("countryToSchemeMap", () => {
      it("should contain correct country to scheme mappings", () => {
        expect(countryToSchemeMap).toEqual({
          "UK": "UKClubcard",
          "ROI": "IEClubcard",
          "CZ": "CZClubcard",
          "SK": "SKClubcard",
          "HU": "HUClubcard"
        });
      });
    });
  
    describe("allFunders", () => {
      it("should contain all funder details", () => {
        expect(allFunders).toHaveLength(12);
        expect(allFunders[0]).toEqual({
          country: "UK",
          funderId: "1106",
          funderName: "Reward Partner bonus points"
        });
      });
    });
  
    describe("constants", () => {
      it("should have correct BATCH_SIZE", () => {
        expect(BATCH_SIZE).toBe(50);
      });
  
      it("should have correct BATCH_DELAY", () => {
        expect(BATCH_DELAY).toBe(100);
      });
    });
  
    describe("extractTimestampFromFilename", () => {
      it("should extract timestamp from filename", () => {
        const filename = "file_2023-01-01T12_30_45.123Z.csv";
        const result = extractTimestampFromFilename(filename);
        expect(result).toBe("2023-01-01T12:30:45.123Z");
      });
  
      it("should return current ISO string if no timestamp found", () => {
        const filename = "file_without_timestamp.csv";
        const result = extractTimestampFromFilename(filename);
        expect(result).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
      });
    });
  
    describe("getFundersByCountry", () => {
      it("should return funders for UK", () => {
        const result = getFundersByCountry("UK");
        expect(result).toHaveLength(4);
        expect(result[0].country).toBe("UK");
      });
  
      it("should return empty array for unknown country", () => {
        const result = getFundersByCountry("XX");
        expect(result).toHaveLength(0);
      });
    });
  });