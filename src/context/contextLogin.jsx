import { createContext, useContext, useEffect, useReducer } from 'react';
import { validateToken } from '../api/tokenApi';

// Initial state
const initialState = {
  name: localStorage.getItem('name') || '',
    token: localStorage.getItem('token') || ''
};

const ADD_LOGIN = 'ADD_LOGIN';
const LOGOUT = 'LOGOUT';


// funciones del contexto
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

export function LoginProvider({ children }) {


    const [state, dispatch] = useReducer(loginReducer, initialState);


    
    useEffect(() => {
        // Inicializar el estado con los valores de localStorage
        const storedToken = localStorage.getItem('token');
        const storedName = localStorage.getItem('name');
        
        if (storedToken && storedName) {
            dispatch({ 
                type: ADD_LOGIN, 
                payload: { 
                    name: storedName, 
                    token: storedToken 
                } 
            });
            
            // Validar el token al cargar
            validateUserToken(storedToken);
        }
    }, []);
    const validateUserToken = async (token) => {
        try {
            const response=  await  validateToken(token);
            if (!response.ok) {
                // Token inválido, hacer logout 
                logout();
            }
        } catch (err) {
            console.error("Error validando token:", err);
            logout();
        }
    };

    const addLogin = ({ name, token }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('name', name);
        dispatch({ type: ADD_LOGIN, payload: { name, token } });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        dispatch({ type: LOGOUT });
    };

    

    return (
        <loginContext.Provider value={{
            isLoggedIn: !!state.token, //si hay un token
            name: state.name,           
            token: state.token,         
            addLogin, //funcion para añadir el login
            logout //funcion para cerrar sesion
        }}>
            {children}
        </loginContext.Provider>
    );
}


// Custom hook para usar el contexto de login
export function useLogin() {
    const context = useContext(loginContext);
    if (!context) {
        throw new Error('useLogin must be used within a LoginProvider');
    }
    return context;
} 