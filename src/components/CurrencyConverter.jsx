import { useState, useEffect } from "react";
import {
  currencies,
  convertCurrency,
  formatCurrency,
} from "../utils/currencies";
import { ArrowRightLeft, Calculator } from "lucide-react";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      const result = convertCurrency(
        parseFloat(amount),
        fromCurrency,
        toCurrency
      );
      setConvertedAmount(result);
    }
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setSearchFrom("");
    setSearchTo("");
  };

  const filteredFromCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchFrom.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchFrom.toLowerCase())
  );

  const filteredToCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchTo.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTo.toLowerCase())
  );

  return (
    <div className="rounded-lg p-6">
      <div className="flex itmes-center mb-6">
        <Calculator className="size-5 text-white mr-2" />
        <h3 className="text-white font-medium">Currency Converter</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-neutral-200 font-medium mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="block text-neutral-200 font-medium mb-2">
            From
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Search currencies..."
            />

            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            >
              {filteredFromCurrencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full transition-colors"
          >
            <ArrowRightLeft className="size-4" />
          </button>
        </div>

        <div>
          <label className="block text-neutral-200 font-medium mb-2">To</label>
          <div className="space-y-2">
            <input
              type="text"
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Search currencies..."
            />

            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            >
              {filteredToCurrencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
          <div className="text-center">
            <p className="text-neutral-300 mb-2">Converted amount</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(convertedAmount, toCurrency)}
            </p>
            <p className="text-neutral-400 text-xs mt-2">
              1 {fromCurrency} ={" "}
              {formatCurrency(
                convertCurrency(1, fromCurrency, toCurrency),
                toCurrency
              )}
            </p>
          </div>
        </div>

        <div className="text-xs text-neutral-400 text-center">
          * Exchange rates are approximate
        </div>
      </div>
    </div>
  );
}
