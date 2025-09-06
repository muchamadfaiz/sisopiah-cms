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

  const result = privileges && privileges.includes(requiredPrivilege);

  // 🔎 Debug log
  console.log("=== PrivateRoute Check ===");
  console.log("Route path:", rest.path);
  console.log("Required privilege:", requiredPrivilege);
  console.log("Privileges allowed:", privileges);
  console.log("Match result:", result);
  console.log("=== PrivateRoute Check ===");

  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("token") && hasPrivilege() ? <Component {...props} /> : <Redirect to="/auth" />
      }
    />
  );
};

export default PrivateRoute;
