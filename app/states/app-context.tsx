
import { PropsWithChildren, useState,createContext } from "react";

type AppContextType = {
  fullscreen: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  darkmode: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  menu: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  team: [string, React.Dispatch<React.SetStateAction<string>>];
};
export const appContext = createContext<AppContextType | undefined>(undefined);
const AppStateProvider = ({ children }: PropsWithChildren) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [team, setTeam] = useState("ppe");

  return (
    <appContext.Provider
      value={{
        fullscreen: [isFullScreen, setIsFullScreen],
        darkmode: [isDarkMode, setIsDarkMode],
        menu: [isMenuOpen, setIsMenuOpen],
        team: [team, setTeam],
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppStateProvider;
