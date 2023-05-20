import React from "react";
import { Location } from "../typing/types";

interface AppProviderProps {
  children: React.ReactNode;
}

interface AppContextType {
  locations: Location[];
  setLocations: (locations: Location[]) => void;
}

const initialAppContext: AppContextType = {
  locations: [],
  setLocations: () => {},
};

export const AppContext =
  React.createContext<AppContextType>(initialAppContext);

const AppProvider = ({ children }: AppProviderProps) => {
  const [locations, setLocations] = React.useState<Location[]>([]);

  return (
    <AppContext.Provider value={{ locations, setLocations }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
