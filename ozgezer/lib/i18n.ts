export const locales = ["uz", "ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uz";

type NavMessages = {
  home: string;
  explore: string;
  regions: string;
  admin: string;
  openExplore: string;
};

type FooterMessages = {
  description: string;
};

type HomeMessages = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  searchPlaceholder: string;
  regionPlaceholder: string;
  searchButton: string;
  categoriesEyebrow: string;
  categoriesTitle: string;
  categoriesDescription: string;
  regionsEyebrow: string;
  regionsTitle: string;
  regionsDescription: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredButton: string;
  adminEyebrow: string;
  adminTitle: string;
  adminDescription: string;
  adminPoints: string[];
};

type RegionsMessages = {
  title: string;
  description: string;
  backToRegions: string;
  highlights: string;
  overview: string;
  practicalInfo: string;
  exploreRegion: string;
  statsPlaces: string;
  statsFocus: string;
};

type AdminMessages = {
  loginTitle: string;
  loginDescription: string;
  emailLabel: string;
  passwordLabel: string;
  submit: string;
  invalid: string;
  dashboardTitle: string;
  dashboardDescription: string;
  policyTitle: string;
  policyDescription: string;
  signOut: string;
};

type ExploreMessages = {
  title: string;
  description: string;
  searchPlaceholder: string;
  searchButton: string;
  allRegions: string;
  allCategories: string;
  noResults: string;
  resetFilters: string;
  resultCount: string;
  openDetails: string;
  filterRegion: string;
  filterCategory: string;
};

type PlaceMessages = {
  backToExplore: string;
  aboutPlace: string;
  practicalInfo: string;
  categoryLabel: string;
  regionLabel: string;
  priceLabel: string;
  hoursLabel: string;
  ratingLabel: string;
  coordinatesLabel: string;
  relatedPlaces: string;
};

type Messages = {
  nav: NavMessages;
  footer: FooterMessages;
  home: HomeMessages;
  regions: RegionsMessages;
  admin: AdminMessages;
  explore: ExploreMessages;
  place: PlaceMessages;
};

