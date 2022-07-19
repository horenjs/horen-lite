import React from "react";
import ReactDOM from "react-dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import "./index.less";

ReactDOM.render(
  <Provider store={store}>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </Provider>,
  document.getElementById("root")
);
