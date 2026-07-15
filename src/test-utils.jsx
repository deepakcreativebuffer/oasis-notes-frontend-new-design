/** @format */

/**
 * Shared test harness. Import { renderWithProviders, setupStore } from
 * "@/test-utils" in component tests instead of repeating Provider boilerplate.
 *
 * `setupStore` mirrors the real store's reducer map (src/store/store.js) but
 * accepts `preloadedState`, so role-based tests can seed `auth.userProfile`
 * directly instead of dispatching a login.
 */

import React from "react";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ConfigProvider } from "antd";

import chat from "@/store/chatSlice";
import auth from "@/store/authSlice";
import signatureDraft from "@/store/signatureDraftSlice";
import organization from "@/store/organizationSlice";
import facility from "@/store/facilitySlice";
import resident from "@/store/residentSlice";
import employee from "@/store/employeeSlice";
import permissions from "@/store/permissionsSlice";
import ui from "@/store/uiSlice";
import settings from "@/store/settingsSlice";
import notification from "@/store/notificationSlice";

const rootReducer = {
  chat,
  auth,
  signatureDraft,
  organization,
  facility,
  resident,
  employee,
  permissions,
  ui,
  settings,
  notification,
};

export function setupStore(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
}

// Fresh QueryClient with retries off so error-state tests fail fast.
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

export function renderWithProviders(
  ui,
  {
    route = "/",
    preloadedState = {},
    store = setupStore(preloadedState),
    queryClient = makeQueryClient(),
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    return (
      <ConfigProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
          </QueryClientProvider>
        </Provider>
      </ConfigProvider>
    );
  }
  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Re-export RTL so tests have a single import source.
export * from "@testing-library/react";