const messages: Record<Locale, Messages> = {
  uz: {
    nav: {
      home: "Bosh sahifa",
      explore: "Explore",
      regions: "Viloyatlar",
      admin: "Admin",
      openExplore: "Joylarni ko'rish",
    },
    footer: {
      description:
        "O'zbekiston bo'ylab joylarni topish, solishtirish va saqlash uchun tayyorlanayotgan platforma.",
    },
    home: {
      eyebrow: "O'zbekiston bo'ylab kashfiyot",
      title: "Qaysi viloyatga borsangiz ham,",
      titleAccent: " arzigulik joyni ",
      description:
        "O'zGezer turistlar va mahalliy sayohatchilar uchun haqiqiy izohlar, reytinglar va xarita asosida joylarni topishga yordam beradi.",
      searchPlaceholder: "Masalan: Registon, Chimgan, Ichan-Qal'a...",
      regionPlaceholder: "Viloyat tanlang",
      searchButton: "Qidirish",
      categoriesEyebrow: "Asosiy kategoriyalar",
      categoriesTitle: "Odamlar eng ko'p nimani qidiradi?",
      categoriesDescription:
        "MVP bosh sahifasi uchun boshlang'ich kategoriyalar hozir tayyor. Keyingi bosqichda ular explore filterlariga ulanadi.",
      regionsEyebrow: "Region bo'yicha izlash",
      regionsTitle: "Sayohatni viloyatdan boshlang",
      regionsDescription:
        "Har bir viloyat uchun qisqacha tavsif, asosiy yo'nalish va namunaviy joylar qo'shildi. Endi bu bo'lim real ma'lumot bilan ishlaydi.",
      featuredEyebrow: "Tanlangan joylar",
      featuredTitle: "Bosh sahifa uchun namunaviy kartochkalar",
      featuredButton: "Batafsil sahifa",
      adminEyebrow: "Keyingi texnik qadamlar",
      adminTitle: "Kontent boshqaruvi faqat admin qo'lida bo'ladi",
      adminDescription:
        "Public foydalanuvchilar joylarni ko'radi. Qo'shish, tahrirlash va o'chirish huquqi esa faqat admin sessiyasi orqali beriladi.",
      adminPoints: [
        "Prisma va PostgreSQL ulanishi",
        "14 viloyat va kategoriyalarni seed qilish",
        "Admin panelga protected kirish",
        "Place CRUD ni keyingi qadamda faqat admin uchun ochish",
      ],
    },
    regions: {
      title: "Viloyatlar",
      description: "O'zbekistonning asosiy sayohat yo'nalishlari va ular haqidagi qisqacha ma'lumotlar.",
      backToRegions: "Barcha viloyatlarga qaytish",
      highlights: "Asosiy yo'nalishlar",
      overview: "Viloyat haqida",
      practicalInfo: "Amaliy ko'rsatkichlar",
      exploreRegion: "Viloyat sahifasini ko'rish",
      statsPlaces: "namuna joy",
      statsFocus: "Asosiy yo'nalish",
    },
    admin: {
      loginTitle: "Admin kirishi",
      loginDescription:
        "Joylar va ma'lumotlarni boshqarish faqat admin orqali ishlaydi. Login uchun `.env.local` dagi admin ma'lumotlari ishlatiladi.",
      emailLabel: "Admin email",
      passwordLabel: "Parol",
      submit: "Kirish",
      invalid: "Email yoki parol noto'g'ri.",
      dashboardTitle: "Admin boshqaruv paneli",
      dashboardDescription:
        "Hozircha public ma'lumotlar statik qatlamda turibdi. Keyingi bosqichda shu dashboard Prisma orqali real CRUD bilan ulanadi.",
      policyTitle: "Kontent siyosati",
      policyDescription:
        "Joy, viloyat va boshqa katalog ma'lumotlarini qo'shish yoki olib tashlash huquqi faqat admin foydalanuvchiga tegishli.",
      signOut: "Chiqish",
    },
    explore: {
      title: "Joylarni izlash",
      description: "Region, kategoriya va kalit so'z orqali katalog bo'ylab qidiring.",
      searchPlaceholder: "Joy nomi yoki tavsifdan qidiring...",
      searchButton: "Filterlash",
      allRegions: "Barcha viloyatlar",
      allCategories: "Barcha kategoriyalar",
      noResults: "Tanlangan filterlarga mos joy topilmadi.",
      resetFilters: "Filterni tozalash",
      resultCount: "ta natija",
      openDetails: "Batafsil ko'rish",
      filterRegion: "Viloyat",
      filterCategory: "Kategoriya",
    },
    place: {
      backToExplore: "Explore sahifasiga qaytish",
      aboutPlace: "Joy haqida",
      practicalInfo: "Amaliy ma'lumot",
      categoryLabel: "Kategoriya",
      regionLabel: "Viloyat",
      priceLabel: "Narx",
      hoursLabel: "Ish vaqti",
      ratingLabel: "Reyting",
      coordinatesLabel: "Koordinatalar",
      relatedPlaces: "O'xshash joylar",
    },
  },
  ru: {
    nav: {
      home: "Главная",
      explore: "Explore",
      regions: "Регионы",
      admin: "Админ",
      openExplore: "Смотреть места",
    },
    footer: {
      description: "Платформа для поиска, сравнения и сохранения интересных мест по всему Узбекистану.",
    },
    home: {
      eyebrow: "Путешествие по Узбекистану",
      title: "Куда бы вы ни поехали,",
      titleAccent: " найдите стоящее место ",
      description:
        "O'zGezer помогает туристам и местным жителям находить места по отзывам, рейтингам и карте.",
      searchPlaceholder: "Например: Регистан, Чимган, Ичан-Кала...",
      regionPlaceholder: "Выберите регион",
      searchButton: "Искать",
      categoriesEyebrow: "Основные категории",
      categoriesTitle: "Что люди ищут чаще всего?",
      categoriesDescription:
        "Стартовые категории для MVP уже готовы. На следующем этапе они будут подключены к фильтрам explore.",
      regionsEyebrow: "Поиск по регионам",
      regionsTitle: "Начните маршрут с региона",
      regionsDescription:
        "Для каждого региона уже добавлены краткое описание, туристический фокус и примерные места.",
      featuredEyebrow: "Избранные места",
      featuredTitle: "Пример карточек для главной страницы",
      featuredButton: "Открыть подробнее",
      adminEyebrow: "Следующие технические шаги",
      adminTitle: "Управление контентом будет только у админа",
      adminDescription:
        "Обычные пользователи могут только смотреть каталог. Право добавления, редактирования и удаления будет доступно только через админ-сессию.",
      adminPoints: [
        "Подключение Prisma и PostgreSQL",
        "Сидирование 14 регионов и категорий",
        "Защищенный вход в админ-панель",
        "Открытие Place CRUD только для админа",
      ],
    },
    regions: {
      title: "Регионы",
      description: "Основные туристические направления Узбекистана и краткая информация о них.",
      backToRegions: "Назад ко всем регионам",
      highlights: "Ключевые направления",
      overview: "О регионе",
      practicalInfo: "Практические показатели",
      exploreRegion: "Открыть страницу региона",
      statsPlaces: "пример мест",
      statsFocus: "Главный фокус",
    },
    admin: {
      loginTitle: "Вход администратора",
      loginDescription:
        "Управление местами и данными доступно только админу. Для входа используются значения из `.env.local`.",
      emailLabel: "Email администратора",
      passwordLabel: "Пароль",
      submit: "Войти",
      invalid: "Неверный email или пароль.",
      dashboardTitle: "Панель управления администратора",
      dashboardDescription:
        "Пока публичные данные находятся в статическом слое. На следующем этапе эта панель будет связана с реальным CRUD через Prisma.",
      policyTitle: "Политика контента",
      policyDescription:
        "Право добавлять или удалять места, регионы и другие каталожные данные принадлежит только админу.",
      signOut: "Выйти",
    },
    explore: {
      title: "Поиск мест",
      description: "Ищите по каталогу через регион, категорию и ключевые слова.",
      searchPlaceholder: "Искать по названию или описанию...",
      searchButton: "Применить",
      allRegions: "Все регионы",
      allCategories: "Все категории",
      noResults: "По выбранным фильтрам ничего не найдено.",
      resetFilters: "Сбросить фильтры",
      resultCount: "результатов",
      openDetails: "Открыть подробнее",
      filterRegion: "Регион",
      filterCategory: "Категория",
    },
    place: {
      backToExplore: "Назад к explore",
      aboutPlace: "О месте",
      practicalInfo: "Практическая информация",
      categoryLabel: "Категория",
      regionLabel: "Регион",
      priceLabel: "Цена",
      hoursLabel: "Часы работы",
      ratingLabel: "Рейтинг",
      coordinatesLabel: "Координаты",
      relatedPlaces: "Похожие места",
    },
  },
  en: {
    nav: {
      home: "Home",
      explore: "Explore",
      regions: "Regions",
      admin: "Admin",
      openExplore: "Browse places",
    },
    footer: {
      description: "A platform for discovering, comparing, and saving interesting places across Uzbekistan.",
    },
    home: {
      eyebrow: "Discover Uzbekistan",
      title: "Wherever you travel,",
      titleAccent: " find the place worth visiting ",
      description:
        "O'zGezer helps tourists and locals discover places through trusted reviews, ratings, and map-first browsing.",
      searchPlaceholder: "For example: Registan, Chimgan, Ichan-Kala...",
      regionPlaceholder: "Choose a region",
      searchButton: "Search",
      categoriesEyebrow: "Core categories",
      categoriesTitle: "What are people searching for most?",
      categoriesDescription:
        "The starting MVP categories are ready. In the next step they will be connected to explore filters.",
      regionsEyebrow: "Browse by region",
      regionsTitle: "Start your trip from a region",
      regionsDescription:
        "Each region now has a short description, travel focus, and sample places so this section is no longer empty.",
      featuredEyebrow: "Featured places",
      featuredTitle: "Sample cards for the homepage",
      featuredButton: "Open details",
      adminEyebrow: "Next technical steps",
      adminTitle: "Content management will stay admin-only",
      adminDescription:
        "Public users can browse the catalog. Adding, editing, and deleting data will only be available through an admin session.",
      adminPoints: [
        "Prisma and PostgreSQL integration",
        "Seeding 14 regions and categories",
        "Protected admin access",
        "Opening place CRUD for admin only",
      ],
    },
    regions: {
      title: "Regions",
      description: "Main travel regions of Uzbekistan and short practical information about each one.",
      backToRegions: "Back to all regions",
      highlights: "Key highlights",
      overview: "About the region",
      practicalInfo: "Practical stats",
      exploreRegion: "Open region page",
      statsPlaces: "sample places",
      statsFocus: "Travel focus",
    },
    admin: {
      loginTitle: "Admin sign in",
      loginDescription:
        "Place and catalog management is available only to the admin. The login uses values from `.env.local`.",
      emailLabel: "Admin email",
      passwordLabel: "Password",
      submit: "Sign in",
      invalid: "Invalid email or password.",
      dashboardTitle: "Admin dashboard",
      dashboardDescription:
        "Public data currently lives in a static layer. In the next step this dashboard will be connected to real Prisma CRUD.",
      policyTitle: "Content policy",
      policyDescription: "Only the admin can add or remove places, regions, and other catalog records.",
      signOut: "Sign out",
    },
    explore: {
      title: "Explore places",
      description: "Search the catalog by region, category, and keywords.",
      searchPlaceholder: "Search by place name or description...",
      searchButton: "Apply filters",
      allRegions: "All regions",
      allCategories: "All categories",
      noResults: "No places matched the selected filters.",
      resetFilters: "Reset filters",
      resultCount: "results",
      openDetails: "Open details",
      filterRegion: "Region",
      filterCategory: "Category",
    },
    place: {
      backToExplore: "Back to explore",
      aboutPlace: "About the place",
      practicalInfo: "Practical information",
      categoryLabel: "Category",
      regionLabel: "Region",
      priceLabel: "Price",
      hoursLabel: "Opening hours",
      ratingLabel: "Rating",
      coordinatesLabel: "Coordinates",
      relatedPlaces: "Related places",
    },
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
