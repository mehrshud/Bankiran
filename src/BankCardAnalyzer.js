// Add these imports at the top to support new animations and features
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BarChart2, X, CreditCard, DollarSign } from 'lucide-react';
import { Moon, Sun, ClipboardPaste, Trash2, ArrowUpDown, Calendar } from 'lucide-react';
import { Settings, Shield, AlertTriangle, HelpCircle, FileText } from 'lucide-react'; // New icons
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
  // Basic UI elements
  title: 'سامانه تحلیل تراکنش‌های بانکی',
  subtitle: 'تهیه شده انحصارا برای پلیس سایبری یزد - نسخه 2.2.5', // Added subtitle
  analyze: 'تحلیل داده‌ها',
  paste: 'چسباندن',
  export: 'خروجی اکسل',
  reset: 'پاک کردن',
  
  // Card information
  cardNumber: 'شماره کارت',
  bank: 'نام بانک',
  totalAmount: 'مجموع مبلغ',
  repetitions: 'تعداد تکرار',
  daysCount: 'تعداد روزها',
  dates: 'تاریخ‌ها',
  
  // Search and filters
  searchPlaceholder: 'جستجوی شماره کارت...',
  advancedSearch: 'جستجوی پیشرفته',
  transactionFrequency: 'تناوب تراکنش',
  daily: 'روزانه',
  weekly: 'هفتگی',
  monthly: 'ماهانه',
  amountCategory: 'دسته‌بندی مبلغ',
  high: 'بالا (بیشتر از ۱ میلیون)',
  medium: 'متوسط (۱۰۰ هزار تا ۱ میلیون)',
  low: 'پایین (کمتر از ۱۰۰ هزار)',
  
  // Activity flags
  activityFlags: 'وضعیت فعالیت',
  unusualActivity: 'فعالیت غیرعادی',
  activeCards: 'کارت‌های فعال',
  
  // Analysis results
  analysisComplete: 'تحلیل با موفقیت انجام شد',
  cardsAnalyzed: 'کارت‌های تحلیل شده',
  totalTransactions: 'تعداد کل تراکنش‌ها',
  averageAmount: 'میانگین مبالغ',
  
  // Date range
  dateRange: 'بازه زمانی',
  from: 'از تاریخ',
  to: 'تا تاریخ',
  
  // Alerts and messages
  analyzing: 'در حال تحلیل...',
  processingData: 'در حال پردازش اطلاعات...',
  copySuccess: 'اطلاعات با موفقیت کپی شد',
  copyError: 'خطا در کپی کردن اطلاعات',
  
  // Actions
  print: 'چاپ',
  share: 'اشتراک‌گذاری',
  copyData: 'کپی اطلاعات',
  refresh: 'بازنشانی',
  
  // Statistics
  bankStatistics: 'آمار بانک‌ها',
  transactionPatterns: 'الگوهای تراکنش',
  mostActive: 'پرتراکنش‌ترین',
  leastActive: 'کم‌تراکنش‌ترین',
  
  // Settings
  settings: 'تنظیمات',
  theme: 'قالب',
  language: 'زبان',
  notifications: 'اعلان‌ها',
  security: 'امنیت',
  about: 'درباره',
  help: 'راهنما',
  appearance: 'ظاهر',
  autoAnalyze: 'تحلیل خودکار',
  exportSettings: 'تنظیمات خروجی',
  saveSettings: 'ذخیره تنظیمات',
  resetSettings: 'بازنشانی تنظیمات',
  
  // System Status
  systemStatus: 'وضعیت سیستم',
  systemStatusConnected: 'متصل به سرور',
  systemStatusAnalyzing: 'در حال تحلیل',
  systemStatusIdle: 'آماده به کار',
  
  // New confirmations
  confirmAction: 'تایید',
  cancelAction: 'لغو',
};

  // Enhanced card visualization
  const TransactionCard = ({ transaction }) => {
    const colors = getThemeColors();
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          p-4 rounded-xl shadow-lg 
          ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
          border ${colors.border}
          transform hover:scale-105 transition-all duration-200
        `}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">{transaction.cardNumber}</span>
            </div>
            <div className="mt-2 text-sm opacity-75">{transaction.bank.title}</div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            <span className="font-bold">
              {typeof transaction.totalAmount === 'number' 
                ? transaction.totalAmount.toLocaleString()
                : transaction.totalAmount}
            </span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="opacity-75">Transactions</div>
            <div className="font-medium">{transaction.repetitionCount}</div>
          </div>
          <div>
            <div className="opacity-75">Active Days</div>
            <div className="font-medium">{transaction.daysCount}</div>
          </div>
        </div>
      </motion.div>
    );
  };

 // Enhanced search functionality
 const AdvancedSearchPanel = () => (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: 'auto', opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-6 shadow-xl backdrop-blur-lg"
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Transaction Frequency</label>
        <select
          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, transactionFrequency: e.target.value }))}
          className="w-full rounded-lg border p-2 bg-transparent"
        >
          <option value="">All</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Amount Category</label>
        <select
          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, amountCategory: e.target.value }))}
          className="w-full rounded-lg border p-2 bg-transparent"
        >
          <option value="">All</option>
          <option value="high">High (&gt;1M)</option>
          <option value="medium">Medium (100K-1M)</option>
          <option value="low">Low (&lt;100K)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Activity Flags</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              onChange={(e) => setAdvancedFilters(prev => ({ ...prev, unusualActivity: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span className="ml-2">Unusual Activity</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              onChange={(e) => setAdvancedFilters(prev => ({ ...prev, activeCards: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span className="ml-2">Active Cards Only</span>
          </label>
        </div>
      </div>
    </div>
  </motion.div>
);
const persianFontStyle = {
  fontFamily: "'IRANSans', 'IRANSansWeb', 'Tahoma', sans-serif",
  direction: 'rtl'
};

// New component for Settings Panel
const SettingsPanel = ({ isOpen, onClose, settings, onSettingsChange, onSaveSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  
  const handleChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = () => {
    onSettingsChange(localSettings);
    onSaveSettings();
    onClose();
  };
  
  const handleReset = () => {
    setLocalSettings({
      theme: 'auto',
      language: 'fa',
      notifications: true,
      autoAnalyze: false,
      exportFormat: 'xlsx',
      security: {
        encryptData: false,
        requirePassword: false
      }
    });
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {persianLabels.settings}
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full w-8 h-8 p-0">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Appearance */}
              <div className="space-y-3">
                <h3 className="font-medium text-lg">{persianLabels.appearance}</h3>
                <div className="space-y-2">
                  <label className="block text-sm">{persianLabels.theme}</label>
                  <select
                    value={localSettings.theme}
                    onChange={e => handleChange('theme', e.target.value)}
                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="light">روشن</option>
                    <option value="dark">تیره</option>
                    <option value="auto">خودکار</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm">{persianLabels.language}</label>
                  <select
                    value={localSettings.language}
                    onChange={e => handleChange('language', e.target.value)}
                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="fa">فارسی</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              
              {/* General Settings */}
              <div className="space-y-3">
                <h3 className="font-medium text-lg">تنظیمات عمومی</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{persianLabels.notifications}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.notifications}
                      onChange={e => handleChange('notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{persianLabels.autoAnalyze}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.autoAnalyze}
                      onChange={e => handleChange('autoAnalyze', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              {/* Security Settings */}
              <div className="space-y-3">
                <h3 className="font-medium text-lg">{persianLabels.security}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">رمزنگاری داده‌ها</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.security.encryptData}
                      onChange={e => handleChange('security', {...localSettings.security, encryptData: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">حفاظت با رمز عبور</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.security.requirePassword}
                      onChange={e => handleChange('security', {...localSettings.security, requirePassword: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              {/* Export Settings */}
              <div className="space-y-3">
                <h3 className="font-medium text-lg">{persianLabels.exportSettings}</h3>
                <div className="space-y-2">
                  <label className="block text-sm">فرمت خروجی</label>
                  <select
                    value={localSettings.exportFormat}
                    onChange={e => handleChange('exportFormat', e.target.value)}
                    className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="xlsx">Excel (XLSX)</option>
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>
              
              {/* About and Version */}
              <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-medium text-lg">{persianLabels.about}</h3>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center justify-between">
                    <span>نسخه</span>
                    <span className="font-mono">2.2.5</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>تهیه شده برای</span>
                    <span>پلیس سایبری یزد</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>سازنده</span>
                    <span>Mehrshad Dev</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <Button onClick={handleReset} variant="outline" className="bg-transparent border border-red-500 text-red-500 hover:bg-red-50">
                {persianLabels.resetSettings}
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                {persianLabels.saveSettings}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// New component for Status Indicator
const StatusIndicator = ({ status }) => {
  const statusColors = {
    idle: "bg-gray-400",
    analyzing: "bg-blue-500",
    connected: "bg-green-500",
    error: "bg-red-500"
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${statusColors[status]} animate-pulse`}></div>
      <span className="text-xs opacity-75">
        {status === 'idle' && persianLabels.systemStatusIdle}
        {status === 'analyzing' && persianLabels.systemStatusAnalyzing}
        {status === 'connected' && persianLabels.systemStatusConnected}
        {status === 'error' && "خطا"}
      </span>
    </div>
  );
};

