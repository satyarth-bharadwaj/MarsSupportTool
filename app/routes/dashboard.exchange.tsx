import { Form, useActionData } from "@remix-run/react";
import React, { useEffect, useState, useContext, useRef } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import "app/styles/CAV.css";
import { highlightJSONResponse } from "public/highlight.js";
import "app/styles/main.css";
import getStatusColor from "~/coupon/statusCode";
import handleTextSelection from "~/points/textSelection";
import filteringLogic from "~/exchange/filters";
import handleCustomerdetails from "~/exchange/customerDetails";
import filtersInitialDetails from "~/exchange/filtersDetails";
import initialData from "~/exchange/exchangeInitialdata";
import {
  generateCustomerToken,
  generateIdentityToken,
} from "./resources/tokenGenerator";
import callExchangeAPI from "./resources/exchangeAPI";
import getCookieValue, { getCredCookieValue } from "./resources/getCookie";
import { appContext } from "~/states/app-context";
import mapTabvalue from "~/exchange/mapTabValue";
import { parseExchangeFormData } from "./resources/readFormData";

export async function action({ request }: ActionFunctionArgs) {
  const cookieString = request.headers.get("Cookie");
  const dbValue = await getCookieValue(cookieString);
  let {
    customerId,
    schemeId,
    credentials,
    clubcard,
    api,
    isValidCustomerInput: isValidCustomer,
  } = await parseExchangeFormData(request);
  if (credentials === "") credentials = await getCredCookieValue(cookieString);
  if (customerId === "") {
    return [initialData[mapTabvalue(api)].content, "nullCustomer", api];
  } else {
    if (credentials !== "") {
      if (isValidCustomer) {
        try {
          let token: string;
          if (api === "Get eligibility" && clubcard !== "") {
            console.log(clubcard + customerId + credentials);
            token = await generateCustomerToken(credentials, clubcard, dbValue);
            const err = JSON.stringify({
              type: "system",
              errno: "ECONNRESET",
              code: "ECONNRESET",
              erroredSysCall: "read",
            });

            if (token !== err) {
              const response = await callExchangeAPI(
                customerId,
                schemeId,
                api,
                token,
                dbValue
              );
              console.log(response[0], response[1], api, response[2]);
              return [response[0], response[1], api, response[2]];
            }
          } else {
            token = await generateIdentityToken(credentials, dbValue);
            const err = JSON.stringify({
              type: "system",
              errno: "ETIMEDOUT",
              code: "ETIMEDOUT",
              erroredSysCall: "connect",
            });
            if (token !== err) {
              const response = await callExchangeAPI(
                customerId,
                schemeId,
                api,
                token,
                dbValue
              );
              return [response[0], response[1], api, response[2]];
            }
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

const Exchange: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedText, setSelectedText] = useState<string>("refresh");
  const actionData = useActionData<typeof action>();
  type DataKey = "1" | "2" | "3" | "4" | "5" | "6";
  const contextValues = useContext(appContext);
  if (!contextValues) {
    throw new Error("<Header> needs to be wrapped in <AppStateProvider>");
  }
  const [isDarkMode] = contextValues.darkmode || [false, () => {}];
  let tabValuefromapi: string = "Get Freeze Period";

  let statusCode: string = "nullCustomer";
  1;
  let datafromapi: any = initialData[mapTabvalue(tabValuefromapi)].content;

  if (actionData && Array.isArray(actionData)) {
    const [ResponseData, fromapistatusCode, api] = actionData;

    statusCode = fromapistatusCode;
    datafromapi = ResponseData;
    tabValuefromapi = api;
  }

  const customerInputRef = useRef<HTMLInputElement>(null);
  const schemeIdInputRef = useRef<HTMLInputElement>(null);
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

  const clearFilters = () => {
    if (selectedFilters.length > 0) {
      setSelectedFilters([]);
    }
  };
  const handleFilterChange = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters((prevSelectedFilters) =>
        prevSelectedFilters.filter((f) => f !== filter)
      );
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  return (
    <>
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

          <span className="input-group-text">CustomerId</span>
          <input
            type="text"
            ref={customerInputRef}
            aria-label="CustomerID"
            name="customerID"
            placeholder="Enter UUID"
            className={`form-control  ${!(statusCode === "invalidCustomer") ? "" : "is-invalid"}`}
          />
          <div className="invalid-feedback">Customer UUID is required.</div>
          {tabValuefromapi === "Get eligibility" && (
            <>
              <span className="input-group-text">Clubcard No</span>
              <input
                type="text"
                aria-label="Clubcard No"
                name="clubcard"
                placeholder="Enter Clubcard No"
                className="form-control"
              />
            </>
          )}
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
            return (
              <li className="nav-item" key={key}>
                <button
                  className={`nav-link ${mapTabvalue(tabValuefromapi) === key ? "active" : ""}`}
                  name="api"
                  aria-current="page"
                  type="submit"
                  value={String(initialData[key as DataKey].title)}
                >
                  {initialData[key as DataKey].title}
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
              </div>
              <div className="col d-flex justify-content-end align-items-center">
                {statusCode === "200" && (
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
                    {mapTabvalue(tabValuefromapi) === "3" &&
                      statusCode === "200" && (
                        <div>
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
                                    checked={selectedFilters.includes(filter)}
                                    onChange={() => handleFilterChange(filter)}
                                  />
                                  {filter}
                                </label>
                              </li>
                            ))}
                          </ul>
                          <button
                            className="btn btn-danger mx-3"
                            onClick={clearFilters}
                          >
                            Clear Filters
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <pre
            style={{ backgroundColor: isDarkMode ? "#2D2C2A" : "white" }}
            dangerouslySetInnerHTML={{
              __html:
                selectedFilters.length > 0
                  ? highlightJSONResponse(
                      filteringLogic(
                        mapTabvalue(tabValuefromapi),
                        selectedFilters,
                        datafromapi
                      )
                    )
                  : highlightJSONResponse(JSON.stringify(datafromapi, null, 2)),
            }}
          ></pre>
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
                        {" "}
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
    </>
  );
};
export default Exchange;
