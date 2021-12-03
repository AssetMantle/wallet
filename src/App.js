import React, {useEffect, useState} from 'react';
import {Route, Switch, useHistory, withRouter} from 'react-router-dom';
import DashboardWallet from "./views/DashboardWallet";
import Homepage from "./views/Homepage";
import DashboardStaking from "./views/Staking";
import PrivateRoute from "./containers/PrivateRoute";
import ImportWallet from "./containers/ImportWallet";
import KeplerHome from "./views/Kepler/KeplerHome";
import RouteNotFound from "./components/RouteNotFound";
import config from "./config";
import icon_white from "./assets/images/icon_white.svg";
import {useTranslation} from "react-i18next";
import KeplerWallet from "./utils/kepler";
import {useDispatch} from "react-redux";
import {fetchDelegationsCount} from "./store/actions/delegations";
import {fetchBalance, fetchTransferableVestingAmount} from "./store/actions/balance";
import {fetchRewards, fetchTotalRewards} from "./store/actions/rewards";
import {fetchUnbondDelegations} from "./store/actions/unbond";
import {fetchTokenPrice} from "./store/actions/tokenPrice";
import {fetchValidators} from "./store/actions/validators";
import transactions from "./utils/transactions";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

const SENTRY_API = process.env.REACT_APP_SENTRY_API;
const App = () => {
    const {t} = useTranslation();
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
        path: '/keplr',
        component: KeplerHome,
        private: false,
    }];
    const [isOnline, setNetwork] = useState(window.navigator.onLine);
    const updateNetwork = () => {
        setNetwork(window.navigator.onLine);
    };

    const dispatch = useDispatch();

    let address;
    const version = localStorage.getItem('version');
    if (version == null || config.version !== version) {
        localStorage.clear();
        history.push('/');
    } else {
        address = localStorage.getItem('address');
    }

    useEffect(() => {
        const fetchApi = async () => {
            if (address !== null && address !== undefined ) {
                dispatch(fetchDelegationsCount(address));
                dispatch(fetchBalance(address));
                dispatch(fetchRewards(address));
                dispatch(fetchTotalRewards(address));
                dispatch(fetchUnbondDelegations(address));
                dispatch(fetchTokenPrice());
                dispatch(fetchTransferableVestingAmount(address));
                dispatch(fetchValidators(address));
                transactions.updateFee(address);
                setInterval(() => dispatch(fetchTotalRewards(address)), 10000);
            }
        };
        fetchApi();
    }, []);
    useEffect(() => {
        window.addEventListener("offline", updateNetwork);
        window.addEventListener("online", updateNetwork);
        return () => {
            window.removeEventListener("offline", updateNetwork);
            window.removeEventListener("online", updateNetwork);
        };
    });
    window.addEventListener("keplr_keystorechange", () => {
        if (localStorage.getItem('loginMode') === 'kepler') {
            const kepler = KeplerWallet();
            kepler.then(function () {
                const address = localStorage.getItem("keplerAddress");
                localStorage.setItem('address', address);
                window.location.reload();
            }).catch(error => {
                Sentry.captureException(error.response
                    ? error.response.data.message
                    : error.message);
                console.log(error.message);
            });
        }
    });

    Sentry.init({
        dsn: SENTRY_API,
        integrations: [new Integrations.BrowserTracing()],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
    return (
        <>
            {
                !isOnline ?
                    <div className="network-check">
                        <div className="stage">
                            <div className="bouncer-holder">
                                <div className="bouncer">
                                    <img src={icon_white} className="icon-white" alt="icon_white"/>
                                </div>
                            </div>
                            <h3 className="text-left">{t("NO_INTERNET")}</h3>
                            <p>Try:</p>
                            <ul>
                                <li>{t("NO_INTERNET_NOTE1")}</li>
                                <li>{t("NO_INTERNET_NOTE2")}</li>
                            </ul>
                        </div>
                    </div>
                    : ""
            }
            <Switch>
                <Route
                    key="/"
                    exact
                    component={address === undefined || address === null || address === '' ? withRouter(Homepage) : withRouter(DashboardWallet)}
                    path="/"/>
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
        </>
    );
};
export default App;
