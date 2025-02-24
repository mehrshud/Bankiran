import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BarChart2, X } from 'lucide-react';
import { Moon, Sun, ClipboardPaste, Trash2, createIcons,ArrowUpDown, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { Copy, Printer, RefreshCcw } from 'lucide-react';

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

const persianLabels = {
  title: 'تحلیل‌گر کارت بانکی',
  analyze: 'تحلیل داده‌ها',
  paste: 'چسباندن',
  export: 'خروجی اکسل',
  reset: 'پاک کردن',
  cardNumber: 'شماره کارت',
  bank: 'نام بانک',
  totalAmount: 'مجموع مبلغ',
  repetitions: 'تعداد تکرار',
  daysCount: 'تعداد روزها',
  dates: 'تاریخ‌ها',
  searchPlaceholder: 'جستجوی شماره کارت...',
  textareaPlaceholder: 'شماره کارت و مبلغ و تاریخ را وارد کنید (هر مورد در یک خط)',
  analyzing: 'در حال تحلیل...',
  processingData: 'در حال پردازش داده‌های شما...',
  analysisComplete: 'تحلیل تکمیل شد!',
  cardsAnalyzed: 'کارت‌های منحصر به فرد تحلیل شده',
  great: 'عالی!',
  copySuccess: 'اطلاعات با موفقیت کپی شد',
  copyError: 'خطا در کپی کردن اطلاعات',
  filterPlaceholder: 'فیلتر بر اساس مبلغ...',
  noData: 'داده‌ای برای نمایش وجود ندارد',
  print: 'پرینت',
  share: 'اشتراک‌گذاری',
  downloadPDF: 'دانلود PDF',
  copyData: 'کپی اطلاعات',
  refresh: 'بازنشانی فیلترها',
  amountRange: 'محدوده مبلغ',
  from: 'از',
  to: 'تا',
  totalTransactions: 'تعداد کل تراکنش‌ها',
  totalAmount: 'مجموع کل مبالغ',
  averageAmount: 'میانگین مبالغ'
};

const persianFontStyle = {
  fontFamily: "'IRANSans', 'IRANSansWeb', 'Tahoma', sans-serif",
  direction: 'rtl'
};

const BankCardAnalyzer = () => {
  const [inputData, setInputData] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };
  const QuickActionsMenu = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 flex gap-3"
    >
      <Button
        onClick={analyzeData}
        className="rounded-full w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 transition-transform"
      >
        <BarChart2 className="w-6 h-6" />
      </Button>
      <Button
        onClick={handlePaste}
        className="rounded-full w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transition-transform"
      >
        <ClipboardPaste className="w-6 h-6" />
      </Button>
      <Button
        onClick={toggleTheme}
        className="rounded-full w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:scale-105 transition-transform"
      >
        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </Button>
    </motion.div>
  );

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'cardNumber', direction: 'asc' });
  const [amountFilter, setAmountFilter] = useState({ min: '', max: '' });
  const [searchFilters, setSearchFilters] = useState({
    cardNumber: '',
    bankName: '',
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' },
    transactionCount: { min: '', max: '' }
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('table');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedCards, setSelectedCards] = useState(new Set());

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ریال';
  };
 // Styles for dark/light mode
 const colorScheme = {
  bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50 text-black',
  card: isDarkMode ? 'bg-gray-800' : 'bg-white',
  text: isDarkMode ? 'text-gray-200' : 'text-gray-800',
  input: isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200',
  hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
  button: isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600',
  accent: isDarkMode ? 'text-purple-400' : 'text-purple-600'
};
const statistics = useMemo(() => {
  if (!transactions.length) return null;
  
  const validAmounts = transactions.filter(t => typeof t.totalAmount === 'number').map(t => t.totalAmount);
  const uniqueBanks = new Set(transactions.map(t => t.bank.name));
  const totalDays = new Set(transactions.flatMap(t => t.uniqueDates)).size;
  
  // Calculate daily statistics
  const transactionsByDate = transactions.flatMap(t => 
    t.uniqueDates.map(date => ({ date, amount: t.totalAmount }))
  );
  const dailyAmounts = transactionsByDate.reduce((acc, curr) => {
    if (typeof curr.amount === 'number') {
      acc[curr.date] = (acc[curr.date] || 0) + curr.amount;
    }
    return acc;
  }, {});
  
  const dailyAmountValues = Object.values(dailyAmounts);
  const maxDailyAmount = Math.max(...dailyAmountValues);
  const minDailyAmount = Math.min(...dailyAmountValues);
  const avgDailyAmount = dailyAmountValues.reduce((a, b) => a + b, 0) / dailyAmountValues.length;

  return {
    totalTransactions: transactions.reduce((sum, t) => sum + t.repetitionCount, 0),
    totalAmount: validAmounts.reduce((sum, amount) => sum + amount, 0),
    averageAmount: validAmounts.length ? validAmounts.reduce((sum, amount) => sum + amount, 0) / validAmounts.length : 0,
    uniqueCards: transactions.length,
    uniqueBanksCount: uniqueBanks.size,
    totalDays: totalDays,
    maxDailyAmount: maxDailyAmount,
    minDailyAmount: minDailyAmount,
    averageDailyAmount: avgDailyAmount,
    highestTransaction: Math.max(...validAmounts),
    lowestTransaction: Math.min(...validAmounts),
    averageTransactionsPerDay: transactions.reduce((sum, t) => sum + t.repetitionCount, 0) / totalDays,
    mostActiveBank: [...uniqueBanks].reduce((max, bank) => {
      const count = transactions.filter(t => t.bank.name === bank).length;
      return count > max.count ? { bank, count } : max;
    }, { bank: '', count: 0 }).bank
  };
}, [transactions]);

 // Update filteredAndSortedTransactions to handle ideal mode
