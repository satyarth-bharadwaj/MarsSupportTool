import { 
    downloadTemplate, 
    downloadCSVWithErrors, 
    downloadAllResults, 
    downloadFailedTransactions 
  } from "~/ops/opsDownloadHandlers";
  import { allFunders } from "~/ops/opsData";
  import { vi } from 'vitest';
  
  // Mock global objects
  const mockClick = vi.fn();
  const mockCreateObjectURL = vi.fn(() => "mock-url");
  const mockRevokeObjectURL = vi.fn();
  
  describe("opsDownloadHandler", () => {
    beforeEach(() => {
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      global.alert = vi.fn();
      
      // Mock document.createElement for anchor tags
      document.createElement = vi.fn().mockImplementation((tagName) => {
        if (tagName === 'a') {
          return {
            click: mockClick,
            href: '',
            download: '',
            setAttribute: vi.fn(),
          };
        }
        return document.createElement(tagName);
      });
    });
  
    afterEach(() => {
      vi.clearAllMocks();
    });
  
    describe("downloadTemplate", () => {
      it("should download template with correct format", () => {
        const setTemplateFunderName = vi.fn();
        downloadTemplate("UK", "1106", setTemplateFunderName, allFunders);
        
        expect(setTemplateFunderName).toHaveBeenCalledWith("Reward Partner bonus points");
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockClick).toHaveBeenCalled();
      });
  
      it("should show alert for invalid funder", () => {
        downloadTemplate("XX", "9999", vi.fn(), allFunders);
        expect(global.alert).toHaveBeenCalledWith("Please select a valid funder.");
        expect(mockCreateObjectURL).not.toHaveBeenCalled();
      });
    });
  
    describe("downloadCSVWithErrors", () => {
      it("should download CSV with validation errors", () => {
        const tableData = [
          { "Customer UUID": "uuid1", "Number of Points": "100", "Funder ID": "1106", "Funder Name": "Test" }
        ];
        const validationErrors = { "uuid1": ["Invalid UUID"] };
        
        downloadCSVWithErrors("UK_file.csv", "UK", "1106", tableData, validationErrors);
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockClick).toHaveBeenCalled();
      });
  
      it("should show alert when no errors found", () => {
        downloadCSVWithErrors("file.csv", "UK", "1106", [], {});
        expect(global.alert).toHaveBeenCalledWith("No validation errors found to download.");
        expect(mockCreateObjectURL).not.toHaveBeenCalled();
      });
    });
  
    describe("downloadAllResults", () => {
      it("should download all results CSV", () => {
        const results = [{
          uuid: "uuid1",
          points: 100,
          status: 200,
          result: "success",
          transactionId: "txn1",
          rawResponse: { data: "test" }
        }];
        
        downloadAllResults("UK_file.csv", "UK", "1106", results);
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockClick).toHaveBeenCalled();
      });
    });
  
    describe("downloadFailedTransactions", () => {
      it("should download only failed transactions", () => {
        const results = [
          { uuid: "uuid1", points: 100, status: 400, result: "fail", transactionId: "txn1", rawResponse: "error" },
          { uuid: "uuid2", points: 200, status: 200, result: "success", transactionId: "txn2", rawResponse: "ok" }
        ];
        
        downloadFailedTransactions("UK_file.csv", "UK", "1106", results);
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockClick).toHaveBeenCalled();
      });
    });
  });