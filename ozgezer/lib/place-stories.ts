export type PlaceFact = {
  title: string;
  body: string;
};

export type PlaceSection = {
  emoji: string;
  heading: string;
  facts: PlaceFact[];
};

export type PlaceStory = {
  quote: { uz: string; ru: string; en: string };
  heroTitle: string;
  sections: PlaceSection[];
};

/** Rasm fayllari /public/places/ papkasida bo'lishi kerak */
export const PLACE_IMAGES: Record<string, string> = {
  "chimgan":        "/places/chimgan.jpg",
  "ark-fortress":   "/places/ark-fortress.jpg",
  "itchan-kala":    "/places/itchan-kala.jpg",
  "registon":       "/places/registan.jpg",
  "shahrisabz":     "/places/shahrisabz.jpg",
  "aydarkul":       "/places/aydarkul.webp",
  "nurota":         "/places/nurota.jpg",
  "shohi-zinda":          "/places/shohi-zinda.jpg",
  "bibi-xonim":           "/places/bibi-xonim.jpg",
  "ulugbek-rasadxonasi":  "/places/ulugbek-rasadxonasi.jpg",
  "minorai-kalon":        "/places/minorai-kalon.jpg",
  "labihovuz":            "/places/labihovuz.jpg",
  "sitorai-mohi-xosa":    "/places/sitorai-mohi-xosa.jpg",
  "kalta-minor":          "/places/kalta-minor.jpg",
  "islomxoja-minorasi":   "/places/islomxoja-minorasi.jpg",
  "tosh-hovli":           "/places/tosh-hovli.jpg",
  "chorvoq":              "/places/chorvoq.jpg",
  "amirsoy":              "/places/amirsoy.jpg",
  "chorsu-bozori":        "/places/chorsu-bozori.jpg",
};

/**
 * Har joy uchun galereya rasmlari ro'yxati.
 * Ko'proq rasm qo'shmoqchi bo'lsangiz — massivga qo'shing:
 * "chimgan": ["/places/chimgan.jpg", "/places/chimgan-2.jpg", ...]
 */
export const PLACE_GALLERIES: Record<string, string[]> = {
  "chimgan":      ["/places/chimgan.jpg"],
  "ark-fortress": ["/places/ark-fortress.jpg"],
  "itchan-kala":  ["/places/itchan-kala.jpg"],
  "registon":     ["/places/registan.jpg"],
  "shahrisabz":   ["/places/shahrisabz.jpg"],
  "aydarkul":     ["/places/aydarkul.webp"],
  "nurota":       ["/places/nurota.jpg"],
  "shohi-zinda":          ["/places/shohi-zinda.jpg"],
  "bibi-xonim":           ["/places/bibi-xonim.jpg"],
  "ulugbek-rasadxonasi":  ["/places/ulugbek-rasadxonasi.jpg"],
  "minorai-kalon":        ["/places/minorai-kalon.jpg"],
  "labihovuz":            ["/places/labihovuz.jpg"],
  "sitorai-mohi-xosa":    ["/places/sitorai-mohi-xosa.jpg"],
  "kalta-minor":          ["/places/kalta-minor.jpg"],
  "islomxoja-minorasi":   ["/places/islomxoja-minorasi.jpg"],
  "tosh-hovli":           ["/places/tosh-hovli.jpg"],
  "chorvoq":              ["/places/chorvoq.jpg"],
  "amirsoy":              ["/places/amirsoy.jpg"],
  "chorsu-bozori":        ["/places/chorsu-bozori.jpg"],
};

