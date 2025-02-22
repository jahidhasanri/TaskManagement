import React, { useContext } from 'react';
import { Navigate} from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const PrivateRoute = ({ children }) => {
    const {user,loader}=useContext(AuthContext)
   
    if (loader) {
        return <span className="loading loading-spinner text-error"></span>;
    }

    if (user) {
        return children;
    }

       return <Navigate to="/" replace />;
  
};

export default PrivateRoute;