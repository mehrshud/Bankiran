import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, ClipboardCopy, ClipboardPaste, Trash2, RefreshCcw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

// Expanded Bank Database with more banks
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
  const [cardNumbers, setCardNumbers] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [repetitions, setRepetitions] = useState({});
  const [sortedRepetitions, setSortedRepetitions] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Paste functionality
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCardNumbers((prev) => `${prev}\n${text}`.trim());
    } catch (err) {
      console.error('Failed to read clipboard contents:', err);
    }
  };

  // Reset functionality
  const handleReset = () => {
    setCardNumbers('');
    setRepetitions({});
    setSortedRepetitions([]);
    setSearchTerm('');
    setValidationError('');
    setShowButtons(false);
  };

  // Copy functionality
  const handleCopy = async () => {
    try {
      const analysisResults = sortedRepetitions
        .map(([number, data]) => `${number} - ${data.bank.title || data.bank.name}`)
        .join('\n');

      const bankRepetitions = Object.entries(repetitions).reduce((acc, [, data]) => {
        acc[data.bank.name] = (acc[data.bank.name] || 0) + data.count;
        return acc;
      }, {});

      const summary = Object.entries(bankRepetitions)
        .map(([bank, count]) => `${bank}: ${count} time(s)`)
        .join('\n');

      await navigator.clipboard.writeText(`${analysisResults}\nBank Summary:\n${summary}`);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const exportToExcel = () => {
    try {
      const cardNumberData = sortedRepetitions.map(([number, data]) => ({
        'Card Number': number,
        'Bank Name': data.bank.title || data.bank.name,
        'Count': data.count
      }));
  
      const bankSummaryData = Object.entries(bankRepetitions).map(([bank, count]) => ({
        'Bank Name': bank,
        'Total Count': count
      }));
  
      const workbook = XLSX.utils.book_new();
      
      const cardWorksheet = XLSX.utils.json_to_sheet(cardNumberData);
      XLSX.utils.book_append_sheet(workbook, cardWorksheet, "Card Analysis");
  
      const summaryWorksheet = XLSX.utils.json_to_sheet(bankSummaryData);
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Bank Summary");
  
      XLSX.writeFile(workbook, "bank_card_analysis.xlsx");
    } catch (error) {
      console.error('Failed to export to Excel:', error);
    }
  };

  // Luhn Algorithm for card number validation
  const validateCardNumber = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    if (cleanNumber.length < 12 || cleanNumber.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return (sum % 10 === 0);
  };

  const identifyBank = useCallback((cardNumber) => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    const bin = cleanNumber.slice(0, 6);
    const matchedBank = BANK_DATABASE.find(bank => 
      bank.bins.some(bankBin => bin.startsWith(bankBin))
    ) || BANK_DATABASE[BANK_DATABASE.length - 1];
    return matchedBank;
  }, []);

  const analyzeCardNumbers = useCallback(() => {
    setValidationError('');

    // Clean and filter only valid card numbers
    const numbers = cardNumbers
      .split(/[\n,]/)
      .map(num => num.replace(/\D/g, ''))
      .filter(num => num !== '' && num.length >= 12 && num.length <= 19);

    // Check if no valid numbers found
    if (numbers.length === 0) {
      setErrorMessage('No valid card numbers found. Please enter valid card numbers.');
      setShowErrorDialog(true);
      return;
    }

    const invalidNumbers = numbers.filter(num => !validateCardNumber(num));
    if (invalidNumbers.length > 0) {
      setValidationError(`Invalid card numbers: ${invalidNumbers.join(', ')}`);
      return;
    }

    setIsAnalyzing(true);
    const countMap = numbers.reduce((acc, num) => {
      acc[num] = acc[num] || { count: 0, bank: identifyBank(num) };
      acc[num].count += 1;
      return acc;
    }, {});

    setRepetitions(countMap);
    setSortedRepetitions(Object.entries(countMap).sort((a, b) => 
      sortOrder === 'desc' ? b[1].count - a[1].count : a[1].count - b[1].count
    ));

    // Simulate a bit of loading for better UX
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowButtons(true);
    }, 500);
  }, [cardNumbers, identifyBank, sortOrder]);

  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setSortedRepetitions(prev => [...prev].reverse());
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Filtered repetitions based on search term
  const filteredRepetitions = searchTerm
    ? sortedRepetitions.filter(([number]) => 
        number.includes(searchTerm.replace(/\D/g, ''))
      )
    : sortedRepetitions;

  // Bank Repetition Summary
  const bankRepetitions = Object.entries(repetitions).reduce((acc, [, data]) => {
    acc[data.bank.name] = (acc[data.bank.name] || 0) + data.count;
    return acc;
  }, {});

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}
    >
      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <AlertDialogHeader>
            <AlertDialogTitle>Input Error</AlertDialogTitle>
            <AlertDialogDescription className={isDarkMode ? 'text-gray-300' : ''}>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Understood</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <Card 
          className={`shadow-2xl hover:shadow-3xl transition-shadow duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : ''
          }`}
        >
          <CardHeader 
            className={`${
              isDarkMode 
                ? 'bg-gradient-to-r from-gray-700 to-gray-600' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
            } text-white flex justify-between items-center`}
          >
            <CardTitle className="text-2xl font-bold">
              Bank Card Number Analyzer
            </CardTitle>
            <motion.button 
              onClick={toggleDarkMode}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="focus:outline-none"
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </motion.button>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            {/* Top Button Section */}
            <div className="flex flex-wrap gap-4 mb-4 justify-center">
              <Button onClick={analyzeCardNumbers} className="bg-green-500 hover:bg-green-600">
                Analyze
              </Button>
              <Button onClick={handleCopy} className="bg-blue-500 hover:bg-blue-600">
                <ClipboardCopy className="mr-2" /> Copy Results
              </Button>
              <Button onClick={exportToExcel} className="bg-purple-500 hover:bg-purple-600">
                Export to Excel
              </Button>
              <Button onClick={toggleSortOrder} className="bg-gray-500 hover:bg-gray-600">
                Sort: {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
              </Button>
              <Button onClick={handlePaste} className="bg-teal-500 hover:bg-teal-600 flex items-center">
                <ClipboardPaste className="mr-2" /> Paste
              </Button>
              <Button onClick={handleReset} className="bg-red-500 hover:bg-red-600 flex items-center">
                <Trash2 className="mr-2" /> Reset
              </Button>
            </div>

            <textarea 
              className={`w-full min-h-[200px] p-3 border-2 rounded-lg transition duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-blue-200 focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="Enter bank card numbers (one per line or comma-separated)"
              value={cardNumbers}
              onChange={(e) => {
                // Allow only numbers, newlines, and commas
                const sanitizedValue = e.target.value.replace(/[^0-9\n,]/g, '');
                setCardNumbers(sanitizedValue.trimEnd());
                setValidationError('');
              }}
            />

            {validationError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm"
              >
                {validationError}
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Search card numbers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full p-2 border rounded-lg transition ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-blue-200 focus:ring-2 focus:ring-blue-500'
                }`}
              />
            </div>

            <AnimatePresence>
              {Object.keys(repetitions).length > 0 && !isAnalyzing && (
                <motion.div 
                  className={`${
                    isDarkMode 
                      ? 'bg-gray-700 border border-gray-600' 
                      : 'bg-white shadow-md'
                  } rounded-lg p-4 mt-4`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-semibold mb-2">
                    Analysis Results
                  </h2>
                  <ul className="space-y-2">
                    {filteredRepetitions.map(([number, data]) => (
                      <li
                        key={number}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>
                          <strong>{number}</strong> - {data.bank.title || data.bank.name}
                        </span>
                        <span>{data.count} time(s)</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                Analyzing card numbers...
              </motion.div>
            )}

            {Object.keys(bankRepetitions).length > 0 && !isAnalyzing && (
              <motion.div
                className={`${
                  isDarkMode
                    ? 'bg-gray-700 border border-gray-600'
                    : 'bg-white shadow-md'
                } rounded-lg p-4 mt-4`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-semibold mb-2">
                  Bank Summary
                </h2>
                <ul className="space-y-2">
                  {Object.entries(bankRepetitions).map(([bank, count]) => (
                    <li key={bank} className="text-sm">
                      {bank}: {count} time(s)
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between items-center p-4">
            <Button
              onClick={analyzeCardNumbers}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Analyze
            </Button>
            <Button
              onClick={handleCopy}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Copy Results
            </Button>
            <Button
              onClick={exportToExcel}
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
            >
              Export to Excel
            </Button>
            <Button
              onClick={toggleSortOrder}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Sort: {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default BankCardAnalyzer;