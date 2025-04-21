import { 
    isValidUUID, 
    validateHeaders, 
    validateFileName, 
    validateRow, 
    validateCSV, 
    preValidateCSV 
  } from "~/ops/opsValidation";
  
  describe("opsValidation", () => {
    describe("isValidUUID", () => {
      it("should validate correct UUID", () => {
        expect(isValidUUID("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
      });
  
      it("should invalidate incorrect UUID", () => {
        expect(isValidUUID("invalid-uuid")).toBe(false);
        expect(isValidUUID("")).toBe(false);
        expect(isValidUUID("123")).toBe(false);
      });
    });
  
    describe("validateHeaders", () => {
      const requiredHeaders = ["Customer UUID", "Number of Points", "Funder ID", "Funder Name"];
  
      it("should validate correct headers", () => {
        expect(validateHeaders(requiredHeaders)).toBe(true);
      });
  
      it("should validate headers with different case and spacing", () => {
        expect(validateHeaders(["customer uuid", "number of points", "funder id", "funder name"])).toBe(true);
        expect(validateHeaders([" Customer UUID ", " Number of Points ", " Funder ID ", " Funder Name "])).toBe(true);
      });
  
      it("should invalidate incorrect headers", () => {
        expect(validateHeaders(["Wrong Header", "Another Header"])).toBe(false);
        expect(validateHeaders([])).toBe(false);
        expect(validateHeaders(requiredHeaders.slice(0, 2))).toBe(false);
      });
    });
  
    describe("validateFileName", () => {
      it("should validate correct country patterns", () => {
        expect(validateFileName("UK_file.csv", "UK")).toBe(true);
        expect(validateFileName("United_Kingdom_data.csv", "UK")).toBe(true);
        expect(validateFileName("ROI_data.csv", "ROI")).toBe(true);
        expect(validateFileName("Ireland_file.csv", "ROI")).toBe(true);
      });
  
      it("should invalidate incorrect country patterns", () => {
        expect(validateFileName("UK_file.csv", "ROI")).toBe(false);
        expect(validateFileName("random_file.csv", "UK")).toBe(false);
        expect(validateFileName("", "UK")).toBe(false);
      });
    });
  
    describe("validateRow", () => {
      let uuidTracker: Map<string, number>;
      const funderDetails = { funderId: "1106", funderName: "Test Funder" };
  
      beforeEach(() => {
        uuidTracker = new Map();
      });
  
      it("should validate correct row", () => {
        const row = {
          "Customer UUID": "123e4567-e89b-12d3-a456-426614174000",
          "Number of Points": "100",
          "Funder ID": "1106",
          "Funder Name": "Test Funder"
        };
        
        const errors = validateRow(row, uuidTracker, funderDetails);
        expect(errors).toEqual([]);
      });
  
      it("should detect duplicate UUID", () => {
        const uuid = "123e4567-e89b-12d3-a456-426614174000";
        uuidTracker.set(uuid, 1);
        
        const row = {
          "Customer UUID": uuid,
          "Number of Points": "100",
          "Funder ID": "1106",
          "Funder Name": "Test Funder"
        };
        
        const errors = validateRow(row, uuidTracker, funderDetails);
        expect(errors).toContain("Duplicate Customer UUID detected.");
      });
  
      it("should validate points values", () => {
        const testCases = [
          { value: "", expected: "Number of Points is required." },
          { value: "abc", expected: "Number of Points must be a valid number." },
          { value: "10.5", expected: "Number of Points must be an integer." },
          { value: "-10", expected: "Number of Points cannot be negative." },
          { value: "0", expected: "Number of Points must be greater than 0." },
          { value: "10001", expected: "Number of Points must not exceed 10,000." }
        ];
  
        testCases.forEach(({ value, expected }) => {
          const row = {
            "Customer UUID": "123e4567-e89b-12d3-a456-426614174000",
            "Number of Points": value,
            "Funder ID": "1106",
            "Funder Name": "Test Funder"
          };
          
          const errors = validateRow(row, uuidTracker, funderDetails);
          expect(errors).toContain(expected);
        });
      });
    });
  
    describe("validateCSV", () => {
      it("should return errors for invalid rows", () => {
        const data = [{
          "Customer UUID": "invalid",
          "Number of Points": "-100",
          "Funder ID": "",
          "Funder Name": ""
        }];
        
        const errors = validateCSV(data);
        expect(Object.keys(errors)).toHaveLength(1);
        expect(errors["invalid"]).toEqual([
          "Customer UUID must be a valid UUID.",
          "Number of Points cannot be negative.",
          "Funder ID is required.",
          "Funder Name is required."
        ]);
      });
  
      it("should return empty object for valid data", () => {
        const data = [{
          "Customer UUID": "123e4567-e89b-12d3-a456-426614174000",
          "Number of Points": "100",
          "Funder ID": "1106",
          "Funder Name": "Test Funder"
        }];
        
        const errors = validateCSV(data);
        expect(errors).toEqual({});
      });
    });
  
    describe("preValidateCSV", () => {
      const mockFile = (name: string, size: number) => 
        new File([""], name, { type: "text/csv", lastModified: Date.now() });
  
      it("should validate file requirements", () => {
        const file = mockFile("UK_file.csv", 1024);
        const error = preValidateCSV(file, "UK", "1106");
        expect(error).toBeNull();
      });
  
      it("should reject non-CSV files", () => {
        const file = mockFile("file.txt", 1024);
        const error = preValidateCSV(file, "UK", "1106");
        expect(error).toBe("Please upload a valid CSV file.");
      });
  
      it("should validate country in filename", () => {
        const file = mockFile("wrong_file.csv", 1024);
        const error = preValidateCSV(file, "UK", "1106");
        expect(error).toBe("File name doesn't match the selected country (UK).");
      });
  
      it("should require country and funder selection", () => {
        const file = mockFile("UK_file.csv", 1024);
        const error1 = preValidateCSV(file, "", "1106");
        expect(error1).toBe("Please select both a country and funder before uploading a file.");
        
        const error2 = preValidateCSV(file, "UK", "");
        expect(error2).toBe("Please select both a country and funder before uploading a file.");
      });
    });
  });