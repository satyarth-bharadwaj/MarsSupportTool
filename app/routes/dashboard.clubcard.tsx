import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import "app/styles/CAV.css";
import { highlightJSONResponse } from "public/highlight.js";
import "app/styles/main.css";
import { useContext } from "react";
import { appContext } from "~/states/app-context";
import getCookieValue from "./resources/getCookie";
//import { generateClubcardToken } from "./resources/tokenGenerator";
//import { clubcardDetails } from "./resources/clubcardAPI";

export async function action({ request }: ActionFunctionArgs) {
  const cookieString = request.headers.get("Cookie");
  let dbValue: string | null = null; // Initialize as null
  if (cookieString) {
    dbValue = await getCookieValue(cookieString);
  }

  const formBody = await request.formData();
  const clubcard = formBody.get("clubcard");
  const credentials = "";
  //const token = await generateClubcardToken(credentials, dbValue);

  if (clubcard !== "") {
    // const res = await clubcardDetails(token, dbValue, JSON.stringify(clubcard));
    // console.log(res);
    // return res;
    return "";
  }
  return "An error occurred. Please check your credentials or try again later."; // Or provide a more specific error message
}

const getClubcardCustomer = () => {
  const data = useActionData<typeof action>(); // Optional type
  const contextValues = useContext(appContext);
  if (!contextValues) {
    throw new Error("<Header> needs to be wrapped in <AppStateProvider>");
  }
  const [isDarkMode] = contextValues.darkmode || [false, () => {}];
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
  const labelStyle: React.CSSProperties = {
    color: "#004e97", // Change text color to #004e97
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    marginBottom: "0",
    marginRight: "10px",
    textAlign: "right",
    width: "120px", // Adjust the width as needed
  };
  return (
    <>
      <Form method="post">
        <div className="container" style={{ marginBottom: "20px" }}>
          <div className="row justify-content-center align-items-center">
            <div className="col-6 text-center col-md-6">
              <div style={inputContainerStyle}>
                <label style={labelStyle}>Clubcard No:</label>
                <input
                  type="text"
                  className="form-control"
                  style={inputStyle}
                  placeholder="Enter Clubcard Number"
                  name="clubcard"
                />
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
        {data && (
          <div className="row justify-content-center mt-5">
            <div className="col-md-6">
              <pre
                style={{ backgroundColor: isDarkMode ? "#2D2C2A" : "white" }}
                dangerouslySetInnerHTML={{
                  __html: highlightJSONResponse(data),
                }}
              ></pre>
            </div>
          </div>
        )}
      </Form>
    </>
  );
};
export default getClubcardCustomer;
