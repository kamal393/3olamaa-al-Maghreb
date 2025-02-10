// بيانات التطبيق
const app = {
    currentLang: 'ar',
    countries: [],
    cities: {},
    selectedCountry: '',
    selectedCity: ''
};

// إعدادات API
const API_ENDPOINTS = {
    COUNTRIES: 'https://restcountries.com/v3.1/all',
    PRAYER_TIMES: (country, city) => 
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5`
};

// نظام الترجمة
const translations = {
    ar: {
        appTitle: "مواقيت الصلاة",
        selectCountry: "اختر الدولة",
        selectCity: "اختر المدينة",
        updateButton: "عرض الأوقات",
        prayerTimesTitle: "أوقات الصلاة اليوم",
        fajr: "الفجر",
        sunrise: "الشروق",
        dhuhr: "الظهر",
        asr: "العصر",
        maghrib: "المغرب",
        isha: "العشاء"
    },
    en: {
        appTitle: "Prayer Times",
        selectCountry: "Select Country",
        selectCity: "Select City",
        updateButton: "Show Times",
        prayerTimesTitle: "Today's Prayer Times",
        fajr: "Fajr",
        sunrise: "Sunrise",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha"
    }
};

// تهيئة التطبيق
async function initializeApp() {
    await loadCountries();
    loadCities();
    setupEventListeners();
    updateUI();
}

// تحميل قائمة الدول
async function loadCountries() {
    try {
        const response = await fetch(API_ENDPOINTS.COUNTRIES);
        const data = await response.json();
        app.countries = data.map(country => ({
            code: country.cca2,
            name: country.translations.ara?.common || country.name.common
        }));
        populateCountries();
    } catch (error) {
        console.error('خطأ في تحميل الدول:', error);
    }
}

// تحميل بيانات المدن (من ملف محلي)
function loadCities() {
    app.cities = {
        SA: ["مكة", "المدينة المنورة", "الرياض", "جدة"],
        EG: ["القاهرة", "الإسكندرية", "الجيزة", "الأقصر"],
        AE: ["دبي", "أبو ظبي", "الشارقة", "عجمان"],
        TR: ["إسطنبول", "أنقرة", "إزمير", "بورصة"],
        US: ["نيويورك", "لوس أنجلوس", "شيكاغو", "هيوستن"]
     
    };
}

// تعبئة قائمة الدول
function populateCountries() {
    const countrySelect = document.getElementById('country');
    countrySelect.innerHTML = '<option value="">-- اختر الدولة --</option>';
    
    app.countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });
}

// تحديث قائمة المدن
function updateCities(countryCode) {
    const citySelect = document.getElementById('city');
    citySelect.innerHTML = '<option value="">-- اختر المدينة --</option>';
    
    if (app.cities[countryCode]) {
        app.cities[countryCode].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// تحديث واجهة المستخدم
function updateUI() {
    // اتجاه النص
    document.documentElement.dir = app.currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // تحديث جميع النصوص
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translations[app.currentLang][key];
    });
}

// جلب أوقات الصلاة
async function getPrayerTimes() {
    try {
        const response = await fetch(
            API_ENDPOINTS.PRAYER_TIMES(app.selectedCountry, app.selectedCity)
        );
        
        if (!response.ok) throw new Error('خطأ في الاتصال');
        
        const data = await response.json();
        
        if (data.code === 200) {
            const timings = data.data.timings;
            document.getElementById('fajr').textContent = timings.Fajr;
            document.getElementById('sunrise').textContent = timings.Sunrise;
            document.getElementById('dhuhr').textContent = timings.Dhuhr;
            document.getElementById('asr').textContent = timings.Asr;
            document.getElementById('maghrib').textContent = timings.Maghrib;
            document.getElementById('isha').textContent = timings.Isha;
        }
    } catch (error) {
        console.error('حدث خطأ:', error);
        alert('⚠️ تعذر الحصول على البيانات. يرجى المحاولة لاحقًا');
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // تغيير الدولة
    document.getElementById('country').addEventListener('change', (e) => {
        app.selectedCountry = e.target.value;
        updateCities(app.selectedCountry);
    });

    // تغيير المدينة
    document.getElementById('city').addEventListener('change', (e) => {
        app.selectedCity = e.target.value;
    });

    // زر التحديث
    document.getElementById('update-btn').addEventListener('click', () => {
        if (app.selectedCountry && app.selectedCity) {
            getPrayerTimes();
        } else {
            alert(app.currentLang === 'ar' 
                ? '❗ الرجاء اختيار الدولة والمدينة أولاً' 
                : '❗ Please select country and city first');
        }
    });

    // تغيير اللغة
    document.getElementById('lang-ar').addEventListener('click', () => {
        app.currentLang = 'ar';
        updateUI();
    });

    document.getElementById('lang-en').addEventListener('click', () => {
        app.currentLang = 'en';
        updateUI();
    });
}

// بدء التشغيل
initializeApp();