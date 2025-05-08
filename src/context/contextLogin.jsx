import { createContext, useContext, useEffect, useReducer } from 'react';
import { validateToken } from '../api/tokenApi';

// Initial state
const initialState = {
    name: '',
    token: ''
};

const ADD_LOGIN = 'ADD_LOGIN';
const LOGOUT = 'LOGOUT';



function loginReducer(state, action) {
    switch (action.type) {
        case ADD_LOGIN:
            return {
                name: action.payload.name,
                token: action.payload.token
            };
        case LOGOUT:
            return {
                name: '',
                token: '' 
            };
        
        default:
            return state;
    }


}
const loginContext = createContext();

function LoginProvider({ children }) {


    const [state, dispatch] = useReducer(loginReducer, initialState);

    useEffect(() => {
        const tokenValidate = async () => {
            try {
                const response = await validateToken();
                
            } catch (err) {
              console.log(err);
            //   navigate("/error500");
            }
          };
      
          tokenValidate();


    }, []);

    const addLogin = ({ name, token }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('name', name);
        dispatch({ type: ADD_LOGIN, payload: { name, token } });
    };

    const getName = () => state.name|| localStorage.getItem('name');
    const getToken = () => state.token || localStorage.getItem('token');
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        dispatch({ type: LOGOUT });
    };

    

    return (
        <loginContext.Provider value={{
            addLogin,
            getName,
            getToken,
            logout
        }}>
            {children}
        </loginContext.Provider>
    );
}

export function useLogin() {
    const context = useContext(loginContext);
    if (!context) {
        throw new Error('useLogin must be used within a LoginProvider');
    }
    return context;
} 