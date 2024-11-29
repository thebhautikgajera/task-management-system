import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getLocalStorage, setLocalStorage } from '../utils/LocalStorage';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // setLocalStorage();

  // localStorage.clear();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Initialize localStorage if needed
    if (!localStorage.getItem('employees')) {
      setLocalStorage();
    }
    
    // Get employee data from localStorage
    const { employees } = getLocalStorage();
    
    if (employees) {
      setUserData({ employees });
    }
  }, []);

  return (
    <AuthContext.Provider value={userData}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;