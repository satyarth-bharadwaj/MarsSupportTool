import React, { useContext, useEffect } from "react";
import "../styles/header.css";
import { appContext } from "~/states/app-context";
import useDBselector from "./dbSelection";

const Header: React.FC = () => {
  const contextValues = useContext(appContext);
  if (!contextValues) {
    throw new Error("<Header> needs to be wrapped in <AppStateProvider>");
  }

  const [isFullScreen, setIsFullScreen] = contextValues.fullscreen || [
    false,
    () => {},
  ];
  const [isDarkMode, setIsDarkmode] = contextValues.darkmode || [
    false,
    () => {},
  ];
  const [, setIsMenuOpen] = contextValues.menu || [false, () => {}];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullScreen((prevFullScreen: boolean) => !prevFullScreen);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsFullScreen]);

  const headerStyle: React.CSSProperties = {
    margin: isFullScreen ? "-300px" : "0",
    color: isDarkMode ? "white" : "#121212",
    backgroundColor: isDarkMode ? "#181818" : "white",
    position: "fixed",
    zIndex: "9999",
    borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
  };
  return (
    <>
      <header style={headerStyle} data-testid="header">
        <div className="inner-div inner-div1">
          <button
            className="hunger-box-button"
            aria-label="HungerBox"
            onClick={() => setIsMenuOpen((prevMenu) => !prevMenu)}
          >
            {!isDarkMode ? (
              <img src="/menu.png" alt="Menu" />
            ) : (
              <img src="/icons8-menu-24.png" alt="Menu" />
            )}
          </button>

          <button
            className="full-screen-button"
            aria-label="Full Screen"
            onClick={() => setIsFullScreen((prevFullScreen) => !prevFullScreen)}
          >
            {!isDarkMode ? (
              <img src="/full-screen.png" alt="Full2 Screen" />
            ) : (
              <img src="/icons8-full-screen-48.png" alt="Full1 Screen" />
            )}
          </button>
        </div>

        <div className="inner-div ">
          <img src="/Tesco-Logo.wine.png" alt="Tesco" />
          <p className="my-1 text">
            <b>
              {" "}
              MARS Support Tool<span className="redot">.</span>
            </b>
          </p>
        </div>

        <div className="inner-div inner-div1">
          {useDBselector()}
          <button
            className="dark-mode-toggle"
            aria-label="Dark Mode"
            onClick={() => setIsDarkmode((prevDarkmode) => !prevDarkmode)}
          >
            {!isDarkMode ? (
              <img src="/icons8-dark-mode-48.png" alt="Dark1 Mode" />
            ) : (
              <img src="/icons8-light-mode-78.png" alt="Light Mode" />
            )}
          </button>
        </div>
      </header>
    </>
  );
};
export default Header;
