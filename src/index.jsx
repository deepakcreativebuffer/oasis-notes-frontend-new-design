/** @format */

import "bootstrap/dist/css/bootstrap.min.css";
import "react-notifications-component/dist/theme.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-quill/dist/quill.snow.css";
import "./index.css";
import "@/assets/styles/Print.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { injectStore } from "@/features/shared/services";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";

injectStore(store);

// Auto-reload the page if a new deployment caused a chunk load error
window.addEventListener("vite:preloadError", (event) => {
  console.warn(
    "Vite preload error caught. Reloading page to fetch new assets...",
  );
  window.location.reload();
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ReactNotifications />
        <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  </Provider>,
);
