import { useState, useEffect } from 'react';
import ThemeToggle from './components/theme-toggle';
import Select from 'react-select';
import HistoricalChart from './components/HistoricalChart';

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EGP');
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [rates, setRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchCurrencyCodes() {
      try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/codes`);
        const data = await res.json();
        if (data.result === 'success') {
          const options = data.supported_codes.map(([code, name]) => ({
            value: code,
            label: `${code} - ${name}`
          }));
          setCurrencyOptions(options);
        }
      } catch (error) {
        console.error('Error fetching codes:', error);
      }
    }
    fetchCurrencyCodes();
  }, [API_KEY]);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`);
        const data = await res.json();
        if (data.result === 'success') {
          setRates(data.conversion_rates);
        }
      } catch (error) {
        console.error('Error fetching rates:', error);
      }
    }
    if (fromCurrency) fetchRates();
  }, [fromCurrency, API_KEY]);

  useEffect(() => {
    if (rates[toCurrency]) {
      const result = (amount * rates[toCurrency]).toFixed(2);
      setConvertedAmount(result);
    }
  }, [amount, toCurrency, rates]);

  // Swap currencies handler
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const SelectStyles = {
    control: (base, state) => ({
      ...base,
      height: '48px',
      backgroundColor: isDark ? '#02012b' : '#ffffff',
      borderColor: state.isFocused
        ? '#3b82f6'
        : isDark
          ? 'rgba(255, 255, 255, 0.2)'
          : '#e2e8f0',
      borderRadius: '0.5rem',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: state.isFocused
          ? '#3b82f6'
          : isDark
            ? 'rgba(255, 255, 255, 0.4)'
            : '#cbd5e1',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? '#ffffff' : '#0f172a',
      fontWeight: '600',
      fontSize: '0.95rem',
    }),
    input: (base) => ({
      ...base,
      color: isDark ? '#ffffff' : '#0f172a',
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? '#94a3b8' : '#94a3b8',
      fontSize: '0.9rem',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? '#0b0a3a' : '#ffffff',
      borderRadius: '0.75rem',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #e2e8f0',
      boxShadow: isDark
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      zIndex: 50,
      padding: '4px',
    }),
    menuList: (base) => ({
      ...base,
      padding: '4px',
      maxHeight: '220px',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : '#cbd5e1',
        borderRadius: '3px',
      },
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: '0.375rem',
      margin: '2px 0',
      padding: '8px 12px',
      fontWeight: '500',
      fontSize: '0.9rem',
      backgroundColor: state.isSelected
        ? '#2563eb'
        : state.isFocused
          ? isDark
            ? 'rgba(255, 255, 255, 0.1)'
            : '#f1f5f9'
          : 'transparent',
      color: state.isSelected ? '#ffffff' : isDark ? '#e2e8f0' : '#0f172a',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#1d4ed8',
      },
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: isDark ? '#94a3b8' : '#64748b',
      transition: 'transform 0.2s ease, color 0.2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      '&:hover': {
        color: isDark ? '#ffffff' : '#0f172a',
      },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
  };

  return (
    <div className="transition-colors w-full min-h-screen dark:bg-[#02012b] bg-slate-100 text-slate-900 dark:text-white flex flex-col items-center">

      {/* navbar */}
      <nav className="w-full max-w-6xl py-5 px-6 flex flex-row items-center justify-between border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="h-10 w-auto" />
          <p className="text-black dark:text-white font-extrabold text-2xl tracking-tight">Currency.to</p>
        </div>
        <ThemeToggle />
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-4 py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            Exchange Rates & Currency Conversion
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm sm:text-base">
            Live calculations and historical exchange trends for world currencies
          </p>
        </div>

        {/* Converter Card */}
        <div className="w-full bg-white dark:bg-[#0b0a3a]/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-white/10 transition-colors">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* from field group */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Amount & Base Currency
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-[#02012b] text-slate-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <Select
                options={currencyOptions}
                value={currencyOptions.find((opt) => opt.value === fromCurrency) || null}
                onChange={(option) => setFromCurrency(option ? option.value : '')}
                isSearchable={true}
                placeholder="Search base..."
                styles={SelectStyles}
              />
            </div>

            {/* swap btn */}
            <div className="flex items-center justify-center pt-5">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap Currencies"
                className="cursor-pointer p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300 dark:border-white/15 text-slate-700 dark:text-white transition-all transform hover:scale-105 active:scale-95 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>

            {/* to field group */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Converted Result
              </label>
              <input
                type="text"
                readOnly
                value={convertedAmount}
                className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-[#02012b]/60 text-blue-600 dark:text-emerald-400 font-extrabold text-lg focus:outline-none transition-colors"
              />
              <Select
                options={currencyOptions}
                value={currencyOptions.find((opt) => opt.value === toCurrency) || null}
                onChange={(option) => setToCurrency(option ? option.value : '')}
                isSearchable={true}
                placeholder="Search target..."
                styles={SelectStyles}
              />
            </div>

          </div>

          {/* Historical Chart Container */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 flex w-full items-center justify-center">
            <HistoricalChart fromCurrency={fromCurrency} toCurrency={toCurrency} isDark={isDark} />
          </div>

        </div>

      </main>
    </div>
  );
}

export default App;