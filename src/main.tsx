import { Toaster } from "@/components/ui/sonner";
import { createRoot } from "react-dom/client";
import { QueryProvider, ThemeProvider, ReduxProvider } from "@/context";
import Router from "@/routers/Router";
import "@/style/main.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="theme">
    <ReduxProvider>
      <QueryProvider>
        <Router />
        <Toaster richColors closeButton position="top-right" />
      </QueryProvider>
    </ReduxProvider>
  </ThemeProvider>
);