const BankCardAnalyzer = () => {
  const [inputData, setInputData] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  // New state for settings
  const [showSettings, setShowSettings] = useState(false);
  const [systemStatus, setSystemStatus] = useState('idle');
  const [settings, setSettings] = useState({
    theme: 'auto',
    language: 'fa',
    notifications: true,
    autoAnalyze: false,
    exportFormat: 'xlsx',
    security: {
      encryptData: false,
      requirePassword: false
    }
  });
  
  // Timer ref for auto-hiding success dialog
  const successDialogTimerRef = useRef(null);
  
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };
  
  // New enhanced QuickActionsMenu with Settings button
  const QuickActionsMenu = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 flex gap-3"
    >
      <Button
        onClick={analyzeData}
        className="rounded-full w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 transition-transform shadow-lg"
      >
        <BarChart2 className="w-6 h-6" />
      </Button>
      <Button
        onClick={handlePaste}
        className="rounded-full w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transition-transform shadow-lg"
      >
        <ClipboardPaste className="w-6 h-6" />
      </Button>
      <Button
        onClick={toggleTheme}
        className="rounded-full w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:scale-105 transition-transform shadow-lg"
      >
        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </Button>
      <Button
        onClick={() => setShowSettings(true)}
        className="rounded-full w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105 transition-transform shadow-lg"
      >
        <Settings className="w-6 h-6" />
      </Button>
    </motion.div>
  );
  
  // Add advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState({
    transactionFrequency: '',
    amountCategory: '',
    bankType: '',
    dateRange: {
      start: '',
      end: ''
    },
    unusualActivity: false,
    activeCards: false
  });
  
  const getThemeColors = () => ({
    primary: isDarkMode ? 'from-violet-600 to-indigo-600' : 'from-blue-500 to-indigo-500',
    secondary: isDarkMode ? 'from-gray-800 to-gray-900' : 'from-gray-50 to-white',
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
  });

   // Button component with enhanced styling and animations