export const PLACE_STORIES: Record<string, PlaceStory> = {
  "itchan-kala": {
    quote: {
      uz: "Ichan Qal'a — bu tarix kitobini o'qish emas, uning ichiga kirib yashashdir. Bu yerda har bir g'ishtda asrlar aks-sadosi bor.",
      ru: "Ичан-Кала — это не чтение книги истории, а жизнь внутри неё. Здесь в каждом кирпиче звучит эхо веков.",
      en: "Ichan Kala is not reading a history book — it is living inside one. Here, every brick carries the echo of centuries.",
    },
    heroTitle: "Ochiq osmon ostidagi ertak",
    sections: [
      {
        emoji: "✨",
        heading: "Eng qiziqarli va hayratlanarli faktlar",
        facts: [
          {
            title: "Tirik shahar",
            body: "Dunyodagi ko'plab muzey-shaharlardan farqli o'laroq, Ichan Qal'ada hamon odamlar yashaydi. Bu yerda qadimiy devorlar ichida hayot davom etmoqda — bu haqiqiy \"jonli tarix\".",
          },
          {
            title: "Tugallanmagan mahobat",
            body: "Kalta Minor minorasi aslida 80 metrdan baland bo'lishi rejalashtirilgan — Markaziy Osiyodagi eng baland minora bo'lishi kerak edi. Qurilish to'xtab qolgani sababli u noodatiy shakli va to'liq koshin bilan qoplangani bilan dunyoga mashhur.",
          },
          {
            title: "Juma masjidi mo'jizasi",
            body: "Masjidi shiftini 213 ta yog'och ustun tutib turadi. Bu ustunlarning har biri o'ziga xos o'ymakorlik naqshiga ega va ularning ba'zilari 1000 yillik tarixga ega.",
          },
          {
            title: "Loydan yasalgan qalqon",
            body: "Qal'a devorlari somon aralashtirilgan loydan qurilgan bo'lib, balandligi 8–10 metrni tashkil qiladi. Ular asrlar davomida quyosh ostida toshdek qotib, bugungi kungacha yetib kelgan.",
          },
        ],
      },
      {
        emoji: "🤔",
        heading: "Nega aynan Ichan Qal'aga borish kerak?",
        facts: [
          {
            title: "Haqiqiy Sharq atmosferasi",
            body: "Bu yerda siz o'zingizni \"Alouddin\" multfilmi yoki \"Ming bir kecha\" ertaklariga tushib qolgandek his qilasiz. Modernizatsiya buzmagan yagona butun shahar-qal'a.",
          },
          {
            title: "Fotogenik manzillar",
            body: "Har bir burchak, har bir koshinli devor — tayyor fotosessiya. Ayniqsa, quyosh botayotgan mahalda loy devorlarning oltin rangga kirishi sehrli ko'rinish beradi.",
          },
          {
            title: "Xiva oshxonasi",
            body: "Faqat shu yerda haqiqiy \"Tuxum barak\" va Xivacha \"Plov\" ta'mini tatib ko'rish mumkin. Bu gastronomik sayohatning o'zi bir olam.",
          },
          {
            title: "Hunarmandchilik maktabi",
            body: "Yog'och o'ymakorligi va gilam to'qish jarayonini bevosita ustaxonalarda kuzatish va ustalardan dars olish imkoniyati mavjud.",
          },
        ],
      },
    ],
  },

  "chimgan": {
    quote: {
      uz: "Toshkentning shovqinidan charchadingizmi? Chimgon — o'pkalaringizga toza havo, ko'zlaringizga esa cheksizlikni hadya etadi. Cho'qqilardan qarang va dunyo qanchalar kengligini his qiling!",
      ru: "Устали от шума Ташкента? Чимган дарит вашим лёгким чистый воздух, а глазам — бесконечность. Взгляните с вершин и почувствуйте, насколько огромен мир!",
      en: "Tired of Tashkent's noise? Chimgan gifts your lungs clean air and your eyes — infinity. Look from the peaks and feel how vast the world truly is!",
    },
    heroTitle: "Moviy osmon va cho'qqilar saltanati",
    sections: [
      {
        emoji: "✨",
        heading: "Qiziqarli faktlar",
        facts: [
          {
            title: "\"O'zbekiston Shveytsariyasi\"",
            body: "Chimgon o'zining landshafti, archazorlari va iqlimi bilan Yevropaning Alp tog'lariga qiyoslanadi.",
          },
          {
            title: "\"Chimgon\" so'zining ma'nosi",
            body: "Tadqiqotchilar bu nomni \"Chiman\" (ko'kat, maysazor) so'zidan kelib chiqqan, ya'ni \"Yashil vodiy\" degan ma'noni anglatadi deb hisoblashadi.",
          },
          {
            title: "Katta Chimgon cho'qqisi: 3 309 metr",
            body: "Bu cho'qqi yilning deyarli barcha faslida qor bilan qoplangan bo'ladi va uzoqdan kumushrang qalpoq kabi ko'rinadi.",
          },
          {
            title: "Shifobaxsh havo",
            body: "Chimgon havosi ionlarga va archa beradigan fitonsidlarga boy. Bu yerda bir necha kun dam olish nafas yo'llari va asab tizimini tabiiy ravishda davolaydi.",
          },
        ],
      },
      {
        emoji: "🎿",
        heading: "Nega Chimgonga borish kerak?",
        facts: [
          {
            title: "To'rt fasl go'zalligi",
            body: "Qishda chang'i va kanat yo'llari (Sky Resort). Bahorda lolalar va sharsharalar mavsumi. Yozda shahar jaziramasidan qochish. Kuzda \"oltin kuz\" manzaralari va tog' yonbag'ridagi sokinlik.",
          },
          {
            title: "Adrenalin va sarguzasht",
            body: "Paragliding (parashyutda uchish), otda sayr qilish va qoyalarga chiqish kabi ekstremal sarguzashtlar kutadi.",
          },
          {
            title: "G'ulom-sharshara va g'orlar",
            body: "Chimgon atrofidagi sirli g'orlar va 40 metrdan tushuvchi sharsharalar sayyohlar uchun unutilmas xotiralar beradi.",
          },
          {
            title: "Chorvoq suv ombori",
            body: "Chimgon yo'lida joylashgan bu \"firuza ko'l\" tog'lar bilan qurshalgan bo'lib, uning panoramasi dunyodagi eng go'zal manzaralardan biri hisoblanadi.",
          },
        ],
      },
    ],
  },

  "ark-fortress": {
    quote: {
      uz: "Buxoro qalbining zarbi — Ark qal'asida uradi. Bu yerda har bir tosh hukmdorlar qudrati va allomalar tafakkuridan so'zlaydi. Arkka chiqing va o'zingizni tarixning eng baland cho'qqisida his qiling!",
      ru: "Пульс сердца Бухары бьётся в крепости Арк. Здесь каждый камень говорит о силе правителей и мудрости учёных. Поднимитесь в Арк и почувствуйте себя на вершине истории!",
      en: "The heartbeat of Bukhara pulses in Ark Fortress. Here every stone speaks of rulers' power and scholars' wisdom. Climb the Ark and stand at history's highest peak!",
    },
    heroTitle: "Buxoroning «Shahri ichidagi shahar»",
    sections: [
      {
        emoji: "✨",
        heading: "Eng hayratlanarli faktlar",
        facts: [
          {
            title: "Sun'iy tepalik",
            body: "Ark tabiiy tog' ustida emas, balki asrlar davomida inson qo'li bilan yaratilgan ulkan sun'iy tepalik ustida barpo etilgan. Uning balandligi ba'zi joylarda 20 metrga yetadi.",
          },
          {
            title: "Siyovush afsonasi",
            body: "Qadimiy rivoyatlarga ko'ra, Ark afsonaviy qahramon Siyovush tomonidan qurilgan. U bir ho'kiz terisiga sig'adigan maydonni belgilab, uni ingichka tasmalar qilib qirqib, katta maydonni egallagan.",
          },
          {
            title: "Intellektual markaz",
            body: "Ark faqat harbiy maskan bo'lmagan. Bu yerda O'rta asrlarning eng boy kutubxonalaridan biri joylashgan bo'lib, Abu Ali ibn Sino, Firdavsiy va Rudakiy kabi buyuk allomalar ijod qilishgan.",
          },
          {
            title: "Zindon va Jallodxona",
            body: "Qal'aning kirish qismida qadimiy qamoqxona (Zindon) joylashgan bo'lib, u yerda mahbuslar saqlangan. Bu Arkning nafaqat go'zal, balki haybatli tarixidan darak beradi.",
          },
        ],
      },
      {
        emoji: "🧭",
        heading: "Nega Ark qal'asiga borish kerak?",
        facts: [
          {
            title: "Hukmdorlar yo'lagidan yurish",
            body: "Qal'aning kirishidagi uzun, g'ishtin pandus bo'ylab yurganingizda, o'zingizni Buxoro amiri saroyiga tashrif buyurayotgan elchidek his qilasiz.",
          },
          {
            title: "Panoramik manzara",
            body: "Ark devorlari ustidan Buxoroning ko'hna qismi — Minorai Kalon va boshqa obidalar kaftdek ko'rinib turadi. Bu shahar manzarasini suratga olish uchun eng yaxshi nuqta.",
          },
          {
            title: "Tirik muzey",
            body: "Hozirda Ark ichida tarixiy muzeylar joylashgan bo'lib, u yerda amirlarning taxtlari, qadimiy tangalar, qurol-yarog'lar va qo'lyozmalarni o'z ko'zingiz bilan ko'rishingiz mumkin.",
          },
          {
            title: "Arxitektura mo'jizasi",
            body: "Qal'a devorlarining egri-bugri ulkan hajmi va kirish darvozasining mahobati sizni o'rta asrlar jangovar filmlari atmosferasiga olib kiradi.",
          },
        ],
      },
    ],
  },

  "registon": {
    quote: {
      uz: "Bu yerda tarix galdan g'ishtga emas, oltindan nurga ko'chgan.",
      ru: "Здесь история перешла не от кирпича к кирпичу, а от золота к свету.",
      en: "Here, history did not pass from brick to brick — it passed from gold to light.",
    },
    heroTitle: "Sharqning vizual tashrif qog'ozi",
    sections: [
      {
        emoji: "✨",
        heading: "Hayratlanarli faktlar",
        facts: [
          {
            title: "Uchlik uyg'unligi",
            body: "Maydondagi uchta madrasa — Ulug'bek (1420), Sherdor (1636) va Tilla-Kori (1660) — bir-birini to'ldiruvchi yagona ulug'vor ansamblni tashkil etadi.",
          },
          {
            title: "Sherdor siri",
            body: "Islom me'morchiligida tirik mavjudotlarni tasvirlash taqiqlangan bo'lsa-da, Sherdor madrasasi peshtog'ida kiyikni quvlayotgan sher va quyosh tasviri tushirilgan — bu noyob va jumboqli holat.",
          },
          {
            title: "Oltin bilan qoplangan",
            body: "Tilla-Kori madrasasining nomi \"Oltin bilan bezatilgan\" degan ma'noni anglatadi. Ichki gumbaz shu qadar ko'p oltin suvi bilan qoplangan ki, devorlar ichkaridan nur sochayotgandek ko'rinadi.",
          },
          {
            title: "UNESCO va dunyo merosi",
            body: "Registon 2001-yilda UNESCO Jahon merosi ro'yxatiga kiritilgan. Har yili 1 million dan ortiq sayyoh bu maydonni ziyorat qiladi.",
          },
        ],
      },
      {
        emoji: "🏛️",
        heading: "Nega Registonga borish kerak?",
        facts: [
          {
            title: "Moviy koshinlar jilosi",
            body: "Quyosh nuri tong, kun va kechqurun koshinlarda har xil aks etadi. Registon ranglari kunning har soatida o'zgarib turadi — bu cheksiz fotosessiya imkoniyati.",
          },
          {
            title: "Lazer-shou",
            body: "Tunda maydonda o'tkaziladigan zamonaviy 3D-mapping shousi tarixdagi eng muhim voqealarni ko'z oldingizda jonlantiradi. Bu Markaziy Osiyodagi eng ta'sirli tungi tadbirlardan biri.",
          },
          {
            title: "Akustika mo'jizasi",
            body: "Madrasalar ichida ovoz aks-sadosining qanday ishlashini o'z quloqlaringiz bilan eshiting — me'morlar bu effektni ataylab yaratgan.",
          },
          {
            title: "Samarqand gastronomi",
            body: "Registon atrofidagi ko'chalarda Samarqand noni (dunyodagi eng mazali nonlardan deb tan olingan), mastava va shashlik — sayohat paytidagi gastronomik lazzat.",
          },
        ],
      },
    ],
  },

  "aydarkul": {
    quote: {
      uz: "Sahro bag'ridagi firuza dengiz — tabiat va sarguzasht uchrashgan nuqta.",
      ru: "Бирюзовое море в объятьях пустыни — точка, где природа встречается с приключением.",
      en: "A turquoise sea in the desert's embrace — the point where nature meets adventure.",
    },
    heroTitle: "Sahrodagi mo'jiza",
    sections: [
      {
        emoji: "✨",
        heading: "Qiziqarli faktlar",
        facts: [
          {
            title: "Tasodifiy go'zallik",
            body: "Aydarko'l tabiat in'omi emas — 1969-yilda yuz bergan kuchli sug'orish toshqini natijasida yuzaga kelgan. Hozirda uzunligi 250 km dan oshib, O'rta Osiyodagi eng katta ko'llardan biriga aylangan.",
          },
          {
            title: "Sahro floti va flamingolar",
            body: "Bu yerda siz qumlar orasida suzib yurgan baliqchilar qayiqlarini va ko'l bo'yida uchib yurgan pushti flamingolarni ko'rishingiz mumkin.",
          },
          {
            title: "Sokinlik va yulduzlar",
            body: "Aydarko'l atrofida yasovchi chiroqlar kamligi sababli, tunda osmon shunchalik tiniqki, Somon yo'li galaktikasini ko'z bilan aniq ko'rish mumkin.",
          },
          {
            title: "Qizilqum sahrosining qo'ynida",
            body: "Ko'l Qizilqum sahrosining markazida joylashgan bo'lib, atrofida hech qanday shahar va shovqin yo'q. Bu O'zbekistondagi eng yiroq va haqiqiy \"off-grid\" manzillaridan biri.",
          },
        ],
      },
      {
        emoji: "🐪",
        heading: "Nega Aydarko'lga borish kerak?",
        facts: [
          {
            title: "O'tovlarda yashash",
            body: "Sahro o'rtasidagi milliy o'tovlarda tunab, ko'chmanchi xalqlar an'anaviy hayotini his qiling. Mahalliy qo'zichoq kabob va choyxona — unutilmas tajriba.",
          },
          {
            title: "Tuya sayri",
            body: "Ko'l bo'ylab tuyada sayr qilish va sahro sunset manzarasini yuqoridan tomosha qilish — Aydarko'lda bo'lganingizning dalili.",
          },
          {
            title: "Baliq ovi",
            body: "Ko'lda karp, zander va boshqa baliqlar mo'l. Toza suvda qovurilgan baliqning ta'mi sahro shamollari ostida tamoman o'zgacha.",
          },
          {
            title: "Yulduzli osmon astrofotografiyasi",
            body: "Yorug'lik ifloslanishi deyarli yo'q. Astronomiya va astrofotografiya ixlosmandlari uchun Aydarko'l O'zbekistondagi eng ideal nuqtalardan biri.",
          },
        ],
      },
    ],
  },

  "nurota": {
    quote: {
      uz: "Iskandar Zulqarnayn izidan muqaddas chashma sari yo'l.",
      ru: "По следам Искандера Зулькарнайна — к священному роднику.",
      en: "Following the trail of Alexander the Great — toward the sacred spring.",
    },
    heroTitle: "Tarix va afsonalar maskani",
    sections: [
      {
        emoji: "✨",
        heading: "Qiziqarli faktlar",
        facts: [
          {
            title: "Nur qal'asi va Iskandar",
            body: "Qal'aning poydevori Iskandar Zulqarnayn (Aleksandr Makedonskiy) tomonidan miloddan avvalgi IV asrda qo'yilgan deb ishoniladi. Uning devorlari strategik jihatdan mukammal qurilgan.",
          },
          {
            title: "Muqaddas Chashma va baliqlari",
            body: "Bu buloqda minglab \"marinka\" (Schizothorax) baliqlari yashaydi. Mahalliy aholi bu baliqlarni muqaddas deb hisoblaydi va asrlar davomida ularni ovlamagan.",
          },
          {
            title: "Qadimiy karezlar",
            body: "Nurotada 2000 yil avval qurilgan yer osti suv yo'llari — karezlar — hamon saqlanib qolgan va hali ham ishlaydi. Bu o'sha davr muhandisligining eng yuqori cho'qqisi.",
          },
          {
            title: "Nurota so'zanasi — UNESCO merosi",
            body: "Nurota kashtachilik maktabi UNESCO nomoddiy madaniy meros ro'yxatiga kiritilgan. Bu yerda to'qilgan so'zanalarning naqshlari O'rta Osiyoning boshqa hech bir joyida uchramaydi.",
          },
        ],
      },
      {
        emoji: "🕌",
        heading: "Nega Nurotaga borish kerak?",
        facts: [
          {
            title: "Ma'naviy hordiq",
            body: "\"Chashma\" majmuasidagi shifobaxsh buloq suvi va muqaddas atmosfera — bu yerda tinchlik va xotirjamlik his qilasiz. Ko'pchilik bu joyni ziyorat niyatida keladi.",
          },
          {
            title: "Arxeologik sarguzasht",
            body: "Iskandar Zulqarnayn qal'asi xarobalariga chiqib, tepalikdan Nurota va atrofidagi manzarani tomosha qiling — tarix ko'z oldingizda jonlanadi.",
          },
          {
            title: "Nurota so'zanasini ko'rish",
            body: "Dunyoga mashhur \"Nurota so'zanasi\"ning yaratilish jarayonini bevosita ustaxonalarda kuzatish va usta kashtachilardan saboq olish imkoniyati bor.",
          },
          {
            title: "Aydarko'l + Nurota",
            body: "Nurota va Aydarko'l bir-biridan 60 km uzoqlikda — ikkalasini bir sayohatda birlashtirib, Navoiy viloyatining barcha go'zalligini kashf eting.",
          },
        ],
      },
    ],
  },

  "shahrisabz": {
    quote: {
      uz: "Oqsaroy — bu yerga buyuklik toshdan haykal bo'lib kelgan joy. Uning ulkan peshtoqlari tagida turib, asrlar oldingi qudratning nafasini his qilasiz.",
      ru: "Ак-Сарай — место, где величие пришло в виде каменной скульптуры. Стоя под его огромными арками, чувствуешь дыхание могущества минувших веков.",
      en: "Ak-Saray is where greatness arrived as a stone sculpture. Standing beneath its vast arches, you breathe in the power of centuries long past.",
    },
    heroTitle: "Temur qudratining me'moriy ramzi",
    sections: [
      {
        emoji: "✨",
        heading: "Eng hayratlanarli faktlar",
        facts: [
          {
            title: "G'ayrioddiy balandlik",
            body: "Oqsaroyning bosh peshtoqi o'z vaqtida 70 metrdan baland bo'lgan — taxminan 23-25 qavatli bino balandligiga teng. Hozirda saqlanib qolgan qismi 38 metr bo'lib, tepasidan butun shahar kaftdek ko'rinadi.",
          },
          {
            title: "Moviy mozaika san'ati",
            body: "Saroy devorlaridagi koshinlar va sirlangan g'ishtlar shunchalik mahorat bilan ishlangan-ki, olti asr o'tsa ham rangi o'chmagan. Devordagi girih naqshlari va arabiy xattotlik namunalari jahon me'morchiligining nodir durdonalaridir.",
          },
          {
            title: "Tomdagi hovuz afsonasi",
            body: "Afsonalarga ko'ra, saroyning tom qismida hovuz bo'lgan. Suv tog'lardan maxsus quvurlar orqali kelib, pastga sharshara bo'lib tushgan va saroy ichida doimiy salqinlikni saqlab turgan.",
          },
          {
            title: "\"Oqsaroy\" nomining siri",
            body: "\"Oq\" so'zi bu yerda rangni emas, balki \"oliy\", \"muqaddas\", \"ulug'\" degan ma'nolarni anglatadi — ya'ni bu \"Oliy Saroy\" demakdir. Qurilishi 1380-yilda boshlanib, 20 yildan ortiq davom etgan.",
          },
        ],
      },
      {
        emoji: "🧭",
        heading: "Nega Oqsaroyni ko'rish kerak?",
        facts: [
          {
            title: "Masshtabni his qilish",
            body: "Hatto vayron bo'lgan holatida ham bu bino insonni buyukligi bilan hayratga soladi. Uning poyida turib, o'rta asrlarda insoniyat qanday texnik imkoniyatlarga ega bo'lganiga ishonish qiyin.",
          },
          {
            title: "Unikal fotosuratlar",
            body: "Oqsaroyning ulkan arkasidan osmonning ko'rinishi har qanday fotograf uchun eng go'zal kadr. Bu surat O'zbekiston ikonografiyasining eng taniqli tasvirlaridan biriga aylangan.",
          },
          {
            title: "Ko'k Gumbaz va Dor us-Siyoda",
            body: "Ulug'bek qurilgan Ko'k Gumbaz masjidi (1435) va Temur avlodlari dafn etilgan Dor us-Siyoda maqbarasi — Oqsaroydan so'ng albatta ko'rilishi kerak bo'lgan yodgorliklar.",
          },
          {
            title: "Samarqanddan 90 daqiqa",
            body: "Shahrisabz Samarqanddan 90 km uzoqlikda. Yo'l Zarafshon tizmasining go'zal tog' manzaralari orqali o'tadi — sayohatning o'zi ham ajoyib.",
          },
        ],
      },
    ],
  },

  "shohi-zinda": {
    quote: {
      uz: "Shohi Zinda — bu ko'chalar ichidagi eng muhtasham ko'cha. Har bir peshtoq orqasida asr yotadi, har bir koshin nur sochadi.",
      ru: "Шахи Зинда — самая величественная из улиц. За каждым порталом — век, каждая плитка излучает свет.",
      en: "Shahi Zinda is the most majestic of streets. Behind every portal lies a century; every tile radiates light.",
    },
    heroTitle: "Maqbaralar ko'chasi",
    sections: [
      {
        emoji: "✨",
        heading: "Hayratlanarli faktlar",
        facts: [
          {
            title: "\"Tirik shoh\" nomi",
            body: "Majmua nomi \"Tirik shoh\" degan ma'noni anglatadi — bu yerda Payg'ambar amakivachchasi Qusam ibn Abbos dafn etilgan deb ishoniladi. Ziyoratgoh 1000 yildan ortiq vaqt davomida Islomning Markaziy Osiyodagi eng muqaddas maskanlaridan biri bo'lib kelgan.",
          },
          {
            title: "11 asrlik qatlam",
            body: "Eng qadimiy inshootlar XI–XII asrlarga tegishli, eng yoshlari esa XIX asrda qurilgan. Ko'cha bo'ylab yurganingizda siz asrlar kesimini zina bo'ylab ko'tarilib chiqqandek o'tasiz.",
          },
          {
            title: "Koshin mo'jizasi",
            body: "XIV–XV asrlar maqbaralaridagi sirlangan terrakota va moviy koshin naqshlari dunyoda tengsiz hisoblanadi. Shamseddin Kulol maqbarasi peshtog'i ko'pincha Sharq me'morchiligining cho'qqisi deb ataladi.",
          },
          {
            title: "40 zinapoyali marosim",
            body: "Majmuaga kirish uchun 36–40 ta zinapoyadan ko'tarilish kerak. Eski rivoyatlarga ko'ra, ziyoratchi zinapoyalarni sanab ko'tarilsa va tepada duo qilsa — tilagi qabul bo'ladi.",
          },
        ],
      },
      {
        emoji: "🕌",
        heading: "Nega Shohi Zindaga borish kerak?",
        facts: [
          {
            title: "Fotograflarning jannati",
            body: "Ertalabki quyosh nuri tor ko'cha devorlariga tushganda koshinlar oltin-moviy rangga kiradi. Bu O'zbekistondagi eng fotogen manzarlardan biri.",
          },
          {
            title: "Registondan 10 daqiqa",
            body: "Shohi Zinda Registon maydonidan piyoda yoki taksida bir necha daqiqada boriladigan masofada joylashgan — Samarqandga kelganingizda ikkalasini bir kunda ko'rishingiz mumkin.",
          },
          {
            title: "Jonli ziyorat an'anasi",
            body: "Bu muzey emas — bugun ham minglab odamlar ziyorat qiladi. Dua qilayotgan oilalar, non uzatayotgan cholalar — jonli madaniy tajriba.",
          },
          {
            title: "Ulug'bek davri yodgorligi",
            body: "Majmuada Temuriy hukmdor ayollari — Tuman Oqa, Shodi Mulk Oqa maqbaralari joylashgan. Bu ayollar nomi bilan atalgan noyob me'moriy ansambl.",
          },
        ],
      },
    ],
  },

  "minorai-kalon": {
    quote: {
      uz: "Minora shunchaki g'isht emas — u Buxoro osmoniga mixlangan tarixdir. Qaraganingizda asrlar sizga qaraydi.",
      ru: "Минарет — это не просто кирпич, это история, вбитая в небо Бухары. Когда вы смотрите на него, века смотрят на вас.",
      en: "The minaret is not mere brick — it is history nailed into Bukhara's sky. As you look at it, centuries look back.",
    },
    heroTitle: "Buxoroning buyuk minorasi",
    sections: [
      {
        emoji: "✨",
        heading: "Hayratlanarli faktlar",
        facts: [
          {
            title: "900 yillik gigant",
            body: "Minorai Kalon 1127-yilda Arslonxon buyrug'i bilan qurilgan. Balandligi 46 metr bo'lib, 900 yildan beri zilzilarga qaramay tik turibdi — poydevoriga qazilgan maxsus cho'yan tayanchlar buning siridir.",
          },
          {
            title: "\"O'lik minora\" afsonasi",
            body: "XIX asrgacha mahkumlarni minoradan tashlashgan — shuning uchun u \"O'lik minora\" (G'or-i Kalon) deb atalgan. Bugun bu dahshatli tarix faqat rivoyatlarda qolgan.",
          },
          {
            title: "Naqshlarsiz go'zallik",
            body: "Minora deyarli bezaksiz — uning go'zalligi g'isht terish mahoratida: 10 xil naqshli g'isht halqalari quyosh nufizida o'zgarib turadi. Ustiga \"Al-Mulk\" (Mulukning) imzosi bosilgan.",
          },
          {
            title: "Miri Arab madrasasi",
            body: "Yonidagi Miri Arab madrasasi (1535) bugungacha faol diniy o'quv yurti bo'lib ishlaydi — O'zbekistondagi kam sonli madrasalardan biri.",
          },
        ],
      },
      {
        emoji: "🧭",
        heading: "Nega Minorai Kalonga borish kerak?",
        facts: [
          {
            title: "Kalon masjidi saloni",
            body: "Masjid ichki hovlisida 288 ta ustunli galereya mavjud. Juma kunlari minglab namozxonlar bilan birga haqiqiy sharqiy marosimni his qilasiz.",
          },
          {
            title: "Kechki yorug'lik shousi",
            body: "Tunda minora va majmua maxsus yoritiladi — Buxoroning eng mashhur tungi fotosessiya nuqtasi.",
          },
          {
            title: "Barcha yo'llar shu yerdan",
            body: "Minorai Kalon eski shahar markazida joylashgan — Ark, Labihovuz va bozorlar hammasi piyoda masofada. Marshrutingizni shu yerda boshlash eng qulay.",
          },
          {
            title: "Akustika siri",
            body: "Minora tepasidagi muazzin balandi butun shahar bo'ylab eshitar edi — me'morlar ovozni pastga yog'diruvchi maxsus shakl yaratgan.",
          },
        ],
      },
    ],
  },

  "chorvoq": {
    quote: {
      uz: "Chorvoq — tog'lar bag'idagi dengiz. Suvning firuza rangini birinchi ko'rganingizda, bu O'zbekiston ekaniga ishonchingiz kelmaydi.",
      ru: "Чарвак — море в объятиях гор. Увидев бирюзовый цвет воды впервые, вы не поверите, что это Узбекистан.",
      en: "Charvak is a sea cradled by mountains. At first sight of its turquoise water you won't believe it's Uzbekistan.",
    },
    heroTitle: "Tog'lar qurshovidagi dengiz",
    sections: [
      {
        emoji: "✨",
        heading: "Qiziqarli faktlar",
        facts: [
          {
            title: "Suniy, lekin tabiiy go'zal",
            body: "Chorvoq suv ombori 1972-yilda Chirchiq daryosida qurilgan to'g'on natijasida hosil bo'lgan. Suv hajmi 2 km³ dan ortiq — bu Toshkent viloyatining eng katta suv havzasi.",
          },
          {
            title: "To'rt qishloq o'rnida",
            body: "Suv ostida qadimgi Chorvoq shaharchasi qolgan — nomi \"chor ravoq\" (to'rt yo'l chorrahasi) dan kelgan. Buyuk Ipak yo'li karvonlari aynan shu chorrahada to'xtagan.",
          },
          {
            title: "Yozgi poytaxt",
            body: "Iyulda suv harorati 24–26 darajagacha yetadi. Toshkentliklar uchun Chorvoq — shahar jaziramasi qochadigan asosiy maskan, dam olish kunlarida plyajlar to'la bo'ladi.",
          },
          {
            title: "Paraplanda uchish",
            body: "Chorvoq atrofidagi tog'lar paraplanerlar uchun Markaziy Osiyodagi eng yaxshi nuqtalardan biri. Xalqaro musobaqalar ham shu yerda o'tkaziladi.",
          },
        ],
      },
      {
        emoji: "🏖️",
        heading: "Nega Chorvoqqa borish kerak?",
        facts: [
          {
            title: "Har qanday dam olish",
            body: "Plyaj kurortlari, kater sayrlari, jet-ski, baliq ovlash yoki shunchaki qirg'oqdagi choyxona — har kim o'ziga mos dam olish turini topadi.",
          },
          {
            title: "Ovqat manzarasi bilan",
            body: "Qirg'oq bo'yidagi restoranlarda yangi baliq kabob, somsa va milliy taomlar — suv va tog' manzarasi ostida nonushta alohida ta'm beradi.",
          },
          {
            title: "Chimyon bilan birlashtiring",
            body: "Chorvoq Chimgan va Beldersoy yo'lda — bir kunda tog' kanatiga chiqib, keyin suvga sho'ng'ishingiz mumkin. Ideal kunlik marshrut.",
          },
          {
            title: "Toshkentdan 90 daqiqa",
            body: "Toshkentdan avtomobil bilan taxminan 1,5 soat. Yo'l bo'ylab Kamchiq vodiysi manzaralari ochilib boradi — safar o'zi ham sarguzasht.",
          },
        ],
      },
    ],
  },
};
