import { createContext, useContext} from "react";
import useSearchForm from "../hooks/useSearchForm";

const Context = createContext();

export default function SearchProvider({ children }) {
const search = useSearchForm()

  return (
    <Context.Provider
      value={search}
    >
      {children}
    </Context.Provider>
  );
}

export function useSearch() {
  return useContext(Context);
}
