/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-05-09 21:00:03
 * @LastEditTime : 2022-06-08 21:44:46
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-ts\src\index.tsx
 * @Description  :
 */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import "./index.less";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
