import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import App from "./App.tsx";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <AppWrapper>
          <App />
        </AppWrapper>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
