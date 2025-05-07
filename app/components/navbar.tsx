import React, { useContext, useState } from "react";
import "app/styles/Navbar.css";
import { appContext } from "~/states/app-context";
import { NavLink } from "@remix-run/react";

const Navbar: React.FC = () => {
  const contextValues = useContext(appContext);
  if (!contextValues) {
    throw new Error("<Header> needs to be wrapped in <appStateProvider>");
  }

  const [isDarkMode] = contextValues.darkmode || [false, () => {}];
  const [isMenuOpen] = contextValues.menu || [false, () => {}];
  const navstyle: React.CSSProperties = {
    color: isDarkMode ? "white" : "#121212",
    backgroundColor: isDarkMode ? "#181818" : "#fdf8ede9",
    width: isMenuOpen ? "20%" : "100%",
    margin: isMenuOpen ? "0" : "-300px",
  };

  const [activeNavLink, setActiveNavLink] = useState<string>("");

  const navLinks = [
    {
      name: "coupons",
      label: "Coupon",
      icon: "/icons8-voucher-30.png",
      to: "/dashboard/coupons",
    },
    {
      name: "points",
      label: "Points",
      icon: "/icons8-points-24.png",
      to: "/dashboard/points",
    },
    {
      name: "exchange",
      label: "Exchange",
      icon: "/icons8-currency-exchange-24.png",
      to: "/dashboard/exchange",
    },
    {
      name: "barcode",
      label: "Barcode",
      icon: "/icons8-scan-24.png",
      to: "/dashboard/scanBarcode",
    },
    {
      name: "clubcard",
      label: "Clubcard",
      icon: "/icons8-credit-card-30.png",
      to: "/dashboard/clubcard",
    },
    {
      name: "feedback",
      label: "Feedback",
      icon: "/icons8-location-24.png",
      to: "/dashboard/feedback",
    },
  ];

  const handleNavClick = (navLink: string) => {
    setActiveNavLink(navLink);
  };

  return (
    <>
      <div
        className="navbar-container container my-3"
        style={navstyle}
        data-testid="navbar"
      >
        <ul className="navbar-list">
          {navLinks.map((navLink) => (
            <li key={navLink.name}>
              <NavLink
                to={navLink.to}
                style={{
                  color: isDarkMode ? "#8C8C8C" : "#004e97",
                  backgroundColor: isDarkMode ? "#181818" : "#fdf8ede9",
                  border: "none",
                  cursor: "pointer",
                  padding: "px 10px",
                  textAlign: "center",

                  display: "inline-block",
                  fontSize: "15px",
                  margin: "4px 2px",
                }}
                onClick={() => handleNavClick(navLink.name)}
              >
                <a
                  style={{
                    color: isDarkMode ? "#8C8C8C" : "#004e97",
                    backgroundColor: isDarkMode ? "#181818" : "#fdf8ede9",
                    border: "none",
                    cursor: "pointer",
                    padding: "px 10px",
                    textAlign: "center",
                    textDecoration:
                      activeNavLink === navLink.name ? "underline" : "none",
                    display: "inline-block",
                    fontSize: "15px",
                    margin: "4px 2px",
                  }}
                  aria-label={navLink.name}
                >
                  <img
                    src={navLink.icon}
                    alt={navLink.label}
                    className="mx-1 center"
                  />
                  {navLink.label}
                </a>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;