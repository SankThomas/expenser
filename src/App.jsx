import { useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import AuthPage from "./components/AuthPage";
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  const { isLoaded } = useUser();
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <Authenticated>
        <Header currentPage={currentPage} onPageChange={setCurrentPage} />

        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "reports" && <Reports />}
        {currentPage === "settings" && <Settings />}
      </Authenticated>

      <Unauthenticated>
        <AuthPage />
      </Unauthenticated>
    </div>
  );
}
