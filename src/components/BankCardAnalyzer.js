import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, ClipboardPaste, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Search, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

// Bank database constant
const BANK_DATABASE = [
  { name: 'Markazi', title: 'اداره معاملات ریالی بانک مرکزی', bins: ['636795'] },
  { name: 'Sanat', title: 'بانک صنعت و معدن', bins: ['627961'] },
  { name: 'Mellat', title: 'بانک ملت', bins: ['610433'] },
  { name: 'Refah', title: 'بانک رفاه کارگران', bins: ['589463'] },
  { name: 'Maskan', title: 'بانک مسکن', bins: ['628023'] },
  { name: 'Sepah', title: 'بانک سپه', bins: ['589210'] },
  { name: 'Keshavarzi', title: 'بانک کشاورزی', bins: ['603770'] },
  { name: 'Melli', title: 'بانک ملی ایران', bins: ['603799'] },
  { name: 'Tejarat', title: 'بانک تجارت', bins: ['627353', '585983'] },
  { name: 'Saderat', title: 'بانک صادرات ایران', bins: ['603769'] },
  { name: 'ToseeSaderat', title: 'بانک توسعه صادرات ایران', bins: ['627648'] },
  { name: 'Post', title: 'پست بانک', bins: ['627760'] },
  { name: 'Taavon', title: 'بانک توسعه تعاون', bins: ['502908'] },
  { name: 'Tosee', title: 'موسسه اعتباری توسعه', bins: ['628157'] },
  { name: 'Karafarin', title: 'بانک کارآفرین', bins: ['627488'] },
  { name: 'Parsian', title: 'بانک پارسیان', bins: ['622106'] },
  { name: 'EN', title: 'بانک اقتصاد نوین', bins: ['627412'] },
  { name: 'Saman', title: 'بانک سامان', bins: ['621986'] },
  { name: 'Pasargad', title: 'بانک پاسارگاد', bins: ['502229'] },
  { name: 'Sarmayeh', title: 'بانک سرمایه', bins: ['639607'] },
  { name: 'Sina', title: 'بانک سینا', bins: ['639346'] },
  { name: 'Mehr', title: 'بانک قرضالحسنه مهر ایران', bins: ['606373'] },
  { name: 'Shahr', title: 'بانک شهر', bins: ['504706'] },
  { name: 'Ayandeh', title: 'بانک آینده', bins: ['636214'] },
  { name: 'Ansar', title: 'بانک انصار', bins: ['627381'] },
  { name: 'Tourism', title: 'بانک گردشگری', bins: ['505416'] },
  { name: 'Hekmat', title: 'بانک حکمت ایرانیان', bins: ['636949'] },
  { name: 'Day', title: 'بانک دی', bins: ['502938'] },
  { name: 'IranZamin', title: 'بانک ایران زمین', bins: ['505785'] },
  { name: 'Resalat', title: 'بانک قرض الحسنه رسالت', bins: ['504172'] },
  { name: 'MiddleEast', title: 'بانک خاورمیانه', bins: ['505809', '585947'] },
  { name: 'Ghavamin', title: 'بانک قوامین', bins: ['639599'] },
  { name: 'Kosar', title: 'موسسه مالی و اعتباری کوثر', bins: ['505801'] },
  { name: 'Askariye', title: 'موسسه مالی واعتباری عسگریه', bins: ['606256'] },
  { name: 'Venezuela', title: 'بانک ایران ونزوئلا', bins: ['581874'] },
  { name: 'Noor', title: 'موسسه نور', bins: ['507677'] },
  { name: 'Unknown Bank', title: 'بانک نامشخص', bins: [] }
];

