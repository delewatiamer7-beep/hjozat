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
    'nav.switchingRole': 'جاري تسجيل الخروج...',
    'nav.switchRoleSuccess': 'تم تسجيل الخروج بنجاح',
    'nav.switchRoleSuccessDesc': 'يرجى اختيار دورك وتسجيل الدخول.',
    'nav.dashboard': 'الذهاب إلى لوحة التحكم',
    'nav.logout': 'تسجيل الخروج',
    'nav.backToHome': 'العودة إلى الصفحة الرئيسية',
    'nav.toggleTheme': 'الوضع الفاتح/الداكن',
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
    'landing.returnToOwnerDashboard': 'العودة إلى لوحة تحكم المالك',
    'landing.returnToBrowsePlaygrounds': 'العودة إلى تصفح الملاعب',
    
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
    'common.continueAs': 'متابعة كـ',
    
    // Field Management
    'field.addNew': 'إضافة ملعب جديد',
    'field.edit': 'تعديل الملعب',
    'field.name': 'اسم الملعب',
    'field.nameRequired': 'اسم الملعب مطلوب',
    'field.nameMaxLength': 'يجب أن يكون الاسم أقل من 100 حرف',
    'field.placeholder': 'مثال: ملعب كرة القدم أ',
    'field.description': 'وصف الملعب',
    'field.descriptionPlaceholder': 'صف ملعبك، المرافق، وأي ميزات خاصة...',
    'field.creating': 'جاري الإنشاء...',
    'field.create': 'إنشاء ملعب',
    'field.type': 'نوع الملعب',
    'field.footballField': 'ملعب كرة قدم',
    'field.deleteConfirm': 'هل أنت متأكد من حذف هذا الملعب؟ لا يمكن التراجع عن هذا الإجراء.',
    'field.notFound': 'الملعب غير موجود',
    'field.location': 'الموقع',
    'field.locationRequired': 'الموقع مطلوب',
    'field.locationMaxLength': 'يجب أن يكون الموقع أقل من 100 حرف',
    'field.locationPlaceholder': 'مثال: المركز الرياضي وسط المدينة',
    'field.address': 'العنوان',
    'field.addressMaxLength': 'يجب أن يكون العنوان أقل من 200 حرف',
    'field.addressPlaceholder': 'مثال: 123 شارع الرياضة، المدينة، المحافظة',
    'field.descriptionMaxLength': 'يجب أن يكون الوصف أقل من 500 حرف',
    'field.price': 'السعر لكل حجز ($)',
    'field.priceMin': 'يجب أن يكون السعر أكبر من 0',
    'field.priceMax': 'يجب أن يكون السعر معقولاً',
    'field.pricePlaceholder': '50.00',
    'field.operatingHours': 'ساعات العمل',
    'field.operatingHoursMaxLength': 'يجب أن تكون ساعات العمل أقل من 50 حرف',
    'field.operatingHoursPlaceholder': '6:00 صباحاً - 10:00 مساءً',
    'field.cancel': 'إلغاء',
    'field.save': 'حفظ التغييرات',
    'field.saving': 'جاري الحفظ...',
    'field.editButton': 'تعديل',
    'field.deleteButton': 'حذف',
    'field.backToBrowse': 'العودة للتصفح',
    'field.view': 'منظر',
    'field.reviews': 'تقييمات',
    'field.amenities': 'المرافق',
    'field.professionalGrade': 'درجة احترافية',
    'field.upToPlayers': 'حتى 22 لاعب',
    'field.minBooking': 'الحد الأدنى للحجز',
    'field.oneHour': 'ساعة واحدة',
    'field.cancellation': 'الإلغاء',
    'field.cancellationPolicy': '24 ساعة قبل',
    'field.payment': 'الدفع',
    'field.paymentOnArrival': 'عند الوصول',
    'field.comingSoon': 'قريباً!',
    'field.contactFeature': 'ميزة التواصل ستكون متاحة قريباً.',
    'field.bookings': 'حجوزات',
    'field.recentBookings': 'الحجوزات الأخيرة',
    'field.all': 'الكل',
    'field.pending': 'قيد الانتظار',
    
    // Calendar
    'calendar.title': 'تقويم الحجوزات',
    'calendar.available': 'متاح',
    'calendar.booked': 'محجوز',
    'calendar.pending': 'قيد الانتظار',
    'calendar.selected': 'المحدد',
    'calendar.selectedSlot': 'الموعد المحدد',
    'calendar.past': 'موعد سابق',
    'calendar.clickToBook': 'انقر للحجز',
    
    // Booking
    'booking.title': 'احجز ملعبك',
    'booking.customerName': 'اسم العميل',
    'booking.customerNameRequired': 'اسم العميل مطلوب',
    'booking.customerNameMaxLength': 'يجب أن يكون الاسم أقل من 100 حرف',
    'booking.fillDetails': 'املأ بياناتك لحجز هذا الملعب',
    'booking.pendingNote': 'سيكون حجزك قيد الانتظار حتى يتم تأكيده من قبل مالك الملعب',
    'booking.success': 'تم إرسال طلب الحجز',
    'booking.successDesc': 'تم إرسال طلب الحجز إلى مالك الملعب. ستتلقى تأكيداً قريباً.',
    'booking.backToDetails': 'العودة لتفاصيل الملعب',
    'booking.contactOwner': 'تواصل مع المالك',
    'booking.complete': 'أكمل حجزك',
    'booking.contactInfo': 'معلومات الاتصال',
    'booking.fullName': 'الاسم الكامل',
    'booking.fullNamePlaceholder': 'أدخل اسمك الكامل',
    'booking.phone': 'رقم الهاتف',
    'booking.phonePlaceholder': 'أدخل رقم هاتفك',
    'booking.phoneRequired': 'رقم هاتف صحيح مطلوب',
    'booking.phoneMaxLength': 'يجب أن يكون رقم الهاتف أقل من 20 رقم',
    'booking.phoneMinLength': 'رقم هاتف صحيح مطلوب',
    'booking.selectDateTime': 'اختر التاريخ والوقت',
    'booking.date': 'التاريخ',
    'booking.dateRequired': 'يرجى اختيار التاريخ',
    'booking.selectDate': 'اختر التاريخ',
    'booking.time': 'الوقت',
    'booking.timeRequired': 'يرجى اختيار الوقت',
    'booking.confirm': 'تأكيد الحجز',
    'booking.sending': 'جاري إرسال الحجز...',
    'booking.sent': 'تم إرسال الحجز!',
    'booking.failed': 'فشل الحجز',
    'booking.failedDesc': 'حدث خطأ أثناء إرسال حجزك. يرجى المحاولة مرة أخرى.',
    'booking.summary': 'ملخص الحجز',
    'booking.total': 'الإجمالي',
    'booking.perBooking': 'حجز',
    
    // Auth Page
    'authPage.title': 'حجز ملاعب كرة القدم',
    'authPage.subtitle': 'سجل دخولك أو أنشئ حساباً جديداً',
    'authPage.loginTab': 'تسجيل الدخول',
    'authPage.signupTab': 'إنشاء حساب',
    'authPage.emailPlaceholder': 'أدخل بريدك الإلكتروني',
    'authPage.passwordPlaceholder': 'أدخل كلمة المرور',
    'authPage.namePlaceholder': 'أدخل اسمك الكامل',
    'authPage.passwordSignupPlaceholder': 'أنشئ كلمة مرور (6 أحرف على الأقل)',
    'authPage.selectRole': 'اختر دورك',
    'authPage.backToHome': 'العودة للرئيسية',
    'authPage.loggingIn': 'جاري تسجيل الدخول...',
    'authPage.signingUp': 'جاري إنشاء الحساب...',
    'authPage.loginButton': 'تسجيل الدخول',
    'authPage.signupButton': 'إنشاء حساب',
    'authPage.loginFailed': 'فشل تسجيل الدخول',
    'authPage.signupFailed': 'فشل إنشاء الحساب',
    'authPage.signupSuccess': 'تم إنشاء الحساب!',
    'authPage.signupSuccessDesc': 'يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك.',
    'authPage.loginSuccess': 'مرحباً بعودتك!',
    'authPage.loginSuccessDesc': 'تم تسجيل دخولك بنجاح.',
    'authPage.validationError': 'خطأ في التحقق',
    'authPage.emailInvalid': 'عنوان البريد الإلكتروني غير صالح',
    'authPage.passwordMin': 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    'authPage.nameMin': 'يجب أن يكون الاسم حرفين على الأقل',
  },
  en: {
    // Navigation
    'nav.switchRole': 'Switch Role',
    'nav.switchingRole': 'Logging out...',
    'nav.switchRoleSuccess': 'Logged out successfully',
    'nav.switchRoleSuccessDesc': 'Please select your role and log in.',
    'nav.dashboard': 'Go to Dashboard',
    'nav.logout': 'Logout',
    'nav.backToHome': 'Back to Home',
    'nav.toggleTheme': 'Light/Dark Mode',
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
    'landing.returnToOwnerDashboard': 'Return to Owner Dashboard',
    'landing.returnToBrowsePlaygrounds': 'Return to Browse Playgrounds',
    
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
    'common.continueAs': 'Continue as',
    
    // Field Management
    'field.addNew': 'Add New Field',
    'field.edit': 'Edit Field',
    'field.name': 'Field Name',
    'field.nameRequired': 'Field name is required',
    'field.nameMaxLength': 'Name must be less than 100 characters',
    'field.placeholder': 'Example: Football Field A',
    'field.description': 'Field Description',
    'field.descriptionPlaceholder': 'Describe your field, facilities, and any special features...',
    'field.creating': 'Creating...',
    'field.create': 'Create Field',
    'field.type': 'Field Type',
    'field.footballField': 'Football Field',
    'field.deleteConfirm': 'Are you sure you want to delete this field? This action cannot be undone.',
    'field.notFound': 'Field not found',
    'field.location': 'Location',
    'field.locationRequired': 'Location is required',
    'field.locationMaxLength': 'Location must be less than 100 characters',
    'field.locationPlaceholder': 'Example: Downtown Sports Center',
    'field.address': 'Address',
    'field.addressMaxLength': 'Address must be less than 200 characters',
    'field.addressPlaceholder': 'Example: 123 Sports Street, City, State',
    'field.descriptionMaxLength': 'Description must be less than 500 characters',
    'field.price': 'Price per Booking ($)',
    'field.priceMin': 'Price must be greater than 0',
    'field.priceMax': 'Price must be reasonable',
    'field.pricePlaceholder': '50.00',
    'field.operatingHours': 'Operating Hours',
    'field.operatingHoursMaxLength': 'Operating hours must be less than 50 characters',
    'field.operatingHoursPlaceholder': '6:00 AM - 10:00 PM',
    'field.cancel': 'Cancel',
    'field.save': 'Save Changes',
    'field.saving': 'Saving...',
    'field.editButton': 'Edit',
    'field.deleteButton': 'Delete',
    'field.backToBrowse': 'Back to Browse',
    'field.view': 'View',
    'field.reviews': 'reviews',
    'field.amenities': 'Amenities',
    'field.professionalGrade': 'Professional Grade',
    'field.upToPlayers': 'Up to 22 players',
    'field.minBooking': 'Minimum Booking',
    'field.oneHour': 'One Hour',
    'field.cancellation': 'Cancellation',
    'field.cancellationPolicy': '24 hours before',
    'field.payment': 'Payment',
    'field.paymentOnArrival': 'On arrival',
    'field.comingSoon': 'Coming soon!',
    'field.contactFeature': 'Contact feature will be available soon.',
    'field.bookings': 'bookings',
    'field.recentBookings': 'Recent Bookings',
    'field.all': 'All',
    'field.pending': 'Pending',
    
    // Calendar
    'calendar.title': 'Booking Calendar',
    'calendar.available': 'Available',
    'calendar.booked': 'Booked',
    'calendar.pending': 'Pending',
    'calendar.selected': 'Selected',
    'calendar.selectedSlot': 'Selected Slot',
    'calendar.past': 'Past slot',
    'calendar.clickToBook': 'Click to book',
    
    // Booking
    'booking.title': 'Book Your Field',
    'booking.customerName': 'Customer Name',
    'booking.customerNameRequired': 'Customer name is required',
    'booking.customerNameMaxLength': 'Name must be less than 100 characters',
    'booking.fillDetails': 'Fill in your details to book this field',
    'booking.pendingNote': 'Your booking will be pending until confirmed by the field owner',
    'booking.success': 'Booking request sent',
    'booking.successDesc': 'Booking request sent to field owner. You will receive confirmation soon.',
    'booking.backToDetails': 'Back to field details',
    'booking.contactOwner': 'Contact Owner',
    'booking.complete': 'Complete Your Booking',
    'booking.contactInfo': 'Contact Information',
    'booking.fullName': 'Full Name',
    'booking.fullNamePlaceholder': 'Enter your full name',
    'booking.phone': 'Phone Number',
    'booking.phonePlaceholder': 'Enter your phone number',
    'booking.phoneRequired': 'Valid phone number required',
    'booking.phoneMaxLength': 'Phone number must be less than 20 digits',
    'booking.phoneMinLength': 'Valid phone number required',
    'booking.selectDateTime': 'Select Date & Time',
    'booking.date': 'Date',
    'booking.dateRequired': 'Please select a date',
    'booking.selectDate': 'Select date',
    'booking.time': 'Time',
    'booking.timeRequired': 'Please select a time',
    'booking.confirm': 'Confirm Booking',
    'booking.sending': 'Sending booking...',
    'booking.sent': 'Booking sent!',
    'booking.failed': 'Booking failed',
    'booking.failedDesc': 'An error occurred while sending your booking. Please try again.',
    'booking.summary': 'Booking Summary',
    'booking.total': 'Total',
    'booking.perBooking': 'booking',
    
    // Auth Page
    'authPage.title': 'Football Field Booking',
    'authPage.subtitle': 'Login or create a new account',
    'authPage.loginTab': 'Login',
    'authPage.signupTab': 'Sign Up',
    'authPage.emailPlaceholder': 'Enter your email',
    'authPage.passwordPlaceholder': 'Enter your password',
    'authPage.namePlaceholder': 'Enter your full name',
    'authPage.passwordSignupPlaceholder': 'Create a password (min 6 characters)',
    'authPage.selectRole': 'Select your role',
    'authPage.backToHome': 'Back to Home',
    'authPage.loggingIn': 'Logging in...',
    'authPage.signingUp': 'Signing up...',
    'authPage.loginButton': 'Login',
    'authPage.signupButton': 'Sign Up',
    'authPage.loginFailed': 'Login failed',
    'authPage.signupFailed': 'Sign up failed',
    'authPage.signupSuccess': 'Account created!',
    'authPage.signupSuccessDesc': 'Please check your email to verify your account.',
    'authPage.loginSuccess': 'Welcome back!',
    'authPage.loginSuccessDesc': 'You have logged in successfully.',
    'authPage.validationError': 'Validation error',
    'authPage.emailInvalid': 'Invalid email address',
    'authPage.passwordMin': 'Password must be at least 6 characters',
    'authPage.nameMin': 'Name must be at least 2 characters',
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
