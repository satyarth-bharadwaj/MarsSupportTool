import { Outlet } from "@remix-run/react";
import { useContext } from "react";
import Navbar from "~/components/navbar";
import { appContext } from "~/states/app-context";

const Dashboard: React.FC = () => {
  const contextValues = useContext(appContext);
  if (!contextValues) {
    throw new Error("component needs to be wrapped in <AppStateProvider>");
  }
  const [isFullScreen] = contextValues.fullscreen || [false, () => {}];
  const [isDarkMode] = contextValues.darkmode || [false, () => {}];

  const [isMenuOpen] = contextValues.menu || [false, () => {}];
  const mainContentStyle = {
    marginTop: isFullScreen ? "0rem" : "2rem",
    display: "flex", // Use flexbox for layout
    color: isDarkMode ? "white" : "#121212",
    backgroundColor: isDarkMode ? "#181818" : "#fdf8ede9",
  };
  const NavStyle = {
    display: isMenuOpen ? "block" : "none",
    flex: isMenuOpen ? "0 0 130px" : "0 0 0px",
    minHeight: "100vh",
  };
  const mainstyle = {
    backgroundColor: isDarkMode ? "#1F1F1F" : "white",
  };

  return (
    <>
      <div className="flexing" style={mainContentStyle} data-testid="Dashboard">
        <div
          className="navbar p-3 container my-3"
          style={NavStyle}
          data-testid="child-navbar"
        >
          <Navbar />
        </div>
        <div
          className="main-content p-3 container my-5"
          style={mainstyle}
          data-testid="child-mainOutlet"
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default Dashboard;
