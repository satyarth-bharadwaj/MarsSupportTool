import React, { useState, useContext } from "react";
import { useActionData, useSubmit } from "@remix-run/react";
import { appContext } from "~/states/app-context";
import "~/styles/ops.css";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import getCookieValue, { getCredCookieValue } from "./resources/getCookie";
import { generateIdentityResponse } from "./resources/tokenGenerator";
import {
  validateHeaders,
  validateCSV,
  preValidateCSV
} from "~/ops/opsValidation";
import {
  countryToSchemeMap,
  allFunders,
  BATCH_SIZE,
  BATCH_DELAY,
  extractTimestampFromFilename,
  getFundersByCountry,
  FunderDetail
} from "~/ops/opsData";
import {
  downloadTemplate,
  downloadCSVWithErrors,
  downloadAllResults,
  downloadFailedTransactions
} from "~/ops/opsDownloadHandlers";

interface CreditResult {
  uuid: string;
  points: number;
  status: number;
  rawResponse: any;
  result: string;
  transactionId: string;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const creditData = formData.get("creditData");
  const cookieString = request.headers.get("Cookie");
  const dbValue = await getCookieValue(cookieString);
  const selectedCountry = formData.get("selectedCountry") as string;
  const fileName = formData.get("fileName") as string;
  const fileTimestamp = extractTimestampFromFilename(fileName);
  const credentials = process.env.CLIENT_CREDENTIALS || "";
  
  if (!creditData || typeof creditData !== "string") {
    return json({ error: "Invalid credit data" }, { status: 400 });
  }

  try {
    const parsedData = JSON.parse(creditData);
    const schemeId = countryToSchemeMap[selectedCountry];
    
    if (!schemeId) {
      return json({ error: "Invalid country selection" }, { status: 400 });
    }

    const response = await generateIdentityResponse(credentials, dbValue);
    const parsedResponse = response;
    let token = parsedResponse.access_token;
    let token_expires_in = parsedResponse.expires_in;
    let token_expiration_time = Date.now() + (token_expires_in * 1000);
    if (typeof token !== "string") {
      return { error: "Failed to generate token, please check the credentials!" };
    }
  
    const results: CreditResult[] = [];
    const totalBatches = Math.ceil(parsedData.length / BATCH_SIZE);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const batchStart = batchIndex * BATCH_SIZE;
      const batchEnd = batchStart + BATCH_SIZE;
      const batch = parsedData.slice(batchStart, batchEnd);
      const batchResults = await Promise.all(
        batch.map(async (row: any, index: number) => {
          try {
            const traceId = `postman-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const customerId = row.uuid;
            const points = row.points;
            const funderName = row.funderName;
            const transactionId = `${fileTimestamp}-${batchStart + index + 1}`;
            
            const requestBody = {
              points: points,
              funder: funderName,
              transactionReference: transactionId,
              metadata: {
                source: "Zendesk Tool"
              }
            };

            if (Date.now() > token_expiration_time) {
              const newResponse = await generateIdentityResponse(credentials, dbValue);
              const newParsedResponse = newResponse;
              token = newParsedResponse.access_token;
              token_expires_in = newParsedResponse.expires_in;
              token_expiration_time = Date.now() + (token_expires_in * 1000);
              
              if (typeof token !== "string") {
                return { error: "Failed to generate new token after expiration, please check the credentials!" };
              }
            }

            const headers = {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
              "TraceId": traceId
            };
            const apiUrl = `https://api.${dbValue === "PPE" ? "ppe." : ""}retail.tesco.com/storedvalue/points/customer/trn:tesco:uid:uuid:${customerId}/scheme/${schemeId}/credit/${transactionId}`;
            
            const response = await fetch(apiUrl, {
              method: "PUT",
              headers: headers,
              body: JSON.stringify(requestBody)
            });

            let rawResponse = await response.text();
            
            return {
              uuid: customerId,
              points: points,
              status: response.status,
              rawResponse: rawResponse,
              result: response.status === 200 ? "SUCCESS" : "FAIL",
              transactionId: transactionId
            };
          } catch (error) {
            return {
              uuid: row.uuid || "unknown",
              points: row.points || 0,
              status: 500,
              rawResponse: { error: error instanceof Error ? error.message : "API call failed" },
              result: "FAIL",
              transactionId: row.transactionId || "unknown"
            };
          }
        })
      );

      results.push(...batchResults);

      if (batchIndex < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
      }
    }

    return json({ results, totalBatches });
  } catch (error) {
    return json({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }, { status: 500 });
  }
};