const filteredAndSortedTransactions = useMemo(() => {
  let filtered = [...transactions];

  // Apply existing filters
  if (amountFilter.min || amountFilter.max) {
    filtered = filtered.filter((t) => {
      if (typeof t.totalAmount !== 'number') return false;
      const min = amountFilter.min ? parseFloat(amountFilter.min) : -Infinity;
      const max = amountFilter.max ? parseFloat(amountFilter.max) : Infinity;
      return t.totalAmount >= min && t.totalAmount <= max;
    });
  }
  if (searchTerm) {
    filtered = filtered.filter(
      (t) => t.cardNumber.includes(searchTerm.replace(/\D/g, '')) || t.bank.title.includes(searchTerm)
    );
  }

  // Sort logic
  if (sortConfig.idealMode) {
    // Calculate max values for normalization
    const maxRepetitions = Math.max(...filtered.map(t => t.repetitionCount));
    const maxAmount = Math.max(...filtered.map(t => typeof t.totalAmount === 'number' ? t.totalAmount : 0));
    const maxDays = Math.max(...filtered.map(t => t.daysCount));

    return filtered.sort((a, b) => {
      const aRepNorm = a.repetitionCount / maxRepetitions;
      const bRepNorm = b.repetitionCount / maxRepetitions;
      const aAmtNorm = (typeof a.totalAmount === 'number' ? a.totalAmount : 0) / maxAmount;
      const bAmtNorm = (typeof b.totalAmount === 'number' ? b.totalAmount : 0) / maxAmount;
      const aDaysNorm = a.daysCount / maxDays;
      const bDaysNorm = b.daysCount / maxDays;

      // Higher score = higher repetitions + amount, lower days
      const aScore = aRepNorm + aAmtNorm - aDaysNorm;
      const bScore = bRepNorm + bAmtNorm - bDaysNorm;

      return sortConfig.direction === 'desc' ? bScore - aScore : aScore - bScore;
    });
  }

  return filtered.sort((a, b) => {
    const modifier = sortConfig.direction === 'asc' ? 1 : -1;
    switch (sortConfig.key) {
      case 'cardNumber':
        return modifier * a.cardNumber.localeCompare(b.cardNumber);
      case 'amount':
        if (a.totalAmount === 'No price' && b.totalAmount === 'No price') return 0;
        if (a.totalAmount === 'No price') return 1;
        if (b.totalAmount === 'No price') return -1;
        return modifier * (a.totalAmount - b.totalAmount);
      case 'repetitions':
        return modifier * (a.repetitionCount - b.repetitionCount);
      case 'days':
        return modifier * (a.daysCount - b.daysCount);
      default:
        return 0;
    }
  });
}, [transactions, sortConfig, searchTerm, amountFilter]);
  const copyFormattedData = async () => {
    try {
      const formattedData = filteredAndSortedTransactions
        .map(
          (t) =>
            `شماره کارت: ${t.cardNumber}\n` +
            `بانک: ${t.bank.title}\n` +
            `مجموع مبلغ: ${
              typeof t.totalAmount === 'number' ? formatNumber(t.totalAmount) : t.totalAmount
            }\n` +
            `تعداد تراکنش: ${t.repetitionCount}\n` +
            `تعداد روزها: ${t.daysCount}\n` +
            `تاریخ‌ها: ${t.uniqueDates.join(', ')}\n` +
            '-------------------'
        )
        .join('\n');
      await navigator.clipboard.writeText(formattedData);
      toast({
        title: persianLabels.copySuccess,
        duration: 2000
      });
    } catch (err) {
      toast({
        title: persianLabels.copyError,
        variant: 'destructive',
        duration: 2000
      });
    }
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const resetFilters = () => {
    setAmountFilter({ min: '', max: '' });
    setSearchTerm('');
    setSortConfig({ key: 'cardNumber', direction: 'asc' });
  };

  const validateCardNumber = useCallback((cardNumber) => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 16) return false;
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
    return (
      BANK_DATABASE.find((bank) => bank.bins.some((bankBin) => bin.startsWith(bankBin))) ||
      BANK_DATABASE[BANK_DATABASE.length - 1]
    );
  }, []);

  const extractCardAmountAndDate = useCallback((line) => {
    // Clean the line: remove invisible characters, normalize spaces
    const cleanLine = line
      .trim()
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/[ـ]/g, ''); // Remove Persian kashida if present
  
    if (!cleanLine) return null;
  
    let cardNumber = null;
    let amount = null;
    let date = null;
  
    // Split by spaces
    const parts = cleanLine.split(/\s+/);
  
    // Regular expressions for detection
    const cardNumberRegex = /^\d{16}$/; // 16-digit card number
    const persianDateRegex = /^\d{4}\/\d{2}\/\d{2}$/; // e.g., 1403/11/05
    const amountRegex = /^\d+(?:,\d{3})*(?:\.\d+)?$/; // e.g., 1,000,000 or 1000
  
    // Identify components
    parts.forEach((part) => {
      const cleanPart = part.replace(/[^\d\/]/g, ''); // Remove non-digits except slashes for dates
  
      // Card number: must be 16 digits
      if (cardNumberRegex.test(cleanPart)) {
        cardNumber = cleanPart;
      }
      // Date: must match Persian date format
      else if (persianDateRegex.test(part)) {
        date = part;
      }
      // Amount: must be a valid number (allowing commas)
      else if (amountRegex.test(part)) {
        amount = parseInt(part.replace(/,/g, ''), 10);
      }
    });
  
    // Additional logic to handle cases where order might differ
    if (!cardNumber) {
      // Look for the last 16-digit sequence in the line
      const digitsOnly = cleanLine.replace(/\D/g, '');
      if (digitsOnly.length >= 16) {
        cardNumber = digitsOnly.slice(-16); // Take the last 16 digits
      }
    }
  
    // Validation
    if (!cardNumber || !validateCardNumber(cardNumber)) {
      return null; // Invalid or missing card number
    }
    if (!date || !persianDateRegex.test(date)) {
      date = 'Unknown'; // Default if date is missing or invalid
    }
    if (amount === null || isNaN(amount)) {
      amount = 0; // Default to 0 if no amount is found, instead of skipping
    }
  
    return { cardNumber, amount, date };
  }, [validateCardNumber]);
  

  const analyzeData = useCallback(async () => {
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const transactionMap = new Map();
    inputData.split('\n').forEach((line) => {
      const result = extractCardAmountAndDate(line);
      if (!result) return;
      const { cardNumber, amount, date } = result;
      if (!validateCardNumber(cardNumber)) return;
      if (!transactionMap.has(cardNumber)) {
        transactionMap.set(cardNumber, {
          cardNumber,
          bank: identifyBank(cardNumber),
          transactions: [{ amount, date }],
          uniqueDates: new Set([date]),
          repetitionCount: 1,
          totalAmount: amount === 'No price' ? 'No price' : amount
        });
      } else {
        const existing = transactionMap.get(cardNumber);
        existing.transactions.push({ amount, date });
        existing.uniqueDates.add(date);
        existing.repetitionCount += 1;
        if (amount !== 'No price') {
          existing.totalAmount =
            existing.totalAmount === 'No price' ? amount : existing.totalAmount + amount;
        }
      }
    });
    const processedTransactions = Array.from(transactionMap.values()).map((t) => ({
      ...t,
      daysCount: t.uniqueDates.size,
      uniqueDates: Array.from(t.uniqueDates)
    }));
    setTransactions(processedTransactions);
    setIsAnalyzing(false);
    setShowSuccessDialog(true);
  }, [inputData, identifyBank, validateCardNumber, extractCardAmountAndDate]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputData((prev) => `${prev}\n${text}`.trim());
    } catch (err) {
      setErrorMessage('خطا در خواندن کلیپ‌بورد');
      setShowErrorDialog(true);
    }
  };

  const handleReset = () => {
    setInputData('');
    setTransactions([]);
    setSearchTerm('');
  };

