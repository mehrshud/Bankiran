# Bank Card Analyzer (BankIran)

A sophisticated React-based tool for analyzing Iranian bank card numbers and transactions with a modern, responsive interface.

## Features

- 🏦 Comprehensive Iranian bank card identification system
- 💳 Card number validation using Luhn algorithm
- 📊 Advanced transaction analysis with sorting, filtering, and "Ideal Mode" scoring
- 📱 Responsive design with dark/light mode support
- 📋 Clipboard integration for easy data input
- 📑 Excel export functionality
- 🔍 Real-time search with advanced filtering (card number, bank, date range, amount)
- 🎨 Modern UI with animations and transitions
- 🏷️ Support for all major Iranian banks
- -🇮🇷 Full Persian language support with RTL layout
- 🖨️ Print functionality and data copying with formatted output
- 📈 Detailed statistics including total transactions, amounts, daily averages, and more

## Getting Started

### Prerequisites

Make sure you have Node.js (v14 or higher) and npm installed on your system.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mehrshud/Bankiran.git
cd Bankiran
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Creates a production build
- `npm run eject` - Ejects from Create React App (one-way operation)

## Usage

1. Input card numbers and amounts in the text area (one entry per line)
2. Click "Analyze Data" or paste from clipboard using the "Paste" button
3. Use the search bar to filter specific card numbers
4. Sort results by amount or repetition count
5. Export analysis results to Excel when needed
6. Toggle between dark and light modes for comfortable viewing

## Technology Stack

- React.js with Hooks
- Tailwind CSS for styling
- Framer Motion for animations
- shadcn/ui components
- XLSX for Excel export functionality
- Lucide React for icons
- react-toastify for elegant notifications

## Enhanced Features from Code

- Ideal Mode Sorting: Combines repetition count, total amount, and days active into a normalized score
- Comprehensive Statistics: Includes daily highs/lows, unique banks, and average transactions
- Advanced Filtering: Filter by card number, bank name, date range, and amount range
- Visual Feedback: Animated loading states, success dialogs, and hover effects
- Persian Typography: Uses IRANSans font with RTL support
  
## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

All rights reserved - Capt.Esmaeili

## Author

Crafted by Mehrshad

## Learn More

For additional information about React and the tools used in this project:
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
