import React, {  Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from 'components/shared-components/Loading';
import Login from "./authentication/login";
import Register from "./authentication/register";
import ForgotPassword from "./authentication/forgot-password";
import Activate from "./authentication/activate";
import Resend from "./authentication/resend";
import Please from "./authentication/please";
import ErrorOne from "./errors/error-page-1";
import ErrorTwo from "./errors/error-page-2";
import { strings } from "res";

export const AppViews = ({match}) => {
  return (
    <Suspense fallback={<Loading cover="page"/>}>
      <Switch>
        <Route path={`${match.url}/${strings.navigation.path.login}`} component={Login} />
        <Route path={`${match.url}/${strings.navigation.path.register}`} component={Register} />
        <Route path={`${match.url}/${strings.navigation.path.forgot_password}`} component={ForgotPassword} />
        <Route path={`${match.url}/${strings.navigation.path.activate}`} component={Activate} />
        <Route path={`${match.url}/resend`} component={Resend} />
        <Route path={`${match.url}/${strings.navigation.path.please}`} component={Please} />
        <Route path={`${match.url}/${strings.navigation.path.error_one}`} component={ErrorOne} />
        <Route path={`${match.url}/${strings.navigation.path.error_two}`} component={ErrorTwo} />
        <Redirect from={`${match.url}`} to={`${match.url}/${strings.navigation.path.login}`} />
      </Switch>
    </Suspense>
  )
}

export default AppViews;

