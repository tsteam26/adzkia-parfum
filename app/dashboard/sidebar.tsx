"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/inventory", label: "Inventori", icon: Package },
  { href: "/dashboard/sales", label: "Kasir (POS)", icon: ShoppingCart },
  { href: "/dashboard/reports", label: "Laporan", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 border-r border-border bg-card/50 backdrop-blur-sm p-6 flex flex-col transition-transform duration-300 lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 lg:hidden"
          onClick={closeMobileMenu}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Logo Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Adzkia Parfum
              </h2>
              <p className="text-xs text-muted-foreground">POS System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2 flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "gradient-primary text-white shadow-lg shadow-purple-500/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                  )}
                />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="mt-auto pt-6 border-t border-border">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200/50 dark:border-purple-800/50">
            <p className="text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1">
              💡 Tips
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-400">
              Gunakan shortcut Ctrl+K untuk pencarian cepat
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Toggle Button - Export this function */}
      <MobileMenuToggle onClick={() => setIsMobileMenuOpen(true)} />
    </>
  );
}

// Mobile Menu Toggle Component
function MobileMenuToggle({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-6 right-6 z-30 lg:hidden w-14 h-14 rounded-full shadow-lg gradient-primary border-0 hover:shadow-xl hover:shadow-purple-500/50"
      onClick={onClick}
    >
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </Button>
  );
}

