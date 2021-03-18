import React, {  useEffect } from 'react';
import { useLocation, Switch, Route } from 'react-router-dom';
import DashboardWallet from "./views/DashboardWallet";
import Homepage from "./views/Homepage";
import DashboardStaking from "./views/Staking";
const App = () => {
  const routes = [{
    path: '/',
    component: Homepage,
  },{
    path: '/dashboard/wallet',
    component: DashboardWallet,
  },{
    path: '/dashboard/staking',
    component: DashboardStaking,
  }];

  return (

      <Switch>
        {
          routes.map((route) =>
              <Route
                  key={route.path}
                  exact
                  component={route.component}
                  path={route.path}/>,
          )
        }
      </Switch>
  );
};

export default App;