// New sorting function including ideal mode
const handleSort = (key) => {
  if (key === 'idealMode') {
    setSortConfig({
      key: 'idealMode',
      direction: 'desc', // Always sort descending for ideal mode
      idealMode: true
    });
  } else {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
      idealMode: false
    });
  }
};

  const sortedTransactions = useMemo(() => {
    const filtered = searchTerm
      ? transactions.filter((t) => t.cardNumber.includes(searchTerm.replace(/\D/g, '')))
      : transactions;
    return [...filtered].sort((a, b) => {
      const modifier = sortConfig.direction === 'asc' ? 1 : -1;
      switch (sortConfig.key) {
        case 'cardNumber':
          return modifier * a.cardNumber.localeCompare(b.cardNumber);
        case 'amount':
          if (a.totalAmount === 'No price' && b.totalAmount === 'No price') return 0;
          if (a.totalAmount === 'No price') return 1;
          if (b.totalAmount === 'No price') return -1;
          return modifier * (a.totalAmount - b.totalAmount);
        case 'repetitions':
          return modifier * (a.repetitionCount - b.repetitionCount);
        case 'days':
          return modifier * (a.daysCount - b.daysCount);
        default:
          return 0;
      }
    });
  }, [transactions, sortConfig, searchTerm]);

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const data = sortedTransactions.map((t, index) => ({
      ردیف: index + 1,
      'شماره کارت': t.cardNumber,
      'تعداد تراکنش‌ها': t.repetitionCount,
      'تعداد روزهای فعالیت': t.daysCount,
      'مجموع مبلغ': typeof t.totalAmount === 'number' ? t.totalAmount : 0
    }));
    const sheet = XLSX.utils.json_to_sheet(data, {
      header: ['ردیف', 'شماره کارت', 'تعداد تراکنش‌ها', 'تعداد روزهای فعالیت', 'مجموع مبلغ']
    });
    const colWidths = [{ wch: 8 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
    sheet['!cols'] = colWidths;
    const range = XLSX.utils.decode_range(sheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!sheet[cellRef]) continue;
        if (!sheet[cellRef].s) sheet[cellRef].s = {};
        sheet[cellRef].s = {
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          },
          font: {
            name: 'B Nazanin',
            sz: 11
          }
        };
      }
    }
    sheet['!dir'] = 'rtl';
    XLSX.utils.book_append_sheet(workbook, sheet, 'Analysis');
    XLSX.writeFile(workbook, 'bank_analysis.xlsx');
  };

  const SearchBar = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
      <div
        className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 rounded-xl p-3 shadow-md 
                   hover:shadow-xl transition-shadow"
      >
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="جستجوی پیشرفته..."
          className="w-full bg-transparent border-none focus:ring-0 text-sm"
          onChange={(e) =>
            setSearchFilters((prev) => ({
              ...prev,
              cardNumber: e.target.value
            }))
          }
          onFocus={() => setShowSearchSuggestions(true)}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters((prev) => !prev)}
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute w-full mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-10"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold">نام بانک</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 rounded-md border 
                             dark:bg-gray-700 text-sm focus:outline-none"
                  onChange={(e) =>
                    setSearchFilters((prev) => ({ ...prev, bankName: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold">محدوده تاریخ</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-full mt-1 p-2 rounded-md border dark:bg-gray-700 text-sm"
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))
                    }
                  />
                  <input
                    type="date"
                    className="w-full mt-1 p-2 rounded-md border dark:bg-gray-700 text-sm"
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesCardNumber = transaction.cardNumber.includes(searchFilters.cardNumber);
      const matchesBankName = transaction.bank.title
        .toLowerCase()
        .includes(searchFilters.bankName.toLowerCase());
      const amount = typeof transaction.totalAmount === 'number' ? transaction.totalAmount : 0;
      const matchesAmount =
        (!searchFilters.amountRange.min || amount >= parseFloat(searchFilters.amountRange.min)) &&
        (!searchFilters.amountRange.max || amount <= parseFloat(searchFilters.amountRange.max));
      const matchesTransactionCount =
        (!searchFilters.transactionCount.min ||
          transaction.repetitionCount >= parseInt(searchFilters.transactionCount.min)) &&
        (!searchFilters.transactionCount.max ||
          transaction.repetitionCount <= parseInt(searchFilters.transactionCount.max));
      const matchesDateRange =
        !searchFilters.dateRange.start ||
        !searchFilters.dateRange.end ||
        transaction.uniqueDates.some((date) => {
          return date >= searchFilters.dateRange.start && date <= searchFilters.dateRange.end;
        });
      return (
        matchesCardNumber && matchesBankName && matchesAmount && matchesTransactionCount && matchesDateRange
      );
    });
  }, [transactions, searchFilters]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 md:p-8 transition-all duration-300 ${
        isDarkMode
          ? 'bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900'
          : 'bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-rose-100 via-purple-100 to-slate-100'
      }`}
      style={persianFontStyle}
    >
       {/* Loading Dialog */}
       <AlertDialog open={isAnalyzing}>
        <AlertDialogContent className="bg-gradient-to-br from-violet-500 to-purple-500 border-0 text-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <Calendar className="w-full h-full" />
          </motion.div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-center">
              {persianLabels.analyzing}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-100 text-center">
              {persianLabels.processingData}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent
          className="bg-red-500 text-white rounded-xl shadow-2xl"
          style={persianFontStyle}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">خطا</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-100">{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowErrorDialog(false)}
              className="bg-white text-red-600 hover:scale-105 transition-transform"
            >
              باشه
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent
          className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-2xl"
          style={persianFontStyle}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold mb-2">
                {persianLabels.analysisComplete}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-100 text-sm">
                {transactions.length} {persianLabels.cardsAnalyzed}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="bg-white text-green-600 hover:scale-105 transition-transform py-2 px-4 rounded-md">
                {persianLabels.great}
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl"
      >
          <Card className="backdrop-blur-xl border-0 shadow-2xl overflow-hidden rounded-3xl">
          <CardHeader className="relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 opacity-90"></div>
            <div className="relative flex justify-between items-center z-10">
              <CardTitle className="text-2xl font-bold text-white">
                {persianLabels.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-white hover:bg-white/20"
              >
                {isDarkMode ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              <Button
                onClick={analyzeData}
                className="bg-green-500 hover:bg-green-600 transition-transform hover:-translate-y-0.5 rounded-lg"
              >
                {persianLabels.analyze}
              </Button>
              <Button
                onClick={handlePaste}
                className="bg-teal-500 hover:bg-teal-600 transition-transform hover:-translate-y-0.5 rounded-lg flex items-center gap-2"
              >
                <ClipboardPaste className="w-5 h-5" />
                {persianLabels.paste}
              </Button>
              <Button
                onClick={exportToExcel}
                className="bg-amber-500 hover:bg-amber-600 transition-transform hover:-translate-y-0.5 rounded-lg"
              >
                <createIcons className="w-5 h-5" />
                {persianLabels.export}
              </Button>
              <Button
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-600 transition-transform hover:-translate-y-0.5 rounded-lg flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                {persianLabels.reset}
              </Button>
              <Button
                onClick={copyFormattedData}
                className="bg-purple-500 hover:bg-purple-600 transition-transform hover:-translate-y-0.5 rounded-lg flex items-center gap-2"
              >
                <Copy className="w-5 h-5" />
                {persianLabels.copyData}
              </Button>
              <Button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-600 transition-transform hover:-translate-y-0.5 rounded-lg flex items-center gap-2"
              >
                <Printer className="w-5 h-5" />
                {persianLabels.print}
              </Button>
              
            </div>

            <textarea
              className={`w-full min-h-[200px] p-4 rounded-xl border-2 focus:ring-2 transition-all duration-300
                ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white focus:ring-violet-400'
                    : 'bg-white text-black border-violet-200 focus:ring-violet-500'
                }`}
              placeholder={persianLabels.textareaPlaceholder}
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              style={persianFontStyle}
            />

            {/* Statistics Cards */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    label: 'تعداد کل تراکنش‌ها',
                    value: statistics.totalTransactions.toLocaleString()
                  },
                  {
                    label: 'مجموع کل مبالغ',
                    value: formatNumber(statistics.totalAmount)
                  },
                  {
                    label: 'میانگین مبلغ تراکنش',
                    value: formatNumber(Math.round(statistics.averageAmount))
                  },
                  {
                    label: 'تعداد کارت‌های منحصر به فرد',
                    value: statistics.uniqueCards.toLocaleString()
                  },
                  {
                    label: 'تعداد بانک‌های درگیر',
                    value: statistics.uniqueBanksCount.toLocaleString()
                  },
                  {
                    label: 'بازه زمانی (روز)',
                    value: statistics.totalDays.toLocaleString()
                  },
                  {
                    label: 'بیشترین تراکنش روزانه',
                    value: formatNumber(statistics.maxDailyAmount)
                  },
                  {
                    label: 'کمترین تراکنش روزانه',
                    value: formatNumber(statistics.minDailyAmount)
                  },
                  {
                    label: 'میانگین تراکنش روزانه',
                    value: formatNumber(Math.round(statistics.averageDailyAmount))
                  },
                  {
                    label: 'بیشترین مبلغ تراکنش',
                    value: formatNumber(statistics.highestTransaction)
                  },
                  {
                    label: 'کمترین مبلغ تراکنش',
                    value: formatNumber(statistics.lowestTransaction)
                  },
                  {
                    label: 'میانگین تعداد تراکنش روزانه',
                    value: Math.round(statistics.averageTransactionsPerDay).toLocaleString()
                  }
                  // ... other stats
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-2xl ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white text-black'
                    } shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </div>
                    <div className="text-2xl font-bold mt-1">{stat.value}</div>
                  </motion.div>
                ))}
              </div>
            )}

              {/* Table Section */}
              {transactions.length > 0 && (
              <div className={`rounded-xl overflow-hidden shadow-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white text-black'
              }`}>
                <div className="overflow-x-auto">
                <table className="w-full">
                <thead>
  <tr className="border-b border-gray-200 dark:border-gray-700">
    <th className="p-2 text-right">
      <button
        onClick={() => handleSort('cardNumber')}
        className="flex items-center gap-1 w-full justify-end hover:text-blue-500 transition-colors"
      >
        {persianLabels.cardNumber}
        <ArrowUpDown className="w-4 h-4" />
      </button>
    </th>
    <th className="p-2 text-right">{persianLabels.bank}</th>
    <th className="p-2 text-left">
      <button
        onClick={() => handleSort('amount')}
        className="flex items-center gap-1 w-full justify-end hover:text-blue-500 transition-colors"
      >
        مبلغ تراکنش (ریال)
        <ArrowUpDown className="w-4 h-4" />
      </button>
    </th>
    <th className="p-2 text-center">
      <button
        onClick={() => handleSort('repetitions')}
        className="flex items-center gap-1 w-full justify-center hover:text-blue-500 transition-colors"
      >
        {persianLabels.repetitions}
        <ArrowUpDown className="w-4 h-4" />
      </button>
    </th>
    <th className="p-2 text-center">
      <button
        onClick={() => handleSort('days')}
        className="flex items-center gap-1 w-full justify-center hover:text-blue-500 transition-colors"
      >
        {persianLabels.daysCount}
        <ArrowUpDown className="w-4 h-4" />
      </button>
    </th>
    <th className="p-2 text-center">
      <button
        onClick={() => handleSort('idealMode')}
        className="flex items-center gap-1 w-full justify-center hover:text-blue-500 transition-colors"
      >
        حالت ایده‌آل
        <ArrowUpDown className="w-4 h-4" />
      </button>
    </th>
    <th className="p-2 text-right">تاریخ تراکنش</th>
  </tr>
</thead>
      <tbody>
        {filteredAndSortedTransactions.map((t, index) => (
          <motion.tr
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className={`border-b dark:border-gray-600 ${
              isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
            }`}
          >
            <td className="p-2 text-right">{t.cardNumber}</td>
            <td className="p-2 text-right">{t.bank.title}</td>
            <td className="p-2 text-left" dir="ltr">
              {typeof t.totalAmount === 'number' ? formatNumber(t.totalAmount) : t.totalAmount}
            </td>
            <td className="p-2 text-center">{t.repetitionCount}</td>
            <td className="p-2 text-center">{t.daysCount}</td>
            <td className="p-2 text-right">{t.uniqueDates.join('، ')}</td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter
            className={`px-6 py-3 text-xs border-t-0 rounded-b-3xl ${
              isDarkMode ? 'text-gray-200' : 'text-gray-600 text-black'
            }`}
            style={persianFontStyle}
          >
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2">
              <span className="md:text-sm text-center">
All Right Reserved: Capt. Esmaeili              </span>
              <span className="md:text-sm text-center"> CAPRICORN ©</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <QuickActionsMenu />
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default BankCardAnalyzer;
