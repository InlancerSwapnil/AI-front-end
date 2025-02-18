import { Link, Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Outlet />
      </div>
      <div className="flex flex-col gap-6">
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our{" "}
          <Link to="/">Terms of Service</Link> and{" "}
          <Link to="/">Privacy Policy</Link>.
        </div>
      </div>
    </main>
  );
}
