"use client";
import { persistor, store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "./ThemeProvider";

const LayoutProviders = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  return (
    <>
      <ThemeProvider>
        <QueryClientProvider client={new QueryClient()}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              {children}
            </PersistGate>
          </Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
};

export default LayoutProviders;
