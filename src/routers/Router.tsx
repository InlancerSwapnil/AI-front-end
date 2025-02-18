import { BrowserRouter, Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import { AuthGuard } from "@/middleware";

const App = lazy(() => import("@/App"));
const PageNotFound = lazy(() => import("@/pages/PageNotFound"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Chat = lazy(() => import("@/pages/Chat"));

const ChatLayout = lazy(() => import("@/layout/ChatLayout"));
const AuthLayout = lazy(() => import("@/layout/AuthLayout"));

function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route element={<AuthGuard />}>
            <Route path="" element={<ChatLayout />}>
              <Route index element={<App />} />
              <Route path="chat/:ID" element={<Chat />} />
            </Route>
          </Route>
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Login />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function Loader() {
  return (
    <main className="w-full h-dvh flex items-center justify-center">
      <p>Loading...</p>
    </main>
  );
}

export default Router;