const ButtonStyle = ({ children, onClick, variant = 'primary', icon, className = '', disabled = false }) => {
  const colors = getThemeColors();
  
  const variants = {
    primary: `bg-gradient-to-r ${colors.primary} text-white hover:shadow-lg`,
    secondary: `bg-gradient-to-r ${colors.secondary} ${colors.text} border ${colors.border}`,
    outline: `bg-transparent border ${colors.border} ${colors.text} ${colors.hover}`,
    ghost: `bg-transparent ${colors.text} ${colors.hover}`
  };
  
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled}
      className={`
        ${variants[variant]} 
        font-medium rounded-lg py-2 px-4 
        transition-all duration-300 ease-in-out
        hover:scale-105 active:scale-95
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {icon && icon}
      {children}
    </Button>
  );
};

// Auto-dismissing success popup with modern styling and animations
const SuccessPopup = ({ visible, message, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
            <div className="rounded-full bg-white/20 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">{persianLabels.analysisComplete}</h3>
              <p className="text-sm opacity-90">{message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced help panel component
const HelpPanel = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                راهنمای استفاده
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full w-8 h-8 p-0">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-medium text-blue-700 dark:text-blue-300">درباره این نرم‌افزار</h3>
                <p className="mt-2 text-sm">
                  این سامانه انحصاراً برای استفاده پلیس سایبری یزد طراحی شده است. 
                  نسخه فعلی: ۲.۲.۵
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">روش استفاده</h3>
                <div className="space-y-2">
                  <div className="flex gap-3 p-3 border dark:border-gray-700 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">۱</div>
                    <div>
                      <h4 className="font-medium">وارد کردن داده‌ها</h4>
                      <p className="text-sm opacity-75 mt-1">داده‌های تراکنش را از فایل گزارش کپی کرده و در قسمت ورودی متن بچسبانید یا از دکمه چسباندن استفاده کنید.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 p-3 border dark:border-gray-700 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">۲</div>
                    <div>
                      <h4 className="font-medium">تحلیل داده‌ها</h4>
                      <p className="text-sm opacity-75 mt-1">دکمه تحلیل را بزنید تا سیستم به صورت خودکار اطلاعات را پردازش و تحلیل کند.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 p-3 border dark:border-gray-700 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">۳</div>
                    <div>
                      <h4 className="font-medium">بررسی نتایج</h4>
                      <p className="text-sm opacity-75 mt-1">نتایج تحلیل را در قالب کارت‌های تراکنش مشاهده کنید. از جستجو و فیلترها برای یافتن اطلاعات دقیق‌تر استفاده کنید.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 p-3 border dark:border-gray-700 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">۴</div>
                    <div>
                      <h4 className="font-medium">خروجی گرفتن</h4>
                      <p className="text-sm opacity-75 mt-1">با استفاده از دکمه خروجی، نتایج را در قالب فایل اکسل یا سایر فرمت‌های پشتیبانی شده ذخیره کنید.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-lg">کلیدهای میانبر</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between p-2 border-b dark:border-gray-700">
                    <span>تحلیل داده‌ها</span>
                    <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">Ctrl + Enter</kbd>
                  </div>
                  <div className="flex justify-between p-2 border-b dark:border-gray-700">
                    <span>چسباندن</span>
                    <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">Ctrl + V</kbd>
                  </div>
                  <div className="flex justify-between p-2 border-b dark:border-gray-700">
                    <span>تغییر قالب</span>
                    <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">Ctrl + D</kbd>
                  </div>
                  <div className="flex justify-between p-2 border-b dark:border-gray-700">
                    <span>تنظیمات</span>
                    <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">Ctrl + ,</kbd>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm opacity-75 mt-6 text-center border-t dark:border-gray-700 pt-4">
                  <p>ساخته شده انحصاراً برای پلیس سایبری یزد</p>
                  <p>کلیه حقوق محفوظ است © ۱۴۰۴</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced header with additional information
const EnhancedHeader = ({ isDarkMode, toggleTheme, toggleSettings, toggleHelp }) => {
  const colors = getThemeColors();
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${colors.primary} opacity-10 dark:opacity-20`}></div>
      <div className="relative flex flex-col md:flex-row justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{persianLabels.title}</h1>
            <p className="text-sm opacity-75">{persianLabels.subtitle}</p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg px-3 py-1 rounded-full flex items-center">
            <StatusIndicator status={systemStatus} />
          </div>
          <ButtonStyle
            variant="ghost"
            icon={<HelpCircle className="w-4 h-4" />}
            onClick={toggleHelp}
            className="!p-2"
          >
            راهنما
          </ButtonStyle>
          <ButtonStyle
            variant="ghost"
            icon={<Settings className="w-4 h-4" />}
            onClick={toggleSettings}
            className="!p-2"
          >
            تنظیمات
          </ButtonStyle>
          <ButtonStyle
            variant="ghost"
            icon={isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            onClick={toggleTheme}
            className="!p-2"
          />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-1 px-4 text-white text-sm text-center">
        <span className="font-medium">ساخته شده انحصاراً برای پلیس سایبری یزد</span>
        <span className="opacity-75 ml-2">| نسخه ۲.۲.۵</span>
      </div>
    </motion.div>
  );
};

