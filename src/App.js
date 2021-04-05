import React, {useEffect} from 'react';
import {Switch, Route, withRouter, useHistory} from 'react-router-dom';
import DashboardWallet from "./views/DashboardWallet";
import Homepage from "./views/Homepage";
import DashboardStaking from "./views/Staking";
import PrivateRoute from "./containers/PrivateRoute";
import ImportWallet from "./containers/ImpotWallet";
import KeplerHome from "./views/KeplerHome";
import RouteNotFound from "./components/RouteNotFound";
const version = require('../package.json')
const App = () => {
    const history = useHistory();
    const routes = [{
        path: '/dashboard/wallet',
        component: DashboardWallet,
        private: true,
    }, {
        path: '/dashboard/staking',
        component: DashboardStaking,
        private: true,
    }, {
        path: '/import_wallet',
        component: ImportWallet,
        private: false,
    }, {
        path: '/kepler',
        component: KeplerHome,
        private: false,
    }];
    let address = '';
    console.log(version.version);
    useEffect(() => {
        if(version.version !== "0.1.6"){
            localStorage.clear();
            history.push('/');
        }else {
            address = localStorage.getItem('address')
        }
    }, []);

    return (

        <Switch>
            <Route
                key="/"
                exact
                component={address === undefined || address === null || address === '' ? withRouter(Homepage) : withRouter(DashboardWallet)}
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