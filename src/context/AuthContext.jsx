import { createContext, useEffect, useReducer } from "react";


const getUserId = (user) => {
  return user ? user._id : null; 
};

const initState = () => {
  try {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    return {
      user: user,
      loading: false,
      error: undefined
    };
  } catch (err) {
    console.error("Error initializing state:", err);
    return {
      user: null,
      loading: false,
      error: err.message
    };
  }
}


const INITIAL_STATE = initState();

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: undefined,
        loading: true,
        error: undefined
      }
    
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: undefined
      }

    case "LOGIN_FAILURE":
      return {
        user: undefined,
        loading: false,
        error: action.payload
      } 

    case "LOGOUT":  
      return {
        user: undefined,
        loading: false,
        error: undefined
      }

    default:
      return state;
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        userId: getUserId(state.user), 
        loading: state.loading,
        error: state.error,
        dispatch,
        logout
      }}>
      {children}
    </AuthContext.Provider>
  )
}
