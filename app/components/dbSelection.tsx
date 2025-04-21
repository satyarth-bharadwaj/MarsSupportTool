import { useContext, useState } from "react";
import { appContext } from "~/states/app-context";

const useDBselector = () => {
  const contextValues = useContext(appContext);

  if (!contextValues) {
    throw new Error("<Header> needs to be wrapped in <AppStateProvider>");
  }
  const [dbValue, setdbValue] = useState("Select DB");
  const [isDarkMode] = contextValues.darkmode || [false, () => {}];

  // Function to handle clicking on PPE database option
  const handlePPEClick = () => {
    setdbValue("PPE");
    document.cookie = "db=PPE; path=/";
  };

  // Function to handle clicking on Production database option
  const handleProductionClick = () => {
    setdbValue("PROD");
    document.cookie = "db=PROD; path=/";
  };

  return (
    <div className="btn-group">
      <button
        className={`btn btn-${isDarkMode ? "dark" : "light"} dropdown-toggle`}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {dbValue}
      </button>
      <ul className="dropdown-menu">
        <li>
          <button className="dropdown-item" onClick={handlePPEClick}>
            PPE
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={handleProductionClick}>
            PRODUCTION
          </button>
        </li>
      </ul>
    </div>
  );
};

export default useDBselector;
