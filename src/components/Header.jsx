import { UserButton } from "@clerk/clerk-react";
import { DollarSign, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header({ currentPage, onPageChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    {
      name: "Dashboard",
      id: "dashboard",
    },
    {
      name: "Reports",
      id: "reports",
    },
    {
      name: "Settings",
      id: "settings",
    },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPage]);

  return (
    <header className="border-b border-neutral-800 max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1
            onClick={() => onPageChange("dashboard")}
            className="text-xl font-bold text-white cursor-pointer"
          >
            Expenser
          </h1>

          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              {links.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`transition-colors ${
                    currentPage === item.id
                      ? "text-white underline"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            <UserButton />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-300 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-800">
            <nav className="flex flex-col space-y-4">
              {links.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`transition-colors ${
                    currentPage === item.id
                      ? "text-white underline"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-2">
                <UserButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
