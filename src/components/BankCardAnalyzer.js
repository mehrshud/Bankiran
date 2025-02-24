import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  BarChart2, 
  Moon, 
  Sun, 
  ClipboardPaste, 
  Trash2, 
  ArrowUpDown, 
  Calendar,
  Copy, 
  Printer,
  Database,
  Wallet,
  BarChart,
  CreditCard,
  Building,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUp,
  ArrowDown,
  PieChart,
  CheckCircle,
  Download,
  LineChart,
  AlertTriangle
} from 'lucide-react';
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
import './fonts.css';

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
  fontFamily: "'IRANSans', 'Tahoma', sans-serif",
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
      className="fixed bottom-6 right-6 flex gap-3 z-50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={analyzeData}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
        >
          <BarChart2 className="w-6 h-6" />
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={handlePaste}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 shadow-lg"
        >
          <ClipboardPaste className="w-6 h-6" />
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => {
            setIsDarkMode(!isDarkMode);
            document.documentElement.classList.toggle('dark');
          }}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </Button>
      </motion.div>
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
  text: isDarkMode ? 'text-gray-200' : 'text-gray-900', // Darker text in light mode
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
const exportToCSV = () => {
  const csvContent = filteredAndSortedTransactions.map(t => 
    `${t.cardNumber},${t.bank.title},${t.totalAmount},${t.repetitionCount},${t.daysCount},${t.uniqueDates.join(';')}`
  ).join('\n');
  const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'bank_analysis.csv';
  link.click();
};
// Elegant Icon Suggestion
const IconSuggestion = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill={isDarkMode ? "#4B5EAA" : "#D1C4E9"} />
    <path d="M12 28H28V12H12V28ZM14 14H26V26H14V14Z" fill={isDarkMode ? "#A5B4FC" : "#9575CD"} />
    <path d="M18 18H22V22H18V18Z" fill={isDarkMode ? "#E0E7FF" : "#B39DDB"} />
    <circle cx="20" cy="20" r="2" fill={isDarkMode ? "#6366F1" : "#7E57C2"} />
  </svg>
);
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
      className={`min-h-screen flex items-center justify-center p-4 md:p-8 transition-all duration-700 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-900'
          : 'bg-gradient-to-br from-violet-50 via-fuchsia-50 to-indigo-50'
      }`}
      style={persianFontStyle}
    >
      {/* Loading Dialog with improved animation */}
      <AlertDialog open={isAnalyzing}>
        <AlertDialogContent className="bg-gradient-to-br from-violet-600 to-indigo-600 border-0 text-white overflow-hidden p-8 rounded-2xl shadow-xl">
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="w-24 h-24 mx-auto mb-8 relative"
              initial={{ rotateY: 0 }}
              animate={{ 
                rotateY: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Calendar className="w-full h-full text-white drop-shadow-lg" />
            </motion.div>
          </div>
          <AlertDialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AlertDialogTitle className="text-3xl font-bold text-center mb-2">
                {persianLabels.analyzing}
              </AlertDialogTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <AlertDialogDescription className="text-gray-100 text-center">
                {persianLabels.processingData}
              </AlertDialogDescription>
            </motion.div>
          </AlertDialogHeader>
          <motion.div 
            className="mt-6 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex space-x-2">
              {[0, 1, 2, 3].map((dot) => (
                <motion.div
                  key={dot}
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: dot * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
  
      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent
          className="bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl shadow-2xl border-0 p-6"
          style={persianFontStyle}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <AlertTriangle className="w-16 h-16 text-white opacity-90" />
              </motion.div>
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-center">خطا</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-100 text-center mt-2">
                {errorMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <AlertDialogAction
                  onClick={() => setShowErrorDialog(false)}
                  className="bg-white text-red-600 hover:bg-gray-100 w-full py-3 rounded-lg font-medium shadow-lg"
                >
                  باشه
                </AlertDialogAction>
              </motion.div>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
  
      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent
          className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-8 shadow-2xl border-0 overflow-hidden"
          style={persianFontStyle}
        >
          <motion.div
            className="absolute inset-0 bg-white/10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ 
              backgroundSize: "200% 200%", 
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)" 
            }}
          />
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="bg-white/30 p-4 rounded-full"
                >
                  <CheckCircle className="w-16 h-16 text-white" />
                </motion.div>
              </motion.div>
            </div>
            <AlertDialogHeader>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AlertDialogTitle className="text-3xl font-bold mb-2 text-center">
                  {persianLabels.analysisComplete}
                </AlertDialogTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <AlertDialogDescription className="text-gray-100 text-lg text-center">
                  <span className="font-bold text-2xl">{transactions.length}</span> {persianLabels.cardsAnalyzed}
                </AlertDialogDescription>
              </motion.div>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <AlertDialogAction 
                  className="bg-white text-emerald-600 hover:bg-gray-100 py-3 px-6 rounded-lg font-medium shadow-lg w-full"
                >
                  {persianLabels.great}
                </AlertDialogAction>
              </motion.div>
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
        <Card className="backdrop-blur-xl border-0 shadow-2xl overflow-hidden rounded-3xl relative">
          {/* Animated background patterns */}
          <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
            <motion.div 
              className={`absolute w-96 h-96 rounded-full filter blur-3xl ${isDarkMode ? 'bg-indigo-700' : 'bg-indigo-300'}`}
              style={{ top: '-20%', right: '-10%' }}
              animate={{ 
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className={`absolute w-96 h-96 rounded-full filter blur-3xl ${isDarkMode ? 'bg-purple-700' : 'bg-fuchsia-300'}`}
              style={{ bottom: '-20%', left: '-10%' }}
              animate={{ 
                x: [0, -40, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
  
          <CardHeader className="relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 opacity-90"></div>
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <motion.div 
              className="absolute inset-0" 
              style={{ 
                backgroundImage: "url('data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='20' height='20'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='white' opacity='0.2'/%3E%3C/svg%3E')",
                backgroundSize: "20px 20px"
              }}
            />
            <div className="relative flex justify-between items-center z-10">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className={`${colorScheme.text} flex items-center gap-2`}>
                <IconSuggestion />
                  {persianLabels.title}
                </CardTitle>
              </motion.div>
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="text-white hover:bg-white/20 w-10 h-10 rounded-full"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>
              </motion.div>
            </div>
          </CardHeader>
  
          <CardContent className="p-6 space-y-8 relative z-10">
            <motion.div 
              className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Action buttons with enhanced hover effects */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={analyzeData}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/30 border-0 rounded-xl px-4 py-2 font-medium"
                >
                  <motion.span
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-2"
                  >
                    <LineChart className="w-5 h-5" />
                    {persianLabels.analyze}
                  </motion.span>
                </Button>
              </motion.div>
  
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handlePaste}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-teal-500/30 border-0 rounded-xl px-4 py-2 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <ClipboardPaste className="w-5 h-5" />
                    {persianLabels.paste}
                  </span>
                </Button>
              </motion.div>
  
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={exportToExcel}
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-amber-500/30 border-0 rounded-xl px-4 py-2 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    {persianLabels.export}
                  </span>
                </Button>
              </motion.div>
  
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-red-500/30 border-0 rounded-xl px-4 py-2 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    {persianLabels.reset}
                  </span>
                </Button>
              </motion.div>
  
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={copyFormattedData}
                  className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-purple-500/30 border-0 rounded-xl px-4 py-2 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Copy className="w-5 h-5" />
                    {persianLabels.copyData}
                  </span>
                </Button>
              </motion.div>
  
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handlePrint}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/30 border-0 rounded-xl px-4 py-2 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Printer className="w-5 h-5" />
                    {persianLabels.print}
                  </span>
                </Button>
              </motion.div>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <textarea
                className={`w-full min-h-[200px] p-6 rounded-2xl border-2 shadow-lg focus:ring-2 transition-all duration-300
                  ${
                    isDarkMode
                      ? 'bg-gray-800/60 border-gray-700 text-white focus:ring-violet-400 focus:border-violet-400'
                      : 'bg-white/90 text-black border-violet-200 focus:ring-violet-500 focus:border-violet-500'
                  }`}
                placeholder={persianLabels.textareaPlaceholder}
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                style={persianFontStyle}
              />
            </motion.div>
  
            {/* Statistics Cards */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    label: 'تعداد کل تراکنش‌ها',
                    value: statistics.totalTransactions.toLocaleString(),
                    icon: <Database className="w-6 h-6" />,
                    color: 'from-blue-500 to-indigo-600'
                  },
                  {
                    label: 'مجموع کل مبالغ',
                    value: formatNumber(statistics.totalAmount),
                    icon: <Wallet className="w-6 h-6" />,
                    color: 'from-green-500 to-emerald-600'
                  },
                  {
                    label: 'میانگین مبلغ تراکنش',
                    value: formatNumber(Math.round(statistics.averageAmount)),
                    icon: <BarChart className="w-6 h-6" />,
                    color: 'from-amber-500 to-yellow-600'
                  },
                  {
                    label: 'تعداد کارت‌های منحصر به فرد',
                    value: statistics.uniqueCards.toLocaleString(),
                    icon: <CreditCard className="w-6 h-6" />,
                    color: 'from-purple-500 to-violet-600'
                  },
                  {
                    label: 'تعداد بانک‌های درگیر',
                    value: statistics.uniqueBanksCount.toLocaleString(),
                    icon: <Building className="w-6 h-6" />,
                    color: 'from-red-500 to-rose-600'
                  },
                  {
                    label: 'بازه زمانی (روز)',
                    value: statistics.totalDays.toLocaleString(),
                    icon: <Calendar className="w-6 h-6" />,
                    color: 'from-teal-500 to-cyan-600'
                  },
                  {
                    label: 'بیشترین تراکنش روزانه',
                    value: formatNumber(statistics.maxDailyAmount),
                    icon: <TrendingUp className="w-6 h-6" />,
                    color: 'from-blue-500 to-indigo-600'
                  },
                  {
                    label: 'کمترین تراکنش روزانه',
                    value: formatNumber(statistics.minDailyAmount),
                    icon: <TrendingDown className="w-6 h-6" />,
                    color: 'from-green-500 to-emerald-600'
                  },
                  {
                    label: 'میانگین تراکنش روزانه',
                    value: formatNumber(Math.round(statistics.averageDailyAmount)),
                    icon: <BarChart3 className="w-6 h-6" />,
                    color: 'from-amber-500 to-yellow-600',
                    textColor: 'text-black-800'
                  },
                  {
                    label: 'بیشترین مبلغ تراکنش',
                    value: formatNumber(statistics.highestTransaction),
                    icon: <ArrowUp className="w-6 h-6" />,
                    color: 'from-purple-500 to-violet-600'
                  },
                  {
                    label: 'کمترین مبلغ تراکنش',
                    value: formatNumber(statistics.lowestTransaction),
                    icon: <ArrowDown className="w-6 h-6" />,
                    color: 'from-red-500 to-rose-600',
                    
                  },
                  {
                    label: 'میانگین تعداد تراکنش روزانه',
                    value: Math.round(statistics.averageTransactionsPerDay).toLocaleString(),
                    icon: <PieChart className="w-6 h-6" />,
                    color: 'from-teal-500 to-cyan-600'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ 
                      scale: 1.03,
                      transition: { duration: 0.2 }
                    }}
                    className={`p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative
                      ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/90'}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-10 ${stat.color}"></div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {stat.label}
                      </div>
                      <div className={`bg-gradient-to-r ${stat.color} p-2 rounded-lg text-white`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-2xl font-bold mt-1">{stat.value}</div>
                  </motion.div>
                ))}
              </div>
            )}
  
            {/* Table Section */}
            {transactions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`rounded-xl overflow-hidden shadow-lg ${
                  isDarkMode ? 'bg-gray-800/90' : 'bg-white/90 text-black'
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <th className="p-4 text-right">
                          <button
                            onClick={() => handleSort('cardNumber')}
                            className="flex items-center gap-1 w-full justify-end hover:text-blue-500 transition-colors"
                          >
                            {persianLabels.cardNumber}
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </th>
                        <th className="p-4 text-right">{persianLabels.bank}</th>
                        <th className="p-4 text-left">
                          <button
                            onClick={() => handleSort('amount')}
                            className="flex items-center gap-1 w-full justify-end hover:text-blue-500 transition-colors"
                          >
                            مبلغ تراکنش (ریال)
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </th>
                        <th className="p-4 text-center">
                          <button
                            onClick={() => handleSort('repetitions')}
                            className="flex items-center gap-1 w-full justify-center hover:text-blue-500 transition-colors"
                          >
                            {persianLabels.repetitions}
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </th>
                        <th className="p-4 text-center">
                          <button
                            onClick={() => handleSort('days')}
                            className="flex items-center gap-1 w-full justify-center hover:text-blue-500 transition-colors"
                          >
                            {persianLabels.daysCount}
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </th>
                        <th className="p-4 text-center">
                          <button
                            onClick={() => handleSort('idealMode')}
                            className="flex items-center gap-1 w-full justify-center hover:text-blue-500 transition-colors"
                          >
                            حالت ایده‌آل
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </th>
                        <th className="p-4 text-right">تاریخ تراکنش</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedTransactions.map((t, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          whileHover={{ backgroundColor: isDarkMode ? 'rgba(75, 85, 99, 0.7)' : 'rgba(243, 244, 246, 0.7)' }}
                          className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                        >
                          <td className="p-4 text-right">{t.cardNumber}</td>
                          <td className="p-4 text-right">{t.bank.title}</td>
                          <td className="p-4 text-left" dir="ltr">
                            {typeof t.totalAmount === 'number' ? formatNumber(t.totalAmount) : t.totalAmount}
                          </td>
                          <td className="p-4 text-center">{t.repetitionCount}</td>
                          <td className="p-4 text-center">{t.daysCount}</td>
                          <td className="p-4 text-right">{t.uniqueDates.join('، ')}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </CardContent>
  
          <CardFooter
            className={`px-6 py-4 text-xs border-t ${
              isDarkMode 
                ? 'text-gray-200 border-gray-700/50' 
                : 'text-gray-600 border-gray-200/50'
            }`}
            style={persianFontStyle}
          >
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2">
              <motion.span 
                className="md:text-sm text-center"
                whileHover={{ scale: 1.05 }}
              >
                All Right Reserved: Capt. Esmaeili
              </motion.span>
              <motion.span 
                className="md:text-sm text-center font-bold"
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                CAPRICORN ©
              </motion.span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
  
      <QuickActionsMenu />
      <ToastContainer 
        position="bottom-center" 
        transition={motion.div}
        draggable
        limit={3}
      />
    </div>
  );
};

export default BankCardAnalyzer;
