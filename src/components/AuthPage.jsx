import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { DollarSign, TrendingUp, PieChart, BarChart3 } from "lucide-react";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-neutral-900 to-neutral-800 p-12 flex-col justify-center">
        <div className="max-w-lg">
          <div className="flex items-center mb-8">
            <DollarSign className="size-8 text-white mr-3" />
            <h1 className="text-3xl font-bold text-white">Expenser</h1>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6">
            Take control of your finances
          </h2>
          <p className="text-neutral-300 text-lg mb-12">
            Track expenses, analyze spending patterns, and make informed
            financial decisions with our intuitive dashboard.
          </p>

          <div className="space-y-8">
            <div className="flex items-center">
              <TrendingUp className="size-6 text-white mr-4" />

              <div>
                <h3 className="text-white font-semibold">Real-time Tracking</h3>
                <p className="text-neutral-300">
                  Monitor your expenses as they happen
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <PieChart className="size-6 text-white mr-4" />

              <div>
                <h3 className="text-white font-semibold">Category Analysis</h3>
                <p className="text-neutral-300">
                  Understand where your money goes
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <BarChart3 className="size-6 text-white mr-4" />

              <div>
                <h3 className="text-white font-semibold">Visual Reports</h3>
                <p className="text-neutral-300">
                  Beautiful charts and insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <DollarSign className="size-8 text-white mr-3" />
            <h2 className="text-3xl font-bold text-white">Expenser</h2>
          </div>

          <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
            <div className="flex rounded-lg bg-neutral-900 p-1 mb-8">
              <button
                onClick={() => setIsSignIn(true)}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  isSignIn
                    ? "bg-white text-neutral-900"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                Sign In
              </button>

              <button
                onClick={() => setIsSignIn(false)}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  !isSignIn
                    ? "bg-white text-neutral-900"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div>{isSignIn ? <SignIn /> : <SignUp />}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
