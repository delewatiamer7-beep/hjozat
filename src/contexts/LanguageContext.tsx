import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  ar: {
    // Navigation
    'nav.switchRole': 'تبديل الدور',
    'nav.dashboard': 'الذهاب إلى لوحة التحكم',
    'nav.logout': 'تسجيل الخروج',
    'nav.backToHome': 'العودة إلى الصفحة الرئيسية',
    'nav.browseFields': 'تصفح الملاعب',
    'nav.myBookings': 'حجوزاتي',
    
    // Landing Page
    'landing.title': 'احجز ملعبك المثالي',
    'landing.subtitle': 'لكرة القدم',
    'landing.description': 'تواصل مع أفضل ملاعب كرة القدم في منطقتك. حجز سهل، مرافق احترافية، مباريات لا تُنسى.',
    'landing.chooseRole': 'اختر دورك',
    'landing.chooseRoleDesc': 'اختر كيف تريد استخدام منصتنا وابدأ تجربتك في حجز ملاعب كرة القدم.',
    'landing.customer': 'عميل',
    'landing.customerDesc': 'تصفح واحجز ملاعب كرة القدم في منطقتك. اعثر على المكان المثالي لمباراتك أو جلسة تدريبك القادمة.',
    'landing.owner': 'مالك ملعب',
    'landing.ownerDesc': 'أدرج مرافقك الرياضية وأدر الحجوزات. نمِّ أعمالك مع منصتنا الاحترافية.',
    'landing.haveAccount': 'لديك حساب بالفعل؟',
    'landing.loginHere': 'سجل دخولك هنا',
    'landing.welcome': 'مرحباً',
    'landing.back': 'عودة',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم الكامل',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.loggingIn': 'جاري تسجيل الدخول...',
    'auth.signingUp': 'جاري إنشاء الحساب...',
    'auth.accountType': 'نوع الحساب',
    'auth.customerRole': 'عميل - احجز ملاعب كرة القدم',
    'auth.ownerRole': 'مالك ملعب - أدر ملاعبك',
    'auth.loginTitle': 'تسجيل الدخول',
    'auth.signupTitle': 'إنشاء حساب جديد',
    'auth.createAccount': 'إنشاء حساب جديد',
    'auth.backToHome': 'العودة للرئيسية',
    'auth.logoutSuccess': 'تم تسجيل الخروج بنجاح',
    
    // Customer Dashboard
    'customer.findField': 'اعثر على ملعبك المثالي',
    'customer.discoverFields': 'اكتشف ملاعب كرة قدم مميزة في منطقتك واحجز فوراً',
    'customer.searchPlaceholder': 'البحث عن ملاعب...',
    'customer.locationPlaceholder': 'الموقع...',
    'customer.filter': 'تصفية',
    'customer.availableFields': 'الملاعب المتاحة',
    'customer.sortByPrice': 'ترتيب حسب السعر',
    'customer.sortByRating': 'ترتيب حسب التقييم',
    'customer.sortByDistance': 'ترتيب حسب المسافة',
    'customer.loadingFailed': 'فشل تحميل الملاعب',
    'customer.retry': 'إعادة المحاولة',
    'customer.noFields': 'لا توجد ملاعب متاحة حتى الآن',
    'customer.noMatchingFields': 'لم يتم العثور على ملاعب تطابق معاييرك',
    'customer.clearFilter': 'مسح التصفية',
    
    // Owner Dashboard
    'owner.dashboard': 'لوحة تحكم المالك',
    'owner.manageFields': 'أدر ملاعبك وحجوزاتك',
    'owner.addField': 'إضافة ملعب جديد',
    'owner.totalFields': 'إجمالي الملاعب',
    'owner.totalBookings': 'إجمالي الحجوزات',
    'owner.pendingBookings': 'حجوزات قيد الانتظار',
    'owner.revenue': 'الإيرادات',
    'owner.myFields': 'ملاعبي',
    'owner.bookings': 'الحجوزات',
    'owner.pending': 'قيد الانتظار',
    'owner.confirmed': 'مؤكد',
    'owner.all': 'الكل',
    'owner.fieldName': 'اسم الملعب',
    'owner.location': 'الموقع',
    'owner.price': 'السعر',
    'owner.status': 'الحالة',
    'owner.actions': 'الإجراءات',
    'owner.active': 'نشط',
    'owner.edit': 'تعديل',
    'owner.delete': 'حذف',
    'owner.noFields': 'لا توجد ملاعب بعد',
    'owner.addFirstField': 'ابدأ بإضافة ملعبك الأول',
    'owner.customer': 'العميل',
    'owner.date': 'التاريخ',
    'owner.time': 'الوقت',
    'owner.amount': 'المبلغ',
    'owner.confirm': 'تأكيد',
    'owner.confirming': 'جاري التأكيد...',
    'owner.noBookings': 'لا توجد حجوزات',
    'owner.bookingsWillAppear': 'ستظهر الحجوزات هنا',
    
    // Toast Messages
    'toast.loginSuccess': 'مرحباً بعودتك!',
    'toast.loginSuccessDesc': 'تم تسجيل دخولك بنجاح.',
    'toast.loginFailed': 'فشل تسجيل الدخول',
    'toast.signupSuccess': 'تم إنشاء الحساب!',
    'toast.signupSuccessDesc': 'يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك.',
    'toast.signupFailed': 'فشل إنشاء الحساب',
    'toast.validationError': 'خطأ في التحقق',
    'toast.confirmSuccess': 'تم التأكيد بنجاح',
    'toast.confirmSuccessDesc': 'تم تأكيد الحجز بنجاح',
    'toast.confirmFailed': 'فشل التأكيد',
    'toast.confirmFailedDesc': 'فشل تأكيد الحجز، يرجى المحاولة مرة أخرى',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.bookNow': 'احجز الآن',
    'common.perHour': 'ريال/ساعة',
    'common.sar': 'ريال',
  },
  en: {
    // Navigation
    'nav.switchRole': 'Switch Role',
    'nav.dashboard': 'Go to Dashboard',
    'nav.logout': 'Logout',
    'nav.backToHome': 'Back to Home',
    'nav.browseFields': 'Browse Fields',
    'nav.myBookings': 'My Bookings',
    
    // Landing Page
    'landing.title': 'Book Your Perfect',
    'landing.subtitle': 'Football Field',
    'landing.description': 'Connect with the best football fields in your area. Easy booking, professional facilities, unforgettable matches.',
    'landing.chooseRole': 'Choose Your Role',
    'landing.chooseRoleDesc': 'Select how you want to use our platform and start your football field booking experience.',
    'landing.customer': 'Customer',
    'landing.customerDesc': 'Browse and book football fields in your area. Find the perfect spot for your next match or training session.',
    'landing.owner': 'Field Owner',
    'landing.ownerDesc': 'List your sports facilities and manage bookings. Grow your business with our professional platform.',
    'landing.haveAccount': 'Already have an account?',
    'landing.loginHere': 'Login here',
    'landing.welcome': 'Welcome',
    'landing.back': 'Back',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.loggingIn': 'Logging in...',
    'auth.signingUp': 'Signing up...',
    'auth.accountType': 'Account Type',
    'auth.customerRole': 'Customer - Book football fields',
    'auth.ownerRole': 'Field Owner - Manage your fields',
    'auth.loginTitle': 'Login',
    'auth.signupTitle': 'Create New Account',
    'auth.createAccount': 'Create New Account',
    'auth.backToHome': 'Back to Home',
    'auth.logoutSuccess': 'Logged out successfully',
    
    // Customer Dashboard
    'customer.findField': 'Find Your Perfect Field',
    'customer.discoverFields': 'Discover premium football fields in your area and book instantly',
    'customer.searchPlaceholder': 'Search for fields...',
    'customer.locationPlaceholder': 'Location...',
    'customer.filter': 'Filter',
    'customer.availableFields': 'Available Fields',
    'customer.sortByPrice': 'Sort by Price',
    'customer.sortByRating': 'Sort by Rating',
    'customer.sortByDistance': 'Sort by Distance',
    'customer.loadingFailed': 'Failed to load fields',
    'customer.retry': 'Retry',
    'customer.noFields': 'No fields available yet',
    'customer.noMatchingFields': 'No fields match your criteria',
    'customer.clearFilter': 'Clear Filter',
    
    // Owner Dashboard
    'owner.dashboard': 'Owner Dashboard',
    'owner.manageFields': 'Manage your fields and bookings',
    'owner.addField': 'Add New Field',
    'owner.totalFields': 'Total Fields',
    'owner.totalBookings': 'Total Bookings',
    'owner.pendingBookings': 'Pending Bookings',
    'owner.revenue': 'Revenue',
    'owner.myFields': 'My Fields',
    'owner.bookings': 'Bookings',
    'owner.pending': 'Pending',
    'owner.confirmed': 'Confirmed',
    'owner.all': 'All',
    'owner.fieldName': 'Field Name',
    'owner.location': 'Location',
    'owner.price': 'Price',
    'owner.status': 'Status',
    'owner.actions': 'Actions',
    'owner.active': 'Active',
    'owner.edit': 'Edit',
    'owner.delete': 'Delete',
    'owner.noFields': 'No fields yet',
    'owner.addFirstField': 'Start by adding your first field',
    'owner.customer': 'Customer',
    'owner.date': 'Date',
    'owner.time': 'Time',
    'owner.amount': 'Amount',
    'owner.confirm': 'Confirm',
    'owner.confirming': 'Confirming...',
    'owner.noBookings': 'No bookings',
    'owner.bookingsWillAppear': 'Bookings will appear here',
    
    // Toast Messages
    'toast.loginSuccess': 'Welcome back!',
    'toast.loginSuccessDesc': 'You have logged in successfully.',
    'toast.loginFailed': 'Login failed',
    'toast.signupSuccess': 'Account created!',
    'toast.signupSuccessDesc': 'Please check your email to verify your account.',
    'toast.signupFailed': 'Sign up failed',
    'toast.validationError': 'Validation error',
    'toast.confirmSuccess': 'Confirmed successfully',
    'toast.confirmSuccessDesc': 'Booking confirmed successfully',
    'toast.confirmFailed': 'Confirmation failed',
    'toast.confirmFailedDesc': 'Failed to confirm booking, please try again',
    
    // Common
    'common.loading': 'Loading...',
    'common.bookNow': 'Book Now',
    'common.perHour': 'SAR/hour',
    'common.sar': 'SAR',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  isRTL: false,
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('language') as Language;
    if (stored === 'ar' || stored === 'en') {
      return stored;
    }
    
    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ar')) {
      return 'ar';
    }
    
    // Default to English
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
