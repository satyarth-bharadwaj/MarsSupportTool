import { Form, useActionData } from "@remix-run/react";
import React, {
  useEffect,
  useState,
  ChangeEvent,
  useContext,
  useRef,
} from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import "app/styles/Points.css";
import { highlightJSONResponse } from "public/highlight.js";
import "app/styles/main.css";
import handleTextSelection from "~/points/textSelection";
import filteringLogic from "~/points/filters";
import handleCustomerdetails from "~/points/customerDetails";
import initialData from "~/points/pointsInitialData";
import filtersInitialDetails from "~/points/filtersDetails";
import getStatusColor from "~/coupon/statusCode";
import getCookieValue, { getCredCookieValue } from "./resources/getCookie";
import { parseFormData } from "./resources/readFormData";
import { generateIdentityToken } from "./resources/tokenGenerator";
import callPointsAPI from "./resources/pointsAPI";
import { appContext } from "~/states/app-context";
import mapTabvalue from "~/points/mapTabValue";
import { useNavigate } from "react-router-dom";

export async function action({ request }: ActionFunctionArgs) {
  const cookieString = request.headers.get("Cookie");
  const dbValue = await getCookieValue(cookieString);
  let {
    customerId,
    schemeId,
    credentials,
    api,
    isValidCustomerInput: isValidCustomer,
  } = await parseFormData(request);
  if (credentials === "") credentials = await getCredCookieValue(cookieString);
  if (customerId === "") {
    return [initialData[mapTabvalue(api)].content, "nullCustomer", api];
  } else {
    if (credentials !== "") {
      if (isValidCustomer) {
        try {
          const token = await generateIdentityToken(credentials, dbValue);
          const err = JSON.stringify({
            type: "system",
            errno: "ETIMEDOUT",
            code: "ETIMEDOUT",
            erroredSysCall: "connect",
          });
          console.log(token);
          if (token !== err) {
            const response = await callPointsAPI(
              customerId,
              schemeId,
              api,
              token,
              dbValue
            );
            return [response[0], response[1], api, response[2]];
          }
          return ["connect ETIMEDOUT", "500", api];
        } catch (error) {
          console.error("An error occurred:", error);
          return [JSON.stringify(error, null, 2), "500", api];
        }
      }
    } else {
      return [initialData[mapTabvalue(api)].content, "null Credentials", api];
    }
  }

  return [initialData[mapTabvalue(api)].content, "invalidCustomer", api];
}

