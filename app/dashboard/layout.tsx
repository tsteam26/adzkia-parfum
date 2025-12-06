import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";
import { Sidebar } from "./sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col w-full lg:w-auto">
        <header className="w-full flex justify-end items-center p-3 md:p-4 border-b gap-3 md:gap-4">
          <Suspense>
            <AuthButton />
          </Suspense>
          <ThemeSwitcher />
        </header>
        <div className="flex-1 p-0 md:p-6 bg-muted/40 pb-20 lg:pb-6">{children}</div>
      </main>
    </div>
  );
}

