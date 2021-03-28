import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import DashboardWallet from "./views/DashboardWallet";
import Homepage from "./views/Homepage";
import DashboardStaking from "./views/Staking";
import PrivateRoute from "./containers/PrivateRoute";
import ImportWallet from "./containers/ImpotWallet";
import KeplerHome from "./views/KeplerHome";
import RouteNotFound from "./components/RouteNotFound";
const App = () => {
  const routes = [{
    path: '/dashboard/wallet',
    component: DashboardWallet,
    private: true,
  },{
    path: '/dashboard/staking',
    component: DashboardStaking,
    private: true,
  },{
    path: '/import_wallet',
    component: ImportWallet,
    private: false,
  },{
    path: '/kepler',
    component: KeplerHome,
    private: false,
  }];
  const address = localStorage.getItem('address');
  return (

      <Switch>
            <Route
                key="/"
                exact
                component={address === undefined || address === '' ? withRouter(Homepage) : withRouter(DashboardWallet)}
                path="/"/> : ""
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
        <Route component={RouteNotFound}/>
      </Switch>
  );
};

export default App;