const Points: React.FC = () => {
  const actionData = useActionData<typeof action>();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedText, setSelectedText] = useState<string>("refresh");
  const [selectedStartDate, setSelectedStartDate] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");
  const navigate = useNavigate();

  type DataKey = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
  const contextValues = useContext(appContext);
  if (!contextValues) {
    throw new Error("<Header> needs to be wrapped in <AppStateProvider>");
  }
  const [isDarkMode] = contextValues.darkmode || [false, () => {}];
  const customerInputRef = useRef<HTMLInputElement>(null);
  const schemeIdInputRef = useRef<HTMLInputElement>(null);
  const changeCustomerId = (input: string) => {
    if (customerInputRef.current) {
      customerInputRef.current.value = input;
    }
  };
  const handleURLParams = () => {
    const params = new URLSearchParams(window.location.search);
    const receivedCustomerID = params.get("CustomerID");
    const receivedSchemeID = params.get("SchemeId");

    if (receivedCustomerID) {
      if (customerInputRef.current) {
        customerInputRef.current.value = receivedCustomerID;
      }
    }
    if (receivedSchemeID) {
      if (schemeIdInputRef.current) {
        schemeIdInputRef.current.value = receivedSchemeID;
      }
    }
  };
  const clearFilters = () => {
    if (selectedFilters.length > 0) {
      setSelectedFilters([]);
    }
    if (
      mapTabvalue(tabValuefromapi) === "8" ||
      mapTabvalue(tabValuefromapi) === "2"
    ) {
      setSelectedStartDate("");
      setSelectedEndDate("");
    }
  };

  let tabValuefromapi: string = "Get Balances";

  let statusCode: string = "nullCustomer";
  let datafromapi: any = initialData[mapTabvalue(tabValuefromapi)].content;
  let primary: string = "";
  let secondary: string = "";
  let groupID: string = "";
  if (actionData && Array.isArray(actionData)) {
    const [ResponseData, fromapistatusCode, api, groupObj] = actionData;

    statusCode = fromapistatusCode;
    if (statusCode === "200") {
      primary = groupObj.primary;
      secondary = groupObj.secondary;
      groupID = groupObj.groupID;
    }
    datafromapi = ResponseData;
    tabValuefromapi = api;
  }
  useEffect(() => {
    if (selectedText === "refresh") handleURLParams();
    const hoverFunction = () => {
      const selection = window.getSelection();
      let text = "";
      if (selection) {
        text = selection.toString().trim();
        setSelectedText(text);
      }
    };
    document.addEventListener("mouseup", hoverFunction);
    return () => {
      document.removeEventListener("mouseup", hoverFunction);
    };
  }, []);

  const handleFilterChange = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters((prevSelectedFilters) =>
        prevSelectedFilters.filter((f) => f !== filter)
      );
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };
  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedStartDate(event.target.value);
  };
  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedEndDate(event.target.value);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      backgroundColor: isDarkMode ? "#121212" : "#f4f4f9",
      minHeight: "100vh",
    }}>
      {/* Validation Button Section */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "10px 20px",
        backgroundColor: isDarkMode ? "#1F1F1F" : "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}>
        <button
          onClick={() => navigate("/dashboard/ops")}
          style={{
            padding: "8px 16px",
            backgroundColor: isDarkMode ? "#1059a7" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Points Crediting
        </button>
      </div>

      {/* Original Points Dashboard Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Form method="post" id="myForm" style={{ position: "sticky" }}>
          <div className="input-group">
            <div
              className={`container my-3 ${statusCode !== "200" ? "" : "d-none"}`}
            >
              <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter Client Credentials"
                      name="credentials"
                      onChange={(event) => {
                        const credentials = event.target.value; // Get the value entered in the input field
                        document.cookie = `cred=${credentials}; path=/`; // Set the cookie with the value
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <span className="input-group-text">
              {tabValuefromapi === "Get Group" ||
              tabValuefromapi === "Get Group Profile"
                ? "Group ID"
                : "Customer ID"}
            </span>
            <input
              type="text"
              ref={customerInputRef}
              aria-label="CustomerID"
              name="customerID"
              placeholder={
                tabValuefromapi === "Get Group" ||
                tabValuefromapi === "Get Group Profile"
                  ? "Enter Group ID"
                  : "Enter UUID"
              }
              className={`form-control ${!(statusCode === "invalidCustomer") ? "" : "is-invalid"}`}
            />
            <div className="invalid-feedback">Customer UUID is required.</div>
            <span className="input-group-text">Scheme ID</span>
            <select
              aria-label="SchemeId"
              className={`form-control`}
              name="SchemeId"
            >
              <option value="UKClubcard">UKClubcard</option>
              <option value="IEClubcard">IEClubcard</option>
              <option value="ROIClubcard">ROIClubcard</option>
              <option value="CZClubcard">CZClubcard</option>
            </select>
          </div>
          <ul className="nav nav-tabs my-4">
            {Object.keys(initialData).map((key) => {
              if (groupID === "" && (key === "6" || key === "5")) {
                return null;
              }
              return (
                <li className="nav-item" key={key}>
                  <button
                    className={`nav-link ${mapTabvalue(tabValuefromapi) === key ? "active" : ""}`}
                    name="api"
                    aria-current="page"
                    type="submit"
                    value={String(initialData[key as DataKey].title)}
                  >
                    {initialData[key as DataKey]!.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </Form>

        <div className="tab-pane fade show active" role="tabpanel">
          <div
            className="container"
            style={{
              border: "2px solid #1059a7",
              padding: "0px 0px 0px 0px",
              backgroundColor: isDarkMode ? "#2D2C2A" : "white",
              color: isDarkMode ? "white" : "black",
            }}
          >
            <div
              className=""
              style={{ backgroundColor: "#1059a7", padding: "2px" }}
            >
              <div className="row">
                <div className="col">
                  <h3 style={{ color: isDarkMode ? "black" : "white" }}>
                    {tabValuefromapi}
                  </h3>
                  <div className="button-container relative-wrapper">
                    {groupID !== "" && (
                      <div className="mx-3">
                        <div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="inlineRadioOptions"
                              id="inlineRadio1"
                              value="primary"
                              onChange={() => changeCustomerId(primary)}
                            />
                            <label className="form-check-label">primary</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="inlineRadioOptions"
                              id="inlineRadio2"
                              value="secondary"
                              onChange={() => changeCustomerId(secondary)}
                            />
                            <label className="form-check-label">secondary</label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col d-flex justify-content-end align-items-center">
                  {statusCode === "200" && (
                    <div className="dropdown">
                      {mapTabvalue(tabValuefromapi) === "8" ? (
                        <div className="mb-3">
                          <label htmlFor="startDate" className="form-label">
                            Start Date:
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="startDate"
                            value={selectedStartDate}
                            onChange={handleStartDateChange}
                          />
                          <label htmlFor="endDate" className="form-label">
                            End Date:
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="endDate"
                            value={selectedEndDate}
                            onChange={handleEndDateChange}
                          />
                          <button
                            className="btn btn-success my-3 mx-3"
                            onClick={clearFilters}
                          >
                            Clear Filters
                          </button>
                        </div>
                      ) : (
                        <div className="dropdown d-flex align-items-center">
                          {statusCode === null ? (
                            <div
                              className="spinner-grow spinner-grow-sm text-danger mr-2 mx-5"
                              role="status"
                            >
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          ) : (
                            <div className="col d-flex justify-content-center">
                              <div
                                className="rounded-circle mr-2"
                                style={{
                                  backgroundColor: getStatusColor(statusCode),
                                  width: "20px",
                                  height: "20px",
                                }}
                              ></div>
                              <p className="font-weight-bold mb-1 mx-2">
                                {statusCode}
                              </p>
                            </div>
                          )}
                          {mapTabvalue(tabValuefromapi) === "2" &&
                            statusCode === "200" && (
                              <div className="mb-3 d-flex justify-content-center">
                                <label className="form-label">Start Date:</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={selectedStartDate}
                                  onChange={handleStartDateChange}
                                  style={{
                                    maxWidth: "120px",
                                    marginRight: "5px",
                                    marginTop: "15px",
                                    height: "40px",
                                  }}
                                />
                                <label className="form-label">End Date:</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={selectedEndDate}
                                  onChange={handleEndDateChange}
                                  style={{
                                    maxWidth: "120px",
                                    marginRight: "5px",
                                    height: "40px",
                                    marginTop: "15px",
                                  }}
                                />
                              </div>
                            )}
                          {(mapTabvalue(tabValuefromapi) === "2" ||
                            mapTabvalue(tabValuefromapi) === "7" ||
                            mapTabvalue(tabValuefromapi) === "8") &&
                            statusCode === "200" && (
                              <div>
                                <div className="d-flex">
                                  <button
                                    className="btn btn-light dropdown-toggle"
                                    type="button"
                                    id="multiSelectDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    onClick={() =>
                                      filtersInitialDetails(
                                        mapTabvalue(tabValuefromapi)
                                      )
                                    }
                                    style={{
                                      marginRight: "2px",
                                      height: "40px",
                                    }}
                                  >
                                    Select Filters
                                  </button>
                                  <ul
                                    className="dropdown-menu dropdown-menu-end"
                                    aria-labelledby="multiSelectDropdown"
                                  >
                                    {filtersInitialDetails(
                                      mapTabvalue(tabValuefromapi)
                                    ).map((filter) => (
                                      <li key={filter}>
                                        <label className="dropdown-item">
                                          <input
                                            type="checkbox"
                                            value={filter}
                                            checked={selectedFilters.includes(
                                              filter
                                            )}
                                            onChange={() =>
                                              handleFilterChange(filter)
                                            }
                                          />
                                          {filter}
                                        </label>
                                      </li>
                                    ))}
                                  </ul>
                                  <button
                                    className="btn btn-danger mx-3"
                                    onClick={clearFilters}
                                    style={{
                                      height: "40px",
                                    }}
                                  >
                                    Clear Filters
                                  </button>
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <pre
                style={{ backgroundColor: isDarkMode ? "#2D2C2A" : "white" }}
                dangerouslySetInnerHTML={{
                  __html:
                    selectedFilters.length > 0 ||
                    ((mapTabvalue(tabValuefromapi) === "2" ||
                      mapTabvalue(tabValuefromapi) === "8") &&
                      selectedEndDate !== "" &&
                      selectedStartDate !== "")
                      ? highlightJSONResponse(
                          filteringLogic(
                            mapTabvalue(tabValuefromapi),
                            selectedStartDate,
                            selectedEndDate,
                            selectedFilters,
                            datafromapi
                          )
                        )
                      : highlightJSONResponse(
                          JSON.stringify(datafromapi, null, 2)
                        ),
                }}
              ></pre>
            </div>
          </div>
          {selectedText && (
            <div style={handleTextSelection(selectedText)}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Selected Text: {selectedText}</h5>
                  {selectedText.startsWith("trn:tesco:uid:uuid:") && (
                    <div className="scrolling-buttons">
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() => handleCustomerdetails(selectedText)}
                      >
                        Get Customer Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Points;