const BankCardAnalyzer = () => {
  // State declarations
  const [inputData, setInputData] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'amount',
    direction: 'desc'
  });

  // Utility functions
  const validateCardNumber = useCallback((cardNumber) => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    if (cleanNumber.length < 12 || cleanNumber.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  }, []);

  const identifyBank = useCallback((cardNumber) => {
    const bin = cardNumber.slice(0, 6);
    return BANK_DATABASE.find(bank => 
      bank.bins.some(bankBin => bin.startsWith(bankBin))
    ) || BANK_DATABASE[BANK_DATABASE.length - 1];
  }, []);

  const extractCardAndAmount = useCallback((line) => {
    // Remove any special characters except digits, dots, and commas
    const cleanLine = line.replace(/[^\d.,\s]/g, ' ').trim();
    
    // Split by any number of spaces
    const parts = cleanLine.split(/\s+/).filter(part => part.length > 0);
    
    if (parts.length === 0) return null;
    
    let cardNumber = null;
    let amount = null;
    
    // Check each part to identify card number and amount
    parts.forEach(part => {
      // If it looks like a card number (12-19 digits)
      if (/^\d{12,19}$/.test(part)) {
        cardNumber = part;
      }
      // If it looks like an amount (numbers with optional decimals)
      else if (/^\d+([.,]\d+)?$/.test(part)) {
        amount = parseFloat(part.replace(',', '.'));
      }
    });
    
    // Return result only if we found at least a card number
    if (cardNumber) {
      return {
        cardNumber,
        amount: amount || 'No price'
      };
    }
    
    return null;
  }, []);

  // Analysis function
  const analyzeData = useCallback(() => {
    const transactionMap = new Map();

    inputData.split('\n').forEach(line => {
      const result = extractCardAndAmount(line);
      if (!result) return;
      
      const { cardNumber, amount } = result;
      
      if (!validateCardNumber(cardNumber)) return;

      if (!transactionMap.has(cardNumber)) {
        transactionMap.set(cardNumber, {
          cardNumber,
          bank: identifyBank(cardNumber),
          amounts: amount === 'No price' ? ['No price'] : [amount],
          repetitionCount: 1,
          totalAmount: amount === 'No price' ? 'No price' : amount
        });
      } else {
        const existing = transactionMap.get(cardNumber);
        existing.amounts.push(amount);
        existing.repetitionCount += 1;
        if (amount !== 'No price') {
          existing.totalAmount = existing.totalAmount === 'No price' ? 
            amount : 
            existing.totalAmount + amount;
        }
      }
    });

    setTransactions(Array.from(transactionMap.values()));
  }, [inputData, identifyBank, validateCardNumber, extractCardAndAmount]);

  // Sorting and filtering
  const sortedTransactions = useMemo(() => {
    const filtered = searchTerm
      ? transactions.filter(t => t.cardNumber.includes(searchTerm.replace(/\D/g, '')))
      : transactions;

    return [...filtered].sort((a, b) => {
      const modifier = sortConfig.direction === 'desc' ? -1 : 1;
      
      if (sortConfig.key === 'amount') {
        if (a.totalAmount === 'No price' && b.totalAmount === 'No price') return 0;
        if (a.totalAmount === 'No price') return 1;
        if (b.totalAmount === 'No price') return -1;
        return modifier * (a.totalAmount - b.totalAmount);
      }
      return modifier * (a.repetitionCount - b.repetitionCount);
    });
  }, [transactions, sortConfig, searchTerm]);

  // Export function
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    const data = sortedTransactions.map(t => ({
      'Card Number': t.cardNumber,
      'Bank': t.bank.title,
      'Total Amount': typeof t.totalAmount === 'number' ? t.totalAmount.toLocaleString() : t.totalAmount,
      'Repetitions': t.repetitionCount,
      'Individual Amounts': t.amounts.join(', ')
    }));

    const sheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, "Analysis");
    XLSX.writeFile(workbook, "bank_analysis.xlsx");
  };

  // UI handlers
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputData((prev) => `${prev}\n${text}`.trim());
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleReset = () => {
    setInputData('');
    setTransactions([]);
    setSearchTerm('');
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: 
        prev.key === key 
          ? prev.direction === 'desc' 
            ? 'asc' 
            : 'desc'
          : 'desc'
    }));
  };

  // Sort indicator component
  const SortIndicator = ({ currentKey, column }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return sortConfig.direction === 'desc' 
      ? <ArrowDown className="w-4 h-4" /> 
      : <ArrowUp className="w-4 h-4" />;
  };
   // Enhanced UI Components
   const ActionButton = ({ onClick, icon: Icon, label, color }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${color} transition-all duration-200 shadow-lg hover:shadow-xl`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </motion.button>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
          <AlertDialogHeader>
            <AlertDialogTitle>Analysis Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Understood</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        <Card className={`shadow-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardHeader className={`${
            isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600'
          } text-white flex justify-between items-center`}>
            <CardTitle>Enhanced Bank Card Analyzer</CardTitle>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="focus:outline-none"
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button onClick={analyzeData} className="bg-green-500 hover:bg-green-600">
                Analyze Data
              </Button>
              <Button onClick={handlePaste} className="bg-teal-500 hover:bg-teal-600">
                <ClipboardPaste className="mr-2" /> Paste
              </Button>
              <Button onClick={exportToExcel} className="bg-amber-500 hover:bg-amber-600">
                Export to Excel
              </Button>
              <Button onClick={handleReset} className="bg-red-500 hover:bg-red-600">
                <Trash2 className="mr-2" /> Reset
              </Button>
            </div>

            <textarea 
              className={`w-full min-h-[200px] p-3 border-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'border-blue-200 focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="Enter card numbers and amounts (one per line, format: CARDNUMBER AMOUNT or AMOUNT CARDNUMBER)"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />

            <input 
              type="text"
              placeholder="Search card numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-2 border rounded-lg ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'border-blue-200 focus:ring-2 focus:ring-blue-500'
              }`}
            />

            {transactions.length > 0 && (
              <div className={`mt-4 p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'
              }`}>
                <h2 className="text-lg font-semibold mb-3">Analysis Results</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 text-left">Card Number</th>
                        <th className="p-2 text-left">Bank</th>
                        <th className="p-2 text-right cursor-pointer group" onClick={() => handleSort('amount')}>
                          <div className="flex items-center justify-end gap-2">
                            Total Amount
                            <SortIndicator currentKey={sortConfig.key} column="amount" />
                          </div>
                        </th>
                        <th className="p-2 text-center cursor-pointer group" onClick={() => handleSort('repetitionCount')}>
                          <div className="flex items-center justify-center gap-2">
                            Repetitions
                            <SortIndicator currentKey={sortConfig.key} column="repetitionCount" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTransactions.map((t, index) => (
                        <tr key={index} className={`border-b ${
                          isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
                        } transition-colors`}>
                          <td className="p-2">{t.cardNumber}</td>
                          <td className="p-2">{t.bank.title}</td>
                          <td className="p-2 text-right">
                            {typeof t.totalAmount === 'number' ? 
                              t.totalAmount.toLocaleString() : 
                              t.totalAmount}
                          </td>
                          <td className="p-2 text-center">{t.repetitionCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className={`px-6 py-3 text-sm ${
            isDarkMode ? 'text-gray-400 border-t border-gray-700' 
                      : 'text-gray-600 border-t'
          }`}>
            <div className="w-full flex justify-between items-center">
              <span>Crafted by Mehrshad</span>
              <span>All rights reserved Capt.Esmaeili</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default BankCardAnalyzer;