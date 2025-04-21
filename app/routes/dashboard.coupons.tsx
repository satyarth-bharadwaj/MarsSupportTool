import { Form, useActionData } from "@remix-run/react";
import React, { useEffect, useState, useContext, useRef } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import "app/styles/CAV.css";
import { highlightJSONResponse } from "public/highlight.js";
import "app/styles/main.css";
import initialData from "~/coupon/couponsInitialData";
import filteringLogic from "~/coupon/filters";
import getStatusColor from "~/coupon/statusCode";
import filtersInitialDetails from "~/coupon/filtersDetails";
import handleGetCouponDetails from "~/coupon/couponDetails";
import handleTextSelection from "~/coupon/textSelection";
import getCookieValue, { getCredCookieValue } from "./resources/getCookie";
import { generateIdentityToken } from "./resources/tokenGenerator";
import callCouponAPI from "./resources/CouponAPI";
import { appContext } from "~/states/app-context";
import { handleGetDetails } from "~/coupon/customerDetails";
import { parseCouponFormData } from "./resources/readFormData";
import mapTabvalue from "~/coupon/mapTabValue";
import { isCoupon, isCustomerUuid } from "~/coupon/inputType";

export async function action({ request }: ActionFunctionArgs) {
  const cookieString = request.headers.get("Cookie");
  const dbValue = await getCookieValue(cookieString);
  let {
    input,
    credentials,
    api,
    isValidCouponInput: isValidCoupon,
    isValidCustomerInput: isValidCustomer,
  } = await parseCouponFormData(request);

  if (credentials === "") credentials = await getCredCookieValue(cookieString);
  if (input === "") {
    return [
      JSON.stringify(initialData[mapTabvalue(api)].content, null, 2),
      mapTabvalue(api) === "1" || mapTabvalue(api) === "2"
        ? "nullCoupon"
        : "nullCustomer",
      api,
    ];
  } else {
    if (credentials !== "") {
      if (isValidCoupon || isValidCustomer) {
        try {
          const token = await generateIdentityToken(credentials, dbValue);
          const err = JSON.stringify({
            type: "system",
            errno: "ETIMEDOUT",
            code: "ETIMEDOUT",
            erroredSysCall: "connect",
          });
          if (token !== err) {
            const response = await callCouponAPI(input, api, token, dbValue);
            return [response[0], response[1], api];
          }
          return ["connect ETIMEDOUT", "500", api];
        } catch (error) {
          console.error("An error occurred:", error);
          return [JSON.stringify(error, null, 2), "500", api];
        }
      }
    } else {
      return [
        JSON.stringify(initialData[mapTabvalue(api)].content, null, 2),
        mapTabvalue(api) === "1" || mapTabvalue(api) === "2"
          ? "null Credentials"
          : "null Credentials",
        api,
      ];
    }
  }

  return [
    JSON.stringify(initialData[mapTabvalue(api)].content, null, 2),
    mapTabvalue(api) === "1" || mapTabvalue(api) === "2"
      ? "invalidCoupon"
      : "invalidCustomer",
    api,
  ];
}
const CAV: React.FC = () => {
  const actionData = useActionData<typeof action>();
  const [selectedText, setSelectedText] = useState<string>("refresh");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  type DataKey = "1" | "2" | "3" | "4" | "5";
  const contextValues = useContext(appContext);
  if (!contextValues) {
    throw new Error("<Header> needs to be wrapped in <AppStateProvider>");
  }
  const [isDarkMode] = contextValues.darkmode || [false, () => {}];
  let tabValuefromapi: string = "Promotion";

  let statusCode: string = "nullCoupon";
  let datafromapi: any = initialData[mapTabvalue(tabValuefromapi)].content;

  if (actionData && Array.isArray(actionData)) {
    const [ResponseData, fromapistatusCode, api] = actionData;
    statusCode = fromapistatusCode;
    datafromapi = ResponseData;
    tabValuefromapi = api;
  }
  const couponInputRef = useRef<HTMLInputElement>(null);
  const customerInputRef = useRef<HTMLInputElement>(null);

  const handleURLParams = () => {
    const params = new URLSearchParams(window.location.search);
    const receivedCustomerID = params.get("CustomerID");
    const recievedCouponID = params.get("CouponID");
    if (receivedCustomerID) {
      if (customerInputRef.current) {
        if (isCustomerUuid(receivedCustomerID)) {
          tabValuefromapi = "Customer Coupons";
        }
        customerInputRef.current.value = receivedCustomerID;
        return "Customer Coupons";
      }
    }
    if (recievedCouponID) {
      if (couponInputRef.current) {
        if (isCoupon(recievedCouponID)) {
          tabValuefromapi = "Coupon By Ids";
        }
        couponInputRef.current.value = recievedCouponID;
        return "Coupon By Ids";
      }
    }
    datafromapi = initialData[mapTabvalue(tabValuefromapi)].content;
    return "";
  };

  useEffect(() => {
    if (selectedText === "refresh") {
      handleURLParams();
    }
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
      <div className="container" style={{ position: "sticky" }}>
        <Form method="POST" id="myForm">
          <div
            className={`container my-3 ${statusCode === "200" ? "d-none" : ""}`}
          >
            <div className="row justify-content-center mt-5">
              <div className="col-md-6">
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter Client credentials"
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
          <div className="container">
            <div className="row justify-content-center mt-5">
              <div className="col-md-6">
                <div
                  className={`input-group mb-3 ${
                    tabValuefromapi === "Promotion" ||
                    tabValuefromapi === "Coupon By Ids"
                      ? ""
                      : "d-none"
                  }`}
                >
                  <input
                    type="text"
                    className={`form-control ${!(statusCode === "invalidCoupon") ? "" : "is-invalid"}`}
                    placeholder="Enter couponID/promotionID."
                    name="couponID"
                    ref={couponInputRef}
                  />
                  <div className="invalid-feedback">
                    Enter valid couponID/promotionID.
                  </div>
                </div>
                <div
                  className={`input-group mb-3 ${
                    tabValuefromapi === "Promotion" ||
                    tabValuefromapi === "Coupon By Ids"
                      ? "d-none"
                      : ""
                  }`}
                >
                  <input
                    type="text"
                    className={`form-control ${!(statusCode === "invalidCustomer") ? "" : "is-invalid"}`}
                    placeholder="Enter customerId."
                    name="customerID"
                    ref={customerInputRef}
                  />
                  <div className="invalid-feedback">
                    Enter valid CustomerID.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ul className="nav nav-tabs my-3">
            {Object.keys(initialData).map((key) => (
              <li className="nav-item" key={key}>
                <button
                  className={`nav-link ${tabValuefromapi === key ? "active" : ""}`}
                  aria-current="page"
                  name="api"
                  value={String(initialData[key as DataKey].title)}
                  type="submit"
                >
                  {initialData[key as DataKey]!.title}
                </button>
              </li>
            ))}
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
                  {statusCode !== "nullCustomer" &&
                    statusCode !== "nullCoupon" && (
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
                        {(mapTabvalue(tabValuefromapi) === "1" ||
                          mapTabvalue(tabValuefromapi) === "2" ||
                          mapTabvalue(tabValuefromapi) === "3") &&
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

            <div>
              <pre
                style={{ backgroundColor: isDarkMode ? "#2D2C2A" : "white" }}
                dangerouslySetInnerHTML={{
                  __html:
                    selectedFilters.length > 0
                      ? highlightJSONResponse(
                          filteringLogic(
                            mapTabvalue(tabValuefromapi),
                            datafromapi,
                            selectedFilters,
                            filtersInitialDetails(mapTabvalue(tabValuefromapi))
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
                  <h5 className="card-title">{selectedText}</h5>
                  <div className="scrolling-buttons">
                    {selectedText.includes("promotionId") ? (
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() => {
                          handleGetCouponDetails(selectedText);
                        }}
                      >
                        Get Promotion Details
                      </button>
                    ) : selectedText.includes("issuedToCustomerId") ||
                      selectedText.toLowerCase().includes("customerid") ||
                      selectedText.startsWith("trn:tesco:uid:uuid:") ? (
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() => {
                          handleGetDetails(selectedText);
                        }}
                      >
                        Get Customer Details
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() => handleGetCouponDetails(selectedText)}
                      >
                        Get Coupon Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default CAV;
