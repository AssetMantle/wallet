import React, {  useEffect } from 'react';
import { useLocation, Switch, Route, withRouter } from 'react-router-dom';
import DashboardWallet from "./views/DashboardWallet";
import Homepage from "./views/Homepage";
import DashboardStaking from "./views/Staking";
import PrivateRoute from "./containers/PrivateRoute";
const App = () => {
  const routes = [{
    path: '/',
    component: Homepage,
    private: false,
  },{
    path: '/dashboard/wallet',
    component: DashboardWallet,
    private: true,
  },{
    path: '/dashboard/staking',
    component: DashboardStaking,
    private: true,
  }];

  return (

      <Switch>
        {
          routes.map((route) => {
            if (route.private) {
              return (
                  <PrivateRoute
                      key={route.path}
                      exact
                      component={withRouter(route.component)}
                      path={route.path}
                  />
              );
            }

            return (
                <Route
                    key={route.path}
                    exact
                    component={withRouter(route.component)}
                    path={route.path}/>
            );
          })
        }

      </Switch>
  );
};

export default App;