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
  "chimgan":      "/places/chimgan.jpg",
  "ark-fortress": "/places/ark-fortress.jpg",
  "itchan-kala":  "/places/itchan-kala.jpg",
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
};