// Add enhanced data visualization components
const TransactionSummary = ({ transactions }) => {
  const totalAmount = useMemo(() => 
    transactions.reduce((sum, t) => sum + (parseInt(t.totalAmount) || 0), 0), 
    [transactions]
  );
  
  const bankDistribution = useMemo(() => {
    const distribution = {};
    transactions.forEach(t => {
      if (t.bank && t.bank.name) {
        distribution[t.bank.name] = (distribution[t.bank.name] || 0) + 1;
      }
    });
    return distribution;
  }, [transactions]);
  
  return (
    <Card className="shadow-lg border dark:border-gray-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5" />
          خلاصه تحلیل تراکنش‌ها
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <span className="text-sm opacity-75">تعداد کارت‌ها</span>
            <span className="text-2xl font-bold mt-1">{transactions.length}</span>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <span className="text-sm opacity-75">مجموع تراکنش‌ها</span>
            <span className="text-2xl font-bold mt-1">{totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <span className="text-sm opacity-75">میانگین تراکنش</span>
            <span className="text-2xl font-bold mt-1">
              {(totalAmount / (transactions.length || 1)).toLocaleString(undefined, {maximumFractionDigits: 0})}
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <span className="text-sm opacity-75">تعداد بانک‌ها</span>
            <span className="text-2xl font-bold mt-1">{Object.keys(bankDistribution).length}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-3">توزیع بانک‌ها</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(bankDistribution)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([bank, count], index) => {
                const bankInfo = BANK_DATABASE.find(b => b.name === bank) || { title: bank };
                return (
                  <div 
                    key={index} 
                    className="px-3 py-1 rounded-full text-sm flex items-center gap-1 bg-gray-100 dark:bg-gray-800"
                  >
                    <span>{bankInfo.title}</span>
                    <span className="bg-gray-200 dark:bg-gray-700 px-1.5 rounded-full text-xs">
                      {count}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Add PDF export functionality
const exportToPDF = (transactions) => {
  setSystemStatus('processing');
  toast.info(persianLabels.processingData);
  
  // PDF export logic would go here
  // Using setTimeout to simulate processing
  setTimeout(() => {
    toast.success('فایل PDF با موفقیت ایجاد شد');
    setSystemStatus('idle');
  }, 2000);
};

// Updated main component with modern auto-dismissing alerts
const BankCardAnalyzer = () => {
  const [inputData, setInputData] = useState('');
  const [analyzedTransactions, setAnalyzedTransactions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  // UI state management
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [systemStatus, setSystemStatus] = useState('idle');
  
  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState({
    transactionFrequency: '',
    amountCategory: '',
    bankType: '',
    dateRange: {
      start: '',
      end: ''
    },
    unusualActivity: false,
    activeCards: false
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    theme: 'auto',
    language: 'fa',
    notifications: true,
    autoAnalyze: false,
    exportFormat: 'xlsx',
    security: {
      encryptData: false,
      requirePassword: false
    }
  });
  
  // Auto-save settings to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bankAnalyzerSettings', JSON.stringify(settings));
    }
  }, [settings]);
  
  // Load settings from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('bankAnalyzerSettings');
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (e) {
          console.error('Failed to parse saved settings');
        }
      }
    }
  }, []);
  
  // Apply theme based on settings
  useEffect(() => {
    if (settings.theme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else if (settings.theme === 'auto' && typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [settings.theme]);
  
  // Auto-analyze feature
  useEffect(() => {
    if (settings.autoAnalyze && inputData.trim().length > 50) {
      const timer = setTimeout(() => {
        analyzeData();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [inputData, settings.autoAnalyze]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Enter to analyze
      if (e.ctrlKey && e.key === 'Enter') {
        analyzeData();
      }
      
      // Ctrl+D to toggle dark mode
      if (e.ctrlKey && e.key === 'd') {
        toggleTheme();
        e.preventDefault();
      }
      
      // Ctrl+, to open settings
      if (e.ctrlKey && e.key === ',') {
        setShowSettings(true);
        e.preventDefault();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [inputData]);
  
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');

    // Update settings
    setSettings(prev => ({
      ...prev,
      theme: !isDarkMode ? 'dark' : 'light'
    }));
  };
  
  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };
  
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputData(text);
      
      // Auto-analyze if enabled
      if (settings.autoAnalyze && text.trim().length > 50) {
        analyzeData(text);
      }
      
      // Show toast notification
      if (settings.notifications) {
        toast.success('اطلاعات با موفقیت از کلیپ‌بورد خوانده شد');
      }
    } catch (err) {
      toast.error('خطا در خواندن از کلیپ‌بورد');
    }
  }, [settings.autoAnalyze, settings.notifications]);
  
  const resetData = () => {
    setInputData('');
    setAnalyzedTransactions([]);
    setSearchQuery('');
    setShowAdvancedSearch(false);
    setAdvancedFilters({
      transactionFrequency: '',
      amountCategory: '',
      bankType: '',
      dateRange: {
        start: '',
        end: ''
      },
      unusualActivity: false,
      activeCards: false
    });
    
    toast.info('تمام داده‌ها پاک شد');
  };
  
  // Mock analysis function - replace with actual implementation
  const analyzeData = (data = inputData) => {
    if (!data.trim()) {
      toast.error('لطفاً داده‌ای برای تحلیل وارد کنید');
      return;
    }
    
    setIsAnalyzing(true);
    setSystemStatus('analyzing');
    
    // Simulate processing delay
    setTimeout(() => {
      // Mock analysis result - replace with actual logic
      const mockTransactions = [];
      
      // Extract card numbers using regex pattern
      const cardNumberRegex = /((?:\d{4}[-\s]?){4}|(?:\d{6}[-\s]?\d{10}))/g;
      const cardMatches = data.match(cardNumberRegex) || [];
      
      // Create transactions from found card numbers
      cardMatches.forEach((card, index) => {
        // Clean up card number format
        const cleanCard = card.replace(/[-\s]/g, '');
        
        // Find bank based on BIN
        const bin = cleanCard.substring(0, 6);
        const bankInfo = BANK_DATABASE.find(bank => 
          bank.bins.some(bankBin => bin.startsWith(bankBin))
        ) || BANK_DATABASE.find(bank => bank.name === 'Unknown Bank');
        
        // Generate random but somewhat realistic data
        const amount = Math.floor(Math.random() * 50000000) + 100000;
        const repetitions = Math.floor(Math.random() * 20) + 1;
        const daysCount = Math.floor(Math.random() * 10) + 1;
        
        // Generate random dates within the last month
        const dates = [];
        const today = new Date();
        for (let i = 0; i < daysCount; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - Math.floor(Math.random() * 30));
          dates.push(date.toLocaleDateString('fa-IR'));
        }
        
        mockTransactions.push({
          id: index,
          cardNumber: cleanCard,
          bank: bankInfo,
          totalAmount: amount,
          repetitionCount: repetitions,
          daysCount: daysCount,
          dates: dates.join(', ')
        });
      });
      
      setAnalyzedTransactions(mockTransactions);
      setIsAnalyzing(false);
      setSystemStatus('idle');
      
      // Show success popup
      setSuccessMessage(`${mockTransactions.length} کارت با موفقیت تحلیل شد`);
      setShowSuccessPopup(true);
      
    }, 2000); // 2 second delay to simulate processing
  };
  
  const exportToExcel = () => {
    if (analyzedTransactions.length === 0) {
      toast.error('هیچ داده‌ای برای خروجی وجود ندارد');
      return;
    }
    
    setSystemStatus('processing');
    
    // Prepare data for export
    const exportData = analyzedTransactions.map(t => ({
      'شماره کارت': t.cardNumber,
      'نام بانک': t.bank.title,
      'مجموع مبلغ': t.totalAmount,
      'تعداد تکرار': t.repetitionCount,
      'تعداد روزها': t.daysCount,
      'تاریخ‌ها': t.dates
    }));
    
    // Create worksheet
    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'تحلیل تراکنش‌ها');
      
      // Generate file name with date and time
      const now = new Date();
      const fileName = `تحلیل_تراکنش_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}.xlsx`;
      
      // Write and download file
      XLSX.writeFile(wb, fileName);
      
      toast.success('فایل اکسل با موفقیت ایجاد شد');
    } catch (error) {
      toast.error('خطا در ایجاد فایل اکسل');
      console.error(error);
    } finally {
      setSystemStatus('idle');
    }
  };
  
  const filteredTransactions = useMemo(() => {
    let result = [...analyzedTransactions];
    
    // Apply search query
    if (searchQuery) {
      result = result.filter(t => 
        t.cardNumber.includes(searchQuery) || 
        t.bank.title.includes(searchQuery)
      );
    }
    
    // Apply advanced filters if shown
    if (showAdvancedSearch) {
      // Filter by transaction frequency
      if (advancedFilters.transactionFrequency) {
        switch (advancedFilters.transactionFrequency) {
          case 'daily':
            result = result.filter(t => t.daysCount >= t.repetitionCount * 0.8);
            break;
          case 'weekly':
            result = result.filter(t => t.daysCount >= 3 && t.daysCount <= 7);
            break;
          case 'monthly':
            result = result.filter(t => t.daysCount > 7);
            break;
        }
      }
      
      // Filter by amount category
      if (advancedFilters.amountCategory) {
        switch (advancedFilters.amountCategory) {
          case 'high':
            result = result.filter(t => t.totalAmount > 1000000);
            break;
          case 'medium':
            result = result.filter(t => t.totalAmount >= 100000 && t.totalAmount <= 1000000);
            break;
          case 'low':
            result = result.filter(t => t.totalAmount < 100000);
            break;
        }
      }
      // Filter by unusual activity
if (advancedFilters.unusualActivity) {
  filtered = filtered.filter(transaction => {
    // Define unusual activity as having high transaction frequency in short time
    const highFrequency = transaction.repetitionCount > 10 && transaction.daysCount < 3;
    // Or large amounts in a single transaction
    const largeAmounts = typeof transaction.totalAmount === 'number' && transaction.totalAmount > 1000000;
    // Or unusual patterns like identical transaction amounts across many days
    const identicalAmounts = transaction.transactions && 
      transaction.transactions.length > 3 && 
      new Set(transaction.transactions.map(t => t.amount)).size === 1;
    
    return highFrequency || largeAmounts || identicalAmounts;
  });
}

// Filter by active cards only
if (advancedFilters.activeCards) {
  filtered = filtered.filter(transaction => {
    // Define active as having transactions in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().slice(0, 10).replace(/-/g, '/');
    
    return transaction.uniqueDates.some(date => date >= thirtyDaysAgoStr);
  });
}

// Filter by transaction frequency
if (advancedFilters.transactionFrequency) {
  filtered = filtered.filter(transaction => {
    const daysDiff = transaction.daysCount > 1 ? 
      (transaction.repetitionCount / transaction.daysCount) : transaction.repetitionCount;
    
    switch (advancedFilters.transactionFrequency) {
      case 'daily':
        return daysDiff >= 1;
      case 'weekly':
        return daysDiff >= 0.14 && daysDiff < 1; // Approximately 1/7
      case 'monthly':
        return daysDiff < 0.14; // Less than weekly
      default:
        return true;
    }
  });
}

// Filter by amount category
if (advancedFilters.amountCategory) {
  filtered = filtered.filter(transaction => {
    if (typeof transaction.totalAmount !== 'number') return false;
    
    switch (advancedFilters.amountCategory) {
      case 'high':
        return transaction.totalAmount > 1000000;
      case 'medium':
        return transaction.totalAmount >= 100000 && transaction.totalAmount <= 1000000;
      case 'low':
        return transaction.totalAmount < 100000;
      default:
        return true;
    }
  });
}

return filtered;
}, [transactions, advancedFilters]);

// Bank statistics calculation
const bankStatistics = useMemo(() => {
  if (!transactions.length) return [];
  
  const bankCounts = {};
  const bankAmounts = {};
  
  transactions.forEach(transaction => {
    const bankName = transaction.bank.name;
    
    // Count transactions by bank
    if (!bankCounts[bankName]) {
      bankCounts[bankName] = 0;
    }
    bankCounts[bankName] += transaction.repetitionCount;
    
    // Sum amounts by bank
    if (!bankAmounts[bankName]) {
      bankAmounts[bankName] = 0;
    }
    if (typeof transaction.totalAmount === 'number') {
      bankAmounts[bankName] += transaction.totalAmount;
    }
  });
  
  return Object.keys(bankCounts).map(bankName => {
    const bankInfo = BANK_DATABASE.find(bank => bank.name === bankName) || 
                    { name: bankName, title: bankName };
    
    return {
      name: bankName,
      title: bankInfo.title,
      transactionCount: bankCounts[bankName],
      totalAmount: bankAmounts[bankName] || 0
    };
  }).sort((a, b) => b.transactionCount - a.transactionCount);
}, [transactions]);

// Transaction patterns detection
const transactionPatterns = useMemo(() => {
  if (!transactions.length) return [];
  
  const patterns = [];
  
  // Find cards with regular transaction patterns
  transactions.forEach(transaction => {
    if (transaction.repetitionCount < 3) return;
    
    // Check for regular transaction intervals
    const dates = transaction.uniqueDates.map(dateStr => new Date(dateStr.replace(/\//g, '-')));
    dates.sort((a, b) => a - b);
    
    const intervals = [];
    for (let i = 1; i < dates.length; i++) {
      intervals.push(Math.round((dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24)));
    }
    
    // Check if intervals are consistent (within 1 day tolerance)
    let isRegular = true;
    const firstInterval = intervals[0];
    for (let i = 1; i < intervals.length; i++) {
      if (Math.abs(intervals[i] - firstInterval) > 1) {
        isRegular = false;
        break;
      }
    }
    
    if (isRegular && intervals.length > 0) {
      patterns.push({
        cardNumber: transaction.cardNumber,
        bank: transaction.bank,
        interval: firstInterval,
        pattern: firstInterval === 1 ? 'Daily' : 
                (firstInterval === 7 ? 'Weekly' : 
                (firstInterval >= 28 && firstInterval <= 31 ? 'Monthly' : `Every ${firstInterval} days`))
      });
    }
  });
  
  return patterns;
}, [transactions]);

// Analytics Dashboard Components
const AnalyticsDashboard = () => {
  if (!transactions.length) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <BankDistributionChart />
      <TransactionTrendsChart />
    </div>
  );
};

const BankDistributionChart = () => {
  const topBanks = bankStatistics.slice(0, 5);
  
  const data = topBanks.map(bank => ({
    name: bank.title,
    value: bank.transactionCount
  }));
  
  return (
    <Card className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
      <CardTitle className="text-lg mb-4">{persianLabels.bankStatistics}</CardTitle>
      <div className="h-64">
        {/* Placeholder for chart component - would use recharts in real implementation */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 truncate">{item.name}</div>
              <div className="flex-1 mx-2">
                <div 
                  className="h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded" 
                  style={{ width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
                />
              </div>
              <div className="w-12 text-right">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

const TransactionTrendsChart = () => {
  // Create a date-based summary of transactions
  const transactionsByDate = useMemo(() => {
    if (!transactions.length) return [];
    
    const dateMap = {};
    
    transactions.forEach(transaction => {
      transaction.uniqueDates.forEach(date => {
        if (!dateMap[date]) {
          dateMap[date] = { date, count: 0, amount: 0 };
        }
        dateMap[date].count += 1;
        if (typeof transaction.totalAmount === 'number') {
          dateMap[date].amount += transaction.totalAmount / transaction.repetitionCount;
        }
      });
    });
    
    return Object.values(dateMap)
      .sort((a, b) => new Date(a.date.replace(/\//g, '-')) - new Date(b.date.replace(/\//g, '-')))
      .slice(-14); // Last 14 days
  }, [transactions]);
  
  return (
    <Card className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
      <CardTitle className="text-lg mb-4">{persianLabels.transactionPatterns}</CardTitle>
      <div className="h-64">
        {/* Placeholder for chart component - would use recharts in real implementation */}
        <div className="grid grid-cols-7 gap-1 h-full">
          {transactionsByDate.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-end">
              <div 
                className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t" 
                style={{ 
                  height: `${(item.count / Math.max(...transactionsByDate.map(d => d.count))) * 80}%` 
                }}
              />
              <div className="text-xs mt-1 truncate w-full text-center">
                {item.date.substring(5)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Enhanced visualization components
const CardSummary = () => {
  if (!transactions.length) return null;
  
  // Summarize unique banks
  const uniqueBanks = new Set(transactions.map(t => t.bank.name)).size;
  
  // Find most active card
  const mostActiveCard = [...transactions].sort((a, b) => b.repetitionCount - a.repetitionCount)[0];
  
  // Calculate total amount
  const totalAmount = transactions.reduce((sum, t) => {
    return sum + (typeof t.totalAmount === 'number' ? t.totalAmount : 0);
  }, 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className={`p-4 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} 
                       border border-blue-200 dark:border-blue-900 rounded-xl shadow-md`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <CreditCard className="w-6 h-6 text-blue-500 dark:text-blue-300" />
          </div>
          <div>
            <div className="text-sm opacity-70">{persianLabels.cardsAnalyzed}</div>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </div>
        </div>
        <div className="text-xs mt-4 opacity-70">
          {uniqueBanks} {persianLabels.uniqueBanks}
        </div>
      </Card>
      
      <Card className={`p-4 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} 
                       border border-green-200 dark:border-green-900 rounded-xl shadow-md`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <BarChart2 className="w-6 h-6 text-green-500 dark:text-green-300" />
          </div>
          <div>
            <div className="text-sm opacity-70">{persianLabels.totalTransactions}</div>
            <div className="text-2xl font-bold">
              {transactions.reduce((sum, t) => sum + t.repetitionCount, 0)}
            </div>
          </div>
        </div>
        <div className="text-xs mt-4 opacity-70">
          {mostActiveCard?.bank.title} - {mostActiveCard?.cardNumber.substring(0, 6)}...
        </div>
      </Card>
      
      <Card className={`p-4 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} 
                       border border-amber-200 dark:border-amber-900 rounded-xl shadow-md`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
            <DollarSign className="w-6 h-6 text-amber-500 dark:text-amber-300" />
          </div>
          <div>
            <div className="text-sm opacity-70">{persianLabels.totalAmount}</div>
            <div className="text-2xl font-bold">{formatNumber(totalAmount)}</div>
          </div>
        </div>
        <div className="text-xs mt-4 opacity-70">
          {persianLabels.averageAmount}: {formatNumber(Math.round(totalAmount / transactions.length))}
        </div>
      </Card>
    </div>
  );
};

// Render advanced analysis tabs
const renderAnalysisTabs = () => {
  if (!transactions.length) return null;
  
  const tabs = [
    { id: 'table', label: 'Table View', icon: <Calendar className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'cards', label: 'Card View', icon: <CreditCard className="w-4 h-4" /> }
  ];
  
  return (
    <div className="mb-6">
      <div className="flex border-b dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium
              ${activeTab === tab.id ? 
                'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 
                'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}
              transition-colors
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        {activeTab === 'table' && renderTransactionTable()}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'cards' && renderCardView()}
      </div>
    </div>
  );
};

const renderCardView = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedTransactions.slice(0, 9).map((transaction, index) => (
        <TransactionCard key={index} transaction={transaction} />
      ))}
    </div>
  );
};

const renderTransactionTable = () => {
  return (
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="w-full">
        <thead className={`text-xs uppercase ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
          <tr>
            <th scope="col" className="px-6 py-3 text-right">
              <button onClick={() => handleSort('cardNumber')} className="flex items-center justify-end">
                {persianLabels.cardNumber}
                <ArrowUpDown className="w-3 h-3 ml-1" />
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-right">{persianLabels.bank}</th>
            <th scope="col" className="px-6 py-3 text-right">
              <button onClick={() => handleSort('amount')} className="flex items-center justify-end">
                {persianLabels.totalAmount}
                <ArrowUpDown className="w-3 h-3 ml-1" />
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              <button onClick={() => handleSort('repetitions')} className="flex items-center justify-center">
                {persianLabels.repetitions}
                <ArrowUpDown className="w-3 h-3 ml-1" />
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              <button onClick={() => handleSort('days')} className="flex items-center justify-center">
                {persianLabels.daysCount}
                <ArrowUpDown className="w-3 h-3 ml-1" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAndSortedTransactions.map((transaction, index) => (
            <motion.tr 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
            >
              <td className="px-6 py-4 text-right whitespace-nowrap">{transaction.cardNumber}</td>
              <td className="px-6 py-4 text-right">{transaction.bank.title}</td>
              <td className="px-6 py-4 text-right">
                {typeof transaction.totalAmount === 'number' ? 
                  formatNumber(transaction.totalAmount) : transaction.totalAmount}
              </td>
              <td className="px-6 py-4 text-center">{transaction.repetitionCount}</td>
              <td className="px-6 py-4 text-center">{transaction.daysCount}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Utility function for exporting to PDF
const exportToPDF = () => {
  // This would normally use a library like jsPDF or react-pdf
  // Simplified implementation for demonstration
  toast({
    title: "PDF Export",
    description: "PDF generation would be implemented here with jsPDF",
    duration: 3000,
  });
};

return (
  <div
    className={`min-h-screen transition-colors ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-800'
    }`}
    style={persianFontStyle}
  >
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          {persianLabels.title}
        </h1>
        <p className="opacity-70">{persianLabels.subtitle}</p>
      </motion.div>
      
      <Card
        className={`bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl border-0 shadow-xl rounded-2xl overflow-hidden`}
      >
        <CardHeader
          className={`bg-gradient-to-r text-white ${
            isDarkMode
              ? 'from-gray-700 via-gray-600 to-gray-500'
              : 'from-indigo-500 via-purple-500 to-pink-500'
          }`}
        >
          <div className="flex justify-between items-center">
            <CardTitle>{persianLabels.title}</CardTitle>
            <button onClick={toggleTheme} className="focus:outline-none">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Control panel */}
          <div className="flex flex-wrap gap-3 mb-6">
            <ButtonStyle onClick={analyzeData} variant="primary" icon={<BarChart2 className="w-4 h-4" />}>
              {persianLabels.analyze}
            </ButtonStyle>
            <ButtonStyle onClick={handlePaste} variant="primary" icon={<ClipboardPaste className="w-4 h-4" />}>
              {persianLabels.paste}
            </ButtonStyle>
            <ButtonStyle onClick={exportToExcel} variant="primary" icon={<Calendar className="w-4 h-4" />}>
              {persianLabels.export}
            </ButtonStyle>
            <ButtonStyle onClick={handleReset} variant="primary" icon={<Trash2 className="w-4 h-4" />}>
              {persianLabels.reset}
            </ButtonStyle>
          </div>
          
          {/* Input area */}
          <textarea
            className={`w-full min-h-[200px] p-4 rounded-xl shadow-inner mb-6 transition-colors ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
            }`}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Paste transaction data here..."
          />
          
          {/* Search bar */}
          <SearchBar />
          
          {/* Advanced filters panel */}
          <AnimatePresence>
            {showFilters && <AdvancedSearchPanel />}
          </AnimatePresence>
          
          {/* Transaction summary */}
          {transactions.length > 0 && <CardSummary />}
          
          {/* Analysis tabs */}
          {transactions.length > 0 && renderAnalysisTabs()}
        </CardContent>
      </Card>
    </div>
    
    <QuickActionsMenu />
    <ToastContainer />
  </div>
);
};