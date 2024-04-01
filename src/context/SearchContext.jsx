import { createContext, useReducer } from "react";

const INITIAN_STATE = {
  city: "",
  dates: [],
  options: {
    adults: 1,
    children: 0,
    room: 1
  }
};

export const SearchContext = createContext(INITIAN_STATE);

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload;

    case "RESET_SEARCH":
      return INITIAN_STATE;

    default:
      return state;

  }
}

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, INITIAN_STATE);

  return (
    <SearchContext.Provider 
    value={{ 
      city:state.city,
      dates: state.dates,
      options: state.options,
      dispatch
     }}>
      {children}
    </SearchContext.Provider>
  )
}