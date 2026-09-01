# 💱 Currency.to

A modern, fast, and responsive currency converter application built with React and Vite, providing real-time exchange rates and historical trend charts across devices.

---

## 🚀 Features

* **Instant Currency Conversion:** Real-time exchange rate calculations supporting global currencies.
* **14-Day Historical Charts:** Interactive area charts powered by Recharts showing rate trends over the past two weeks.
* **Seamless Dark Mode:** Automatic system detection and custom theme toggle with synchronized dynamic components.
* **Bidirectional Currency Swap:** One-click instant swap between base and target currencies.
* **Responsive Layout:** Tailored, accessible design for mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React (Vite)
* **Styling:** Tailwind CSS, React Select
* **Data Visualization:** Recharts
* **Language:** JavaScript (ES6+)
* **APIs:** ExchangeRate-API, FrankFurter-API

---

## 📁 Project Structure

```text
currency-converter/
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── HistoricalChart.jsx
│   │   └── theme-toggle.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

---

## 💻 Getting Started

### Prerequisites

Ensure you have Node.js and npm installed:
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* npm

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/karkemo/currency-converter.git
   cd currency-converter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory of the project and add your ExchangeRate API key:
   ```env
   VITE_EXCHANGE_RATE_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📜 License

This project is licensed under the [GPL-3.0](LICENSE) License.