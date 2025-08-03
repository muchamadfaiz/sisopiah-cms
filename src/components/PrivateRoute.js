// import React, { useEffect } from "react";
// import { Route, Redirect } from "react-router-dom";

// const PrivateRoute = ({ component: Component, auth, ...rest }) => {

//   useEffect(()=>{

//   },[])

//   return <Route
//   {...rest}
//   render={props =>
//     localStorage.getItem('token') ? (
//       <Component {...props} />
//     ) : (
//       <Redirect to="/auth" />
//     )
//   }
// />
// };

import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, auth, privileges, requiredPrivilege, ...rest }) => {

  useEffect(() => {
    // You can perform any side effects or cleanup here
  }, []);

  const hasPrivilege = () => {
    return privileges && privileges.includes(requiredPrivilege);
  };

  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem('token') 
        && hasPrivilege() ? 
        (
          <Component {...props} />
        ) : (
          <Redirect to="/auth" />
        )
      }
    />
  );
};

export default PrivateRoute;