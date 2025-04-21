import { FunderDetail, allFunders, extractTimestampFromFilename } from "./opsData";

interface CreditResult {
  uuid: string;
  points: number;
  status: number;
  rawResponse: any;
  result: string;
  transactionId: string;
}

export const downloadTemplate = (
  selectedCountry: string, 
  selectedFunder: string,
  setTemplateFunderName: (name: string) => void,
  allFunders: FunderDetail[]
) => {
  const selectedFunderDetails = allFunders.find(
    funder => funder.country === selectedCountry && funder.funderId === selectedFunder
  );
  
  if (!selectedFunderDetails) {
    alert("Please select a valid funder.");
    return;
  }

  const funderName = selectedFunderDetails.funderName;
  setTemplateFunderName(funderName);

  const timestamp = new Date().toISOString().replace(/:/g, '_');
  const headers = ["Customer UUID", "Number of Points", "Funder ID", "Funder Name"];
  const exampleData = [
    "",
    "",
    selectedFunderDetails.funderId,
    funderName
  ];
  
  const csvContent = [headers.join(","), exampleData.join(",")].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${selectedCountry}_${funderName.replace(/[^a-zA-Z0-9]/g, '_')}_template_${timestamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadCSVWithErrors = (
  uploadedFileName: string,
  selectedCountry: string,
  selectedFunder: string,
  tableData: any[],
  validationErrors: { [key: string]: string[] }
) => {
  const fileTimestamp = extractTimestampFromFilename(uploadedFileName);
  const timestampPart = fileTimestamp;
  
  const selectedFunderDetails = allFunders.find(
    funder => funder.country === selectedCountry && funder.funderId === selectedFunder
  );
  
  const funderNamePart = selectedFunderDetails 
    ? selectedFunderDetails.funderName.replace(/[^a-zA-Z0-9]/g, '_') 
    : 'unknown_funder';

  // Create a map of row numbers (1-based index)
  const rowNumbers = new Map();
  tableData.forEach((row, index) => {
    rowNumbers.set(row["Customer UUID"], index + 1);
  });

  // Filter rows that have validation errors
  const errorRows = tableData.filter(row => 
    validationErrors[row["Customer UUID"]] && 
    validationErrors[row["Customer UUID"]].length > 0
  );

  if (errorRows.length === 0) {
    alert("No validation errors found to download.");
    return;
  }

  const headers = [...Object.keys(tableData[0]), "Row Number", "Errors"];
  const rows = errorRows.map((row) => {
    const errorMessage = validationErrors[row["Customer UUID"]] ? 
      validationErrors[row["Customer UUID"]].join("; ") : "";
    const rowValues = Object.values(row).map(value => `"${value}"`);
    return [...rowValues, `"${rowNumbers.get(row["Customer UUID"])}"`, `"${errorMessage}"`];
  });
  
  const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${selectedCountry}_${funderNamePart}_validation_errors_${timestampPart}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadAllResults = (
  uploadedFileName: string,
  selectedCountry: string,
  selectedFunder: string,
  results: CreditResult[]
) => {
  const fileTimestamp = extractTimestampFromFilename(uploadedFileName);
  const timestampPart = fileTimestamp;
  
  const selectedFunderDetails = allFunders.find(
    funder => funder.country === selectedCountry && funder.funderId === selectedFunder
  );
  
  const funderNamePart = selectedFunderDetails 
    ? selectedFunderDetails.funderName.replace(/[^a-zA-Z0-9]/g, '_') 
    : 'unknown_funder';

  const csvContent = [
    ["Customer UUID", "Points", "Status", "Result", "Transaction ID", "API Response"],
    ...results.map(result => {
        if (result.rawResponse == null) return [
            result.uuid,
            result.points,
            result.status,
            result.result,
            result.transactionId,
            ""
        ];
        try {
            const parsed = typeof result.rawResponse === 'string' 
                ? JSON.parse(result.rawResponse) 
                : result.rawResponse;
            const apiResponse = (parsed.code && parsed.detail) 
                ? `${parsed.code}: ${parsed.detail}`
                : "";
            
            return [
                result.uuid,
                result.points,
                result.status,
                result.result,
                result.transactionId,
                apiResponse
            ];
        } catch {
            return [
                result.uuid,
                result.points,
                result.status,
                result.result,
                result.transactionId,
                "API Successful"
            ];
        }
    })
  ].map(row => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedCountry}_${funderNamePart}_all_results_${timestampPart}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};

export const downloadFailedTransactions = (
  uploadedFileName: string,
  selectedCountry: string,
  selectedFunder: string,
  results: CreditResult[]
) => {
  const fileTimestamp = extractTimestampFromFilename(uploadedFileName);
  const timestampPart = fileTimestamp;
  
  const selectedFunderDetails = allFunders.find(
    funder => funder.country === selectedCountry && funder.funderId === selectedFunder
  );
  
  const funderNamePart = selectedFunderDetails 
    ? selectedFunderDetails.funderName.replace(/[^a-zA-Z0-9]/g, '_') 
    : 'unknown_funder';

  const failedTransactions = results.filter(result => result.status !== 200);

  const csvContent = [
    ["Customer UUID", "Points", "Status", "Result", "Transaction ID", "API Response"],
    ...failedTransactions.map(result => {
        if (result.rawResponse == null) return [
            result.uuid,
            result.points,
            result.status,
            result.result,
            result.transactionId,
            ""
        ];
        try {
            const parsed = typeof result.rawResponse === 'string' 
                ? JSON.parse(result.rawResponse) 
                : result.rawResponse;
            const apiResponse = (parsed.code && parsed.detail) 
                ? `${parsed.code}: ${parsed.detail}`
                : "";
            
            return [
                result.uuid,
                result.points,
                result.status,
                result.result,
                result.transactionId,
                apiResponse
            ];
        } catch {
            return [
                result.uuid,
                result.points,
                result.status,
                result.result,
                result.transactionId,
                ""
            ];
        }
    })
  ].map(row => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedCountry}_${funderNamePart}_failed_transactions_${timestampPart}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};