const OpsPage: React.FC = () => {
  const contextValues = useContext(appContext);
  if (!contextValues) {
    throw new Error("Component needs to be wrapped in <AppStateProvider>");
  }

  const [isDarkMode] = contextValues.darkmode || [false];
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string[] }>({});
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedFunder, setSelectedFunder] = useState<string>("");
  const [selectedFunderDetails, setSelectedFunderDetails] = useState<FunderDetail | null>(null);
  const [preValidationError, setPreValidationError] = useState<string | null>(null);
  const [templateFunderName, setTemplateFunderName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<CreditResult[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [dbValue, setDbValue] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [totalBatches, setTotalBatches] = useState(0);
  const [processedItems, setProcessedItems] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    const validationError = preValidateCSV(file, selectedCountry, selectedFunder);
    if (validationError) {
      setPreValidationError(validationError);
      return;
    }
    
    setSelectedFile(file);
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split("\n").map(row => row.split(","));
      const headers = rows[0].map(h => h.trim());
      
      if (!validateHeaders(headers)) {
        alert("CSV file does not contain the required headers.");
        return;
      }

      const data = rows.slice(1).map(row => {
        return headers.reduce((acc, header, index) => {
          acc[header] = (row[index] || "").trim();
          return acc;
        }, {} as any);
      });

      setTableData(data);
      setValidationErrors(validateCSV(data, selectedFunderDetails, templateFunderName));
    };
    reader.readAsText(file);
  };

  const handleProceedToCredit = async () => {
    if (tableData.length === 0) {
      setApiError("No data to process");
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(0);
      setProcessedItems(0);
      setResults([]);
      setApiError(null);
      setShowResults(true);
      
      const dataToCredit = tableData.map(row => ({
        uuid: row["Customer UUID"]?.trim(),
        points: parseInt(row["Number of Points"]),
        funderId: row["Funder ID"]?.trim(),
        funderName: row["Funder Name"]?.trim(),
        transactionId: row["Transaction ID"]?.trim()
      }));

      const totalRows = dataToCredit.length;
      setTotalBatches(Math.ceil(totalRows / BATCH_SIZE));

      let processed = 0;
      const progressInterval = setInterval(() => {
        processed += BATCH_SIZE;
        const newProgress = Math.min(Math.floor((processed / totalRows) * 100), 95);
        setProgress(newProgress);
        setProcessedItems(Math.min(processed, totalRows));

        if (processed >= totalRows) {
          clearInterval(progressInterval);
        }
      }, 300);

      const formData = new FormData();
      formData.append("creditData", JSON.stringify(dataToCredit));
      formData.append("dbValue", dbValue);
      formData.append("selectedCountry", selectedCountry);
      formData.append("fileName", uploadedFileName);
      
      submit(formData, { method: "post" });

      return () => clearInterval(progressInterval);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Unknown error occurred");
      setIsProcessing(false);
    }
  };

  const resetProcess = () => {
    setShowResults(false);
    setResults([]);
    setApiError(null);
    setTableData([]);
    setValidationErrors({});
    setSelectedFile(null);
    setUploadedFileName('');
    setTotalBatches(0);
    setProcessedItems(0);
    setProgress(0);
  };

  React.useEffect(() => {
    if (actionData && !apiError) {
      if ('error' in actionData) {
        setApiError(actionData.error as string);
        setIsProcessing(false);
      } else if ('results' in actionData) {
        setResults(actionData.results as CreditResult[]);
        setProgress(100);
        setProcessedItems(tableData.length);
        setIsProcessing(false);
        setTotalBatches(actionData.totalBatches || 0);
        
        if ((actionData.results as CreditResult[]).some(result => result.status !== 200)) {
          setApiError("Some transactions failed. Please check the results.");
        }
      }
    }
  }, [actionData]);

  return (
    <div className={`ops-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="ops-main-content">
        {!showResults ? (
          <div className="ops-header">
            <h1 style={{ color: isDarkMode ? "white" : "inherit" }}>Points Crediting Tool</h1>
  
            <div className="ops-selectors">
              <div className="selector-container">
                <label htmlFor="country">Country:</label>
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedFunder("");
                    setSelectedFunderDetails(null);
                  }}
                  className="ops-select"
                >
                  <option value="">Select Country</option>
                  <option value="UK">UK</option>
                  <option value="ROI">ROI</option>
                  <option value="CZ">CZ</option>
                  <option value="SK">SK</option>
                  <option value="HU">HU</option>
                </select>
              </div>
  
              {selectedCountry && (
                <div className="selector-container">
                  <label htmlFor="funder">Funder:</label>
                  <select
                    id="funder"
                    value={selectedFunder}
                    onChange={(e) => {
                      const funderId = e.target.value;
                      setSelectedFunder(funderId);
                      const details = allFunders.find(f => 
                        f.country === selectedCountry && f.funderId === funderId
                      );
                      setSelectedFunderDetails(details || null);
                    }}
                    className="ops-select"
                  >
                    <option value="">Select Funder</option>
                    {getFundersByCountry(selectedCountry).map((funder) => (
                      <option key={funder.funderId} value={funder.funderId}>
                        {funder.funderName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
  
            {preValidationError && (
              <div className="pre-validation-error">
                {preValidationError}
              </div>
            )}
  
            <div className="ops-action-buttons">
              <button
                onClick={() => downloadTemplate(selectedCountry, selectedFunder, setTemplateFunderName, allFunders)}
                disabled={!selectedFunder}
                className={`ops-button ${!selectedFunder ? 'disabled' : 'download'}`}
                style={{
                  backgroundColor: !selectedFunder 
                    ? (isDarkMode ? "#555" : "#cccccc") 
                    : "#28a745",
                  color: "white",
                  cursor: !selectedFunder ? 'not-allowed' : 'pointer'
                }}
              >
                Point Crediting Files
              </button>
              
              <label className={`ops-button ${(!selectedCountry || !selectedFunder) ? 'disabled' : 'upload'}`}
                style={{
                  backgroundColor: (!selectedCountry || !selectedFunder) 
                    ? (isDarkMode ? "#555" : "#cccccc") 
                    : "#1059a7",
                  color: "white",
                  cursor: (!selectedCountry || !selectedFunder) ? 'not-allowed' : 'pointer'
                }}>
                Upload Data File
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".csv"
                  style={{ display: "none" }}
                  disabled={!selectedCountry || !selectedFunder}
                />
              </label>
            </div>

            {uploadedFileName && (
              <div className="uploaded-file-info" style={{
                marginTop: "10px",
                color: isDarkMode ? "#aaa" : "#555"
              }}>
                Uploaded file: {uploadedFileName}
              </div>
            )}
          </div>
        ) : (
          <div className="results-container" style={{
            backgroundColor: isDarkMode ? "#2D2C2A" : "white",
            border: isDarkMode ? "1px solid #444" : "1px solid #ddd",
            padding: "20px",
            borderRadius: "5px"
          }}>
            <div className="results-header">
              <h1 style={{ color: isDarkMode ? "white" : "inherit" }}>Points Crediting Results</h1>
              <div className="results-actions">
                <button
                  onClick={() => downloadAllResults(uploadedFileName, selectedCountry, selectedFunder, results)}
                  className="ops-button download"
                  disabled={!results.length}
                  style={{
                    backgroundColor: !results.length 
                      ? (isDarkMode ? "#555" : "#cccccc") 
                      : "#28a745",
                    color: "white",
                    cursor: !results.length ? 'not-allowed' : 'pointer'
                  }}
                >
                  Transaction Status Records
                </button>
                <button
                  onClick={() => downloadFailedTransactions(uploadedFileName, selectedCountry, selectedFunder, results)}
                  className="ops-button download"
                  disabled={!results.length || !results.some(r => r.status !== 200)}
                  style={{
                    backgroundColor: !results.length || !results.some(r => r.status !== 200)
                      ? (isDarkMode ? "#555" : "#cccccc") 
                      : "#dc3545",
                    color: "white",
                    cursor: !results.length || !results.some(r => r.status !== 200) ? 'not-allowed' : 'pointer'
                  }}
                >
                  Failed Transactions Records
                </button>
                <button
                  onClick={resetProcess}
                  className="ops-button reset"
                  disabled={isProcessing}
                  style={{
                    backgroundColor: isProcessing 
                      ? (isDarkMode ? "#555" : "#cccccc") 
                      : "#ffc107",
                    color: isProcessing ? "#aaa" : "black",
                    cursor: isProcessing ? 'not-allowed' : 'pointer'
                  }}
                >
                  Start New Process
                </button>
              </div>
            </div>
  
            {isProcessing && (
              <div className="processing-indicator">
                <div className="progress-info">
                  <span>Batch Processing Data {processedItems} of {tableData.length} items. Wait for the API responses.</span>
                </div>
                <div className="progress-bar" style={{
                  backgroundColor: isDarkMode ? "#333" : "#e9ecef"
                }}>
                  <div className="progress-fill" style={{ 
                    width: `${progress}%`,
                    backgroundColor: isDarkMode ? "#1a73e8" : "#1059a7"
                  }}></div>
                </div>
              </div>
            )}
  
            {apiError && (
              <div className="api-error-message" style={{
                color: "#dc3545",
                backgroundColor: isDarkMode ? "#3a1c1c" : "#f8d7da",
                padding: "10px",
                borderRadius: "4px",
                margin: "10px 0"
              }}>
                <strong>Error:</strong> {apiError}
              </div>
            )}
  
            <div className="results-table-container" style={{ 
              maxHeight: '500px', 
              overflowY: 'auto',
              marginTop: "20px"
            }}>
              <table className="results-table" style={{
                width: "100%",
                borderCollapse: "collapse"
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: isDarkMode ? "#333" : "#f8f9fa"
                  }}>
                    <th style={{ padding: "12px 15px" }}>Customer UUID</th>
                    <th style={{ padding: "12px 15px" }}>Points</th>
                    <th style={{ padding: "12px 15px" }}>Status</th>
                    <th style={{ padding: "12px 15px" }}>Result</th>
                    <th style={{ padding: "12px 15px" }}>Transaction ID</th>
                    <th style={{ padding: "12px 15px" }}>API Response</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} style={{
                      backgroundColor: isDarkMode 
                        ? (index % 2 === 0 ? "#2D2C2A" : "#3D3D3D")
                        : (index % 2 === 0 ? "#f8f9fa" : "white"),
                      borderBottom: isDarkMode ? "1px solid #444" : "1px solid #ddd"
                    }}>
                      <td style={{ padding: "12px 15px" }}>{result.uuid}</td>
                      <td style={{ padding: "12px 15px" }}>{result.points}</td>
                      <td style={{ 
                        padding: "12px 15px",
                        color: result.status === 200 ? "#28a745" : "#dc3545",
                        fontWeight: "bold"
                      }}>
                        {result.status}
                      </td>
                      <td style={{ 
                        padding: "12px 15px",
                        color: result.result === 'SUCCESS' ? "#28a745" : "#dc3545"
                      }}>
                        {result.result}
                      </td>
                      <td style={{ padding: "12px 15px" }}>{result.transactionId}</td>
                      <td style={{ padding: "12px 15px", whiteSpace: "pre-wrap" }}>
                      {
                          result.status === 200
                              ? "API Successful"
                              : (() => {
                                  if (result.rawResponse == null) return "";
                                  try {
                                      const parsed = typeof result.rawResponse === 'string' 
                                          ? JSON.parse(result.rawResponse) 
                                          : result.rawResponse;
                                      
                                      return (parsed.code && parsed.detail) 
                                          ? `${parsed.code}: ${parsed.detail}`
                                          : "";
                                  } catch {
                                      return "";
                                  }
                              })()
                      }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ops-content-area">
          {!showResults && tableData.length > 0 && (
            <>
              <div className="csv-action-buttons" style={{ marginBottom: "20px" }}>
                {Object.keys(validationErrors).length > 0 ? (
                  <button
                    onClick={() => downloadCSVWithErrors(uploadedFileName, selectedCountry, selectedFunder, tableData, validationErrors)}
                    className="ops-button error-download"
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white"
                    }}
                  >
                    Failed Validations
                  </button>
                ) : (
                  <button
                    onClick={handleProceedToCredit}
                    className="ops-button proceed"
                    style={{
                      backgroundColor: "#28a745",
                      color: "white"
                    }}
                  >
                    Proceed to Credit
                  </button>
                )}
              </div>

              <div className="csv-table-container" style={{ overflowX: "auto" }}>
                <table className="csv-table" style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "20px"
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: isDarkMode ? "#333" : "#f8f9fa"
                    }}>
                      {tableData.length > 0 && Object.keys(tableData[0]).map((key) => (
                        <th 
                          key={key}
                          style={{ 
                            padding: "12px 15px",
                            textAlign: "left"
                          }}
                        >
                          {key}
                        </th>
                      ))}
                      <th style={{ padding: "12px 15px" }}>Errors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index} style={{
                        backgroundColor: isDarkMode 
                          ? (index % 2 === 0 ? "#2D2C2A" : "#3D3D3D")
                          : (index % 2 === 0 ? "#f8f9fa" : "white"),
                        borderBottom: isDarkMode ? "1px solid #444" : "1px solid #ddd"
                      }}>
                        {Object.entries(row).map((entry, idx) => {
                          const [key, value] = entry as [string, string];
                          return (
                            <td 
                              key={idx}
                              style={{ padding: "12px 15px" }}
                            >
                              {value}
                            </td>
                          );
                        })}                     
                        <td style={{ padding: "12px 15px" }}>
                          <div>
                            {validationErrors[row["Customer UUID"]] ? 
                              validationErrors[row["Customer UUID"]].join(", ") : "-"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OpsPage;