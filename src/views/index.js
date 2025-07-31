import React, { useEffect } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "layouts/app-layout";
import AuthLayout from 'layouts/auth-layout';
import AppLocale from "lang";
import jwt_decode from 'jwt-decode'
import { IntlProvider } from "react-intl";
import { ConfigProvider, message } from 'antd';
import { strings } from "res";
import PrivateRoute from "components/PrivateRoute";
import { authenticated, getUserProfile, signOutSuccess } from "redux/features/auth";

export const Views = () => {
  const dispatch = useDispatch()
  const { locale } = useSelector(state => state.theme)
  const currentAppLocale = AppLocale[locale];

  useEffect(() => {
    // Check for token to keep user logged in
    try {
      if (localStorage.getItem('token')) {
        // Set auth token header auth
        const token = localStorage.getItem('token');
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000; // to get in milliseconds
        dispatch(getUserProfile(decoded._id))
          .unwrap()
          .then(response => {
            dispatch(authenticated({ token, user: response.data }))
          })
          .catch((err) =>{
            message.error(err.message)
            localStorage.clear()
            window.location.href = "/auth";
          })
        if (decoded.exp < currentTime) {
          // Logout user
          localStorage.clear()
          dispatch(signOutSuccess())
          // Redirect to login
          window.location.href = "/auth";
        }
      } else {
        localStorage.clear()
        dispatch(signOutSuccess())
      }
    } catch (err) {
      localStorage.clear()
      dispatch(signOutSuccess())
      // Redirect to login
      window.location.href = "/auth";
    }
  }, [dispatch])

  return (
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}>
        <ConfigProvider locale={currentAppLocale.antd}>
          <Switch>
            <PrivateRoute exact path="/">
              <Redirect to={strings.navigation.login} />
            </PrivateRoute>
            <Route path="/auth">
              <AuthLayout />
            </Route>
            <PrivateRoute path="/app">
              <AppLayout />
            </PrivateRoute>
          </Switch>
        </ConfigProvider>
      </IntlProvider>
  )
}

export default withRouter(Views);