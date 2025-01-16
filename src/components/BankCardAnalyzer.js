import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BarChart2, X } from 'lucide-react';
import { Moon, Sun, ClipboardPaste, Trash2, ArrowUpDown, Calendar } from 'lucide-react';
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
import { 
  Copy,
  Printer,
  RefreshCcw
} from 'lucide-react';


// Bank database constant with Persian titles
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
  // All state declarations
  const [inputData, setInputData] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };
  const QuickActionsMenu = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 flex gap-2"
    >
      <Button
        onClick={analyzeData}
        className="rounded-full w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600"
      >
        <BarChart2 className="w-6 h-6" />
      </Button>
      <Button
        onClick={handlePaste}
        className="rounded-full w-12 h-12 bg-gradient-to-r from-green-500 to-green-600"
      >
        <ClipboardPaste className="w-6 h-6" />
      </Button>
      <Button
        onClick={toggleTheme}
        className="rounded-full w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600"
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
  const [showStats, setShowStats] = useState(false);

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

   // Format number with commas
   const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
   // Calculate statistics
   const statistics = useMemo(() => {
    if (!transactions.length) return null;
    
    const validAmounts = transactions
      .filter(t => typeof t.totalAmount === 'number')
      .map(t => t.totalAmount);
    
    return {
      totalTransactions: transactions.reduce((sum, t) => sum + t.repetitionCount, 0),
      totalAmount: validAmounts.reduce((sum, amount) => sum + amount, 0),
      averageAmount: validAmounts.length ? 
        validAmounts.reduce((sum, amount) => sum + amount, 0) / validAmounts.length : 0
    };
  }, [transactions]);

 // Enhanced sorting and filtering
 const filteredAndSortedTransactions = useMemo(() => {
  let filtered = [...transactions];

    // Apply amount filter
    if (amountFilter.min || amountFilter.max) {
      filtered = filtered.filter(t => {
        if (typeof t.totalAmount !== 'number') return false;
        const min = amountFilter.min ? parseFloat(amountFilter.min) : -Infinity;
        const max = amountFilter.max ? parseFloat(amountFilter.max) : Infinity;
        return t.totalAmount >= min && t.totalAmount <= max;
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.cardNumber.includes(searchTerm.replace(/\D/g, '')) ||
        t.bank.title.includes(searchTerm)
      );
    }

    // Apply sorting
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

  // Copy formatted data
  const copyFormattedData = async () => {
    try {
      const formattedData = filteredAndSortedTransactions.map(t => (
        `شماره کارت: ${t.cardNumber}\n` +
        `بانک: ${t.bank.title}\n` +
        `مجموع مبلغ: ${typeof t.totalAmount === 'number' ? formatNumber(t.totalAmount) : t.totalAmount}\n` +
        `تعداد تراکنش: ${t.repetitionCount}\n` +
        `تعداد روزها: ${t.daysCount}\n` +
        `تاریخ‌ها: ${t.uniqueDates.join(', ')}\n` +
        '-------------------'
      )).join('\n');

      await navigator.clipboard.writeText(formattedData);
      toast({
        title: persianLabels.copySuccess,
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: persianLabels.copyError,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Print function
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Reset filters
  const resetFilters = () => {
    setAmountFilter({ min: '', max: '' });
    setSearchTerm('');
    setSortConfig({ key: 'cardNumber', direction: 'asc' });
  };

  // Utility functions
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
    return BANK_DATABASE.find(bank => 
      bank.bins.some(bankBin => bin.startsWith(bankBin))
    ) || BANK_DATABASE[BANK_DATABASE.length - 1];
  }, []);

  const extractCardAmountAndDate = useCallback((line) => {
    const cleanLine = line.replace(/[^\d.,/\s]/g, ' ').trim();
    const parts = cleanLine.split(/\s+/).filter(part => part.length > 0);
    
    if (parts.length === 0) return null;
    
    // If only card number is present
    if (parts.length === 1 && /^\d{16}$/.test(parts[0])) {
      return {
        cardNumber: parts[0],
        amount: 0,
        date: new Date().toISOString().slice(0, 10).replace(/-/g, '/')
      };
    }
    
    let cardNumber = null;
    let amount = null;
    let date = null;
    
    parts.forEach(part => {
      if (/^\d{16}$/.test(part)) {
        cardNumber = part;
      } else if (/^\d+([.,]\d+)?$/.test(part)) {
        amount = parseFloat(part.replace(',', '.'));
      } else if (/^\d{4}\/\d{2}\/\d{2}$/.test(part)) {
        date = part;
      }
    });
    
    if (cardNumber) {
      return {
        cardNumber,
        amount: amount || 0,
        date: date || new Date().toISOString().slice(0, 10).replace(/-/g, '/')
      };
    }
    return null;
  }, []);

  // Analysis function
  const analyzeData = useCallback(async () => {
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const transactionMap = new Map();

    inputData.split('\n').forEach(line => {
      const result = extractCardAmountAndDate(line);
      if (!result) return;
      
      const { cardNumber, amount, date } = result;
      
      if (!validateCardNumber(cardNumber)) return;

      if (!transactionMap.has(cardNumber)) {
        transactionMap.set(cardNumber, {
          cardNumber,
          bank: identifyBank(cardNumber),
          transactions: [{amount, date}],
          uniqueDates: new Set([date]),
          repetitionCount: 1,
          totalAmount: amount === 'No price' ? 'No price' : amount
        });
      } else {
        const existing = transactionMap.get(cardNumber);
        existing.transactions.push({amount, date});
        existing.uniqueDates.add(date);
        existing.repetitionCount += 1;
        if (amount !== 'No price') {
          existing.totalAmount = existing.totalAmount === 'No price' ? 
            amount : existing.totalAmount + amount;
        }
      }
    });

    const processedTransactions = Array.from(transactionMap.values()).map(t => ({
      ...t,
      daysCount: t.uniqueDates.size,
      uniqueDates: Array.from(t.uniqueDates)
    }));

    setTransactions(processedTransactions);
    setIsAnalyzing(false);
    setShowSuccessDialog(true);
  }, [inputData, identifyBank, validateCardNumber, extractCardAmountAndDate]);

  // Handle paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputData((prev) => `${prev}\n${text}`.trim());
    } catch (err) {
      setErrorMessage('خطا در خواندن کلیپ‌بورد');
      setShowErrorDialog(true);
    }
  };

  // Handle reset
  const handleReset = () => {
    setInputData('');
    setTransactions([]);
    setSearchTerm('');
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Enhanced sorting logic
  const sortedTransactions = useMemo(() => {
    const filtered = searchTerm
      ? transactions.filter(t => t.cardNumber.includes(searchTerm.replace(/\D/g, '')))
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

  // Export to Excel
 const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    const data = sortedTransactions.map((t, index) => ({
      'ردیف': index + 1,
      'شماره کارت': t.cardNumber,
      'تعداد تراکنش‌ها': t.repetitionCount,
      'تعداد روزهای فعالیت': t.daysCount,
      'مجموع مبلغ': typeof t.totalAmount === 'number' ? t.totalAmount : 0,
    }));

    const sheet = XLSX.utils.json_to_sheet(data, {
      header: ['ردیف', 'شماره کارت', 'تعداد تراکنش‌ها', 'تعداد روزهای فعالیت', 'مجموع مبلغ']
    });
    
    // Set column widths
    const colWidths = [
      { wch: 8 },  // ردیف
      { wch: 20 }, // شماره کارت
      { wch: 15 }, // تعداد تراکنش‌ها
      { wch: 20 }, // تعداد روزهای فعالیت
      { wch: 15 }, // مجموع مبلغ
    ];
    sheet['!cols'] = colWidths;

    // Center align all cells
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

    // Set RTL
    sheet['!dir'] = 'rtl';
    
    XLSX.utils.book_append_sheet(workbook, sheet, "Analysis");
    XLSX.writeFile(workbook, "bank_analysis.xlsx");
  };
  const SearchBar = () => (
    <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="جستجوی پیشرفته..."
          className="w-full bg-transparent border-none focus:ring-0"
          onChange={(e) => setSearchFilters(prev => ({ ...prev, cardNumber: e.target.value }))}
          onFocus={() => setShowSearchSuggestions(true)}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(prev => !prev)}
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
            className="absolute w-full mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">نام بانک</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 rounded-md border dark:bg-gray-700"
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, bankName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">محدوده تاریخ</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-full mt-1 p-2 rounded-md border dark:bg-gray-700"
                    onChange={(e) => setSearchFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                  />
                  <input
                    type="date"
                    className="w-full mt-1 p-2 rounded-md border dark:bg-gray-700"
                    onChange={(e) => setSearchFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
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
    return transactions.filter(transaction => {
      const matchesCardNumber = transaction.cardNumber.includes(searchFilters.cardNumber);
      const matchesBankName = transaction.bank.title.toLowerCase().includes(searchFilters.bankName.toLowerCase());
      
      const amount = typeof transaction.totalAmount === 'number' ? transaction.totalAmount : 0;
      const matchesAmount = (!searchFilters.amountRange.min || amount >= parseFloat(searchFilters.amountRange.min)) &&
                          (!searchFilters.amountRange.max || amount <= parseFloat(searchFilters.amountRange.max));
      
      const matchesTransactionCount = (!searchFilters.transactionCount.min || transaction.repetitionCount >= parseInt(searchFilters.transactionCount.min)) &&
                                    (!searchFilters.transactionCount.max || transaction.repetitionCount <= parseInt(searchFilters.transactionCount.max));
      
      const matchesDateRange = (!searchFilters.dateRange.start || !searchFilters.dateRange.end) ||
                              transaction.uniqueDates.some(date => {
                                return date >= searchFilters.dateRange.start && date <= searchFilters.dateRange.end;
                              });
      
      return matchesCardNumber && matchesBankName && matchesAmount && matchesTransactionCount && matchesDateRange;
    });
  }, [transactions, searchFilters]);
  return (
    
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`} style={persianFontStyle}>
      <AlertDialog open={isAnalyzing}>
        <AlertDialogContent className="bg-gradient-to-br from-blue-500 to-purple-600 text-white" style={persianFontStyle}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Calendar className="w-full h-full" />
          </motion.div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">{persianLabels.analyzing}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-200">
              {persianLabels.processingData}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="bg-gradient-to-br from-green-500 to-emerald-600 text-white" style={persianFontStyle}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>{persianLabels.analysisComplete}</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-200">
                {transactions.length} {persianLabels.cardsAnalyzed}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="bg-white text-green-600">
                {persianLabels.great}
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <Card className={`shadow-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardHeader className={`${
            isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600'
          } text-white flex justify-between items-center`}>
            <CardTitle>{persianLabels.title}</CardTitle>
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
                {persianLabels.analyze}
              </Button>
              <Button onClick={handlePaste} className="bg-teal-500 hover:bg-teal-600"><ClipboardPaste className="ml-2" /> {persianLabels.paste}
              </Button>
              <Button onClick={exportToExcel} className="bg-amber-500 hover:bg-amber-600">
                {persianLabels.export}
              </Button>
              <Button onClick={handleReset} className="bg-red-500 hover:bg-red-600">
                <Trash2 className="ml-2" /> {persianLabels.reset}
              </Button>
              <Button onClick={copyFormattedData} className="bg-purple-500 hover:bg-purple-600">
                <Copy className="ml-2" /> {persianLabels.copyData}
              </Button>
              <Button onClick={handlePrint} className="bg-blue-500 hover:bg-blue-600">
                <Printer className="ml-2" /> {persianLabels.print}
              </Button>
              <Button onClick={resetFilters} className="bg-gray-500 hover:bg-gray-600">
                <RefreshCcw className="ml-2" /> {persianLabels.refresh}
              </Button>
            </div>

            <textarea 
              className={`w-full min-h-[200px] p-3 border-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'border-blue-200 focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder={persianLabels.textareaPlaceholder}
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              style={persianFontStyle}
            />

            <input 
              type="text"
              placeholder={persianLabels.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-2 border rounded-lg ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'border-blue-200 focus:ring-2 focus:ring-blue-500'
              }`}
              style={persianFontStyle}
            />
{/* Filter Section */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">{persianLabels.amountRange}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder={persianLabels.from}
                    value={amountFilter.min}
                    onChange={(e) => setAmountFilter(prev => ({ ...prev, min: e.target.value }))}
                    className={`w-full p-2 border rounded-lg ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-blue-200'
                    }`}
                  />
                  <input
                    type="number"
                    placeholder={persianLabels.to}
                    value={amountFilter.max}
                    onChange={(e) => setAmountFilter(prev => ({ ...prev, max: e.target.value }))}
                    className={`w-full p-2 border rounded-lg ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-blue-200'
                    }`}
                  />
                </div>
              </div>

              {/* ... Previous search input ... */}
            </div>

            {/* Statistics Section */}
            {statistics && (
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-white'
              } grid grid-cols-1 md:grid-cols-3 gap-4`}>
                <div className="text-center">
                  <div className="text-sm text-gray-500">{persianLabels.totalTransactions}</div>
                  <div className="text-xl font-bold">{formatNumber(statistics.totalTransactions)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">{persianLabels.totalAmount}</div>
                  <div className="text-xl font-bold">{formatNumber(statistics.totalAmount)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">{persianLabels.averageAmount}</div>
                  <div className="text-xl font-bold">{formatNumber(Math.round(statistics.averageAmount))}</div>
                </div>
              </div>
            )}
            {transactions.length > 0 && (
              <div className={`mt-4 p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'
              }`}>
                <div className="overflow-x-auto" style={persianFontStyle}>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 text-right">
                          <button 
                            onClick={() => handleSort('cardNumber')}
                            className="flex items-center gap-1 w-full justify-end hover:text-blue-500"
                          >
                            {persianLabels.cardNumber}
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </th>
                        <th className="p-2 text-right">{persianLabels.bank}</th>
                        <th className="p-2 text-left">
                          <button 
                            onClick={() => handleSort('amount')}
                            className="flex items-center gap-1 w-full justify-end hover:text-blue-500"
                          >
                            {persianLabels.totalAmount}
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </th>
                        <th className="p-2 text-center">
                          <button 
                            onClick={() => handleSort('repetitions')}
                            className="flex items-center gap-1 w-full justify-center hover:text-blue-500"
                          >
                            {persianLabels.repetitions}
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </th>
                        <th className="p-2 text-center">
                          <button 
                            onClick={() => handleSort('days')}
                            className="flex items-center gap-1 w-full justify-center hover:text-blue-500"
                          >
                            {persianLabels.daysCount}
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </th>
                        <th className="p-2 text-right">{persianLabels.dates}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTransactions.map((t, index) => (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`border-b ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}
                        >
                          <td className="p-2 text-right">{t.cardNumber}</td>
                          <td className="p-2 text-right">{t.bank.title}</td>
                          <td className="p-2 text-left">
                            {typeof t.totalAmount === 'number' ? 
                              t.totalAmount.toLocaleString() : 
                              t.totalAmount}
                          </td>
                          <td className="p-2 text-center">{t.repetitionCount}</td>
                          <td className="p-2 text-center">{t.daysCount}</td>
                          <td className="p-2 text-right" dir="ltr">{t.uniqueDates.join(', ')}</td>
                        </motion.tr>
                      ))}
                      {filteredTransactions.map((t, index) => (
  <motion.tr
  key={index}
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.05 }}
  className={`
    relative transition-all duration-200
    ${hoveredRow === t.cardNumber ? 'bg-blue-50 dark:bg-gray-700' : ''}
    ${selectedCards.has(t.cardNumber) ? 'bg-blue-100 dark:bg-gray-600' : ''}
  `}
  onMouseEnter={() => setHoveredRow(t.cardNumber)}
  onMouseLeave={() => setHoveredRow(null)}
  onClick={() => {
    setSelectedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(t.cardNumber)) {
        newSet.delete(t.cardNumber);
      } else {
        newSet.add(t.cardNumber);
      }
      return newSet;
    });
  }}
>
  <td className="p-4 border border-gray-200 dark:border-gray-700">
    {t.cardNumber}
  </td>
  <td className="p-4 border border-gray-200 dark:border-gray-700">
    {t.cardHolder}
  </td>
  <td className="p-4 border border-gray-200 dark:border-gray-700">
    {t.expirationDate}
  </td>
  <td className="p-4 border border-gray-200 dark:border-gray-700">
    {t.status}
  </td>
</motion.tr>

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
          }`} style={persianFontStyle}>
            <div className="w-full flex justify-between items-center">
              <span>توسعه داده شده توسط مهرشاد</span>
              <span>تمامی حقوق محفوظ است</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default BankCardAnalyzer;