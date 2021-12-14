import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CryptApp from './CryptApp';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './services/redux/Redux';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <CryptApp />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
