import React, { useContext } from "react";
import { Form, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { appContext } from "~/states/app-context";
import { highlightJSONResponse } from "public/highlight";
import "app/styles/main.css";
export async function action({ request }: ActionFunctionArgs) {
  const formBody = await request.formData();
  const scanType = formBody.get("scanType");
  const scanData = formBody.get("scanData");
  const barcodeScanurl = `https://api-ppe.tesco.com/deployment/store-platform-portal-service/api/v1/identifyBarcode?scanData=${scanData}&scanType=${scanType}`;
  try {
    const resfromendpoint = await fetch(barcodeScanurl, {
      method: "GET",
    });
    const requiredData = await resfromendpoint.json();
    return requiredData.result;
  } catch (error) {
    console.log(error);
    return { error };
  }
}

const Barcode: React.FC = () => {
  const contextValues = useContext(appContext);
  if (!contextValues) {
    throw new Error("<Header> needs to be wrapped in <AppStateProvider>");
  }
  const [isDarkMode] = contextValues.darkmode || [false, () => {}];
  const labelStyle: React.CSSProperties = {
    color: "#004e97", // Change text color to #004e97
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    marginBottom: "0",
    marginRight: "10px",
    textAlign: "right",
    width: "120px", // Adjust the width as needed
  };

  const inputContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "Arial, sans-serif",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    flexGrow: 1,
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "10px",
  };

  const actionData = useActionData<typeof action>();
  let barcodeData;

  if (actionData) {
    barcodeData = actionData;
  }
  const tooltipContent = `
  UK_CLUBCARD_VOUCHER : Code128
  ROI_NON_SMART_COUPON : Code128
  ROI_SMART_COUPON : Code128
  ROI_CLUBCARD_VOUCHER : Code128
  PRODUCT : EAN13
  COLLEAGUE_AUTH : AZTEC
  `;

  return (
    <Form method="post">
      <div className="container" style={{ marginBottom: "20px" }}>
        <div className="row justify-content-center align-items-center">
          <div className="col-6 text-center col-md-6">
            <div style={inputContainerStyle}>
              <label style={labelStyle}>Scan Data:</label>
              <input
                type="text"
                className="form-control"
                style={inputStyle}
                placeholder="Enter Scan Data"
                name="scanData"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginBottom: "20px" }}>
        <div className="row justify-content-center align-items-center">
          <div className="col-6 text-center col-md-6">
            <div style={inputContainerStyle}>
              <label style={labelStyle}>Scan Type:</label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  style={inputStyle}
                  placeholder="Enter Scan Type"
                  name="scanType"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={tooltipContent}
                >
                  <i className="fas fa-question-circle">
                    <span>?</span>
                  </i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-6 text-center">
            <button
              type="submit"
              className="btn btn-primary"
              style={buttonStyle}
            >
              Check
            </button>
          </div>
        </div>
      </div>
      {barcodeData && (
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <pre
              style={{ backgroundColor: isDarkMode ? "#2D2C2A" : "white" }}
              dangerouslySetInnerHTML={{
                __html: highlightJSONResponse(
                  JSON.stringify(barcodeData, null, 2)
                ),
              }}
            ></pre>
          </div>
        </div>
      )}
    </Form>
  );
};
export default Barcode;
