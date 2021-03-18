import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createBrowserHistory } from "history";
import reportWebVitals from './reportWebVitals';
import { Router } from "react-router-dom";
import "../src/assets/scss/index.scss";
import reducer from './reducers/transactions/delegate';
import thunk from 'redux-thunk';
const history = createBrowserHistory();


const store = createStore(
    reducer,
    composeWithDevTools({
        trace: true,
    })(applyMiddleware(thunk)),
);

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
      <Router history={history}>
          <App />
      </Router>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
