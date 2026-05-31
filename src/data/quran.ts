export interface QulAyah {
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface QulSurah {
  id: string;
  nameArabic: string;
  name: string;
  audioFile: string;
  tickerText: string;
  ayahs: QulAyah[];
}

export const QUL_SURAHS: QulSurah[] = [
  {
    id: "al-kafirun",
    nameArabic: "سُورَةُ ٱلْكَافِرُونَ",
    name: "Al-Kafirun",
    audioFile: "/audio/1-al-kafirun.mp3",
    tickerText:
      "Surah Al-Kafirun — This Surah isn't about intolerance; it's about the purity of belief. It teaches us that there is no middle ground in the core of our faith. In 2026, where pluralism often blurs the lines of religious identity, Al-Kafirun provides a clear framework for respectful coexistence without compromising our own Tawhid (monotheism). Reciting this Surah before bed is a disavowal of Shirk (associating partners with Allah).",
    ayahs: [
      {
        number: 1,
        arabic: "قُلْ يَـٰٓأَيُّهَا ٱلْكَـٰفِرُونَ",
        transliteration: "Qul ya ayyuhal-Kafiroun",
        translation:
          "Say: O Al-Kafiroun (disbelievers in Allah, in His Oneness, in His Angels, in His Books, in His Messengers, in the Day of Resurrection, and in Al-Qadar, etc)!",
      },
      {
        number: 2,
        arabic: "لَآ أَعْبُدُ مَا تَعْبُدُونَ",
        transliteration: "La 'a-budu ma ta'-bu-doun",
        translation: "I worship not that which you worship,",
      },
      {
        number: 3,
        arabic: "وَلَآ أَنتُمْ عَـٰبِدُونَ مَآ أَعْبُدُ",
        transliteration: "Wa la antum 'abidouna ma 'a-bud",
        translation: "Nor will you worship that which I worship.",
      },
      {
        number: 4,
        arabic: "وَلَآ أَنَا۠ عَابِدٌۭ مَّا عَبَدتُّمْ",
        transliteration: "Wa la ana 'abidum-ma 'abadttum",
        translation: "And I shall not worship that which you are worshipping.",
      },
      {
        number: 5,
        arabic: "وَلَآ أَنتُمْ عَـٰبِدُونَ مَآ أَعْبُدُ",
        transliteration: "Wa la antum 'abiduna ma 'a-bud",
        translation: "Nor will you worship that which I worship.",
      },
      {
        number: 6,
        arabic: "لَكُمْ دِينُكُمْ وَلِىَ دِينِ",
        transliteration: "Lakum deenukum wa li-ya deen",
        translation:
          "To you be your religion, and to me my religion (Islamic Monotheism).",
      },
    ],
  },
  {
    id: "al-ikhlas",
    nameArabic: "سُورَةُ ٱلْإِخْلَاصِ",
    name: "Al-Ikhlas",
    audioFile: "/audio/2-al-ikhlas.mp3",
    tickerText:
      "Surah Al-Ikhlas — If you are looking for the heart of Islamic theology, you will find it in Surah Al-Ikhlas. Despite being only four verses long, the Prophet (PBUH) famously stated that it is equivalent to one-third of the Quran (Sahih Bukhari). The word As-Samad (The Eternal, Besought by all) is a term used nowhere else in the Quran in this context. It describes God as being perfect, needing nothing, while everything else needs Him.",
    ayahs: [
      {
        number: 1,
        arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
        transliteration: "Qul Huwa-llahu 'Ahad",
        translation: "Say: He is Allah, (the) One,",
      },
      {
        number: 2,
        arabic: "ٱللَّهُ ٱلصَّمَدُ",
        transliteration: "Allahus-Samad",
        translation:
          "Allahus-Samad (The Self-Sufficient Master, Whom all creatures need, He neither eats nor drinks).",
      },
      {
        number: 3,
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        transliteration: "Lam Yalid Wa Lam Yulad",
        translation: "He begets not, nor was He begotten;",
      },
      {
        number: 4,
        arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
        transliteration: "Walam Yakul-La-Hu-Kufuwan 'Ahad",
        translation: "And there is none co-equal or comparable unto Him.",
      },
    ],
  },
  {
    id: "al-falaq",
    nameArabic: "سُورَةُ ٱلْفَلَقِ",
    name: "Al-Falaq",
    audioFile: "/audio/3-al-falaq.mp3",
    tickerText:
      "Surah Al-Falaq — Al-Falaq focuses on seeking refuge from external evils: The mischief of created things. The darkness of the night. The 'blowers on knots' (sorcery/magic). The envier when he envies (The Evil Eye). In my experience at Bushra Quran Academy, many people come to us asking about protection from Ayn. It is a documented reality in Islamic tradition (Sahih Muslim 2188). Surah Al-Falaq is your primary defense. It acknowledges that while evil exists in the world, the refuge of Allah is greater.",
    ayahs: [
      {
        number: 1,
        arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",
        transliteration: "Qul 'A'udhu Bi-Rabbil-Falaq",
        translation:
          "Say: I seek refuge with (Allah) the Lord of the daybreak,",
      },
      {
        number: 2,
        arabic: "مِن شَرِّ مَا خَلَقَ",
        transliteration: "Min Sharri Ma Khalaq",
        translation: "From the evil of what He has created;",
      },
      {
        number: 3,
        arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        transliteration: "Wa Min Sharri Ghasiqin 'Idha Waqab",
        translation:
          "And from the evil of the darkening (night) as it comes with its darkness; (or the moon as it sets or goes away).",
      },
      {
        number: 4,
        arabic: "وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ",
        transliteration: "Wa Min Sharri-Naffathati Fil-'Uqadi",
        translation:
          "And from the evil of the witchcrafts when they blow in the knots,",
      },
      {
        number: 5,
        arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        transliteration: "Wa Min Sharri Hasidin 'Idha Hasad",
        translation: "And from the evil of the envier when he envies.",
      },
    ],
  },
  {
    id: "an-nas",
    nameArabic: "سُورَةُ ٱلنَّاسِ",
    name: "An-Nas",
    audioFile: "/audio/4-an-nas.mp3",
    tickerText:
      "Surah An-Nas — While Al-Falaq protects us from what is outside, Surah An-Nas protects us from what is inside. It targets the Waswasa — the whispers of Shaytan that manifest as doubt, anxiety, and negative self-talk. This Surah reminds us that the ultimate refuge is in Allah, the Lord, King, and God of mankind.",
    ayahs: [
      {
        number: 1,
        arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",
        transliteration: "Qul 'A'udhu Bi-Rabbin-Nas",
        translation:
          "Say: I seek refuge with (Allah) the Lord of mankind,",
      },
      {
        number: 2,
        arabic: "مَلِكِ ٱلنَّاسِ",
        transliteration: "Malikin-Nas",
        translation: "The King of mankind,",
      },
      {
        number: 3,
        arabic: "إِلَـٰهِ ٱلنَّاسِ",
        transliteration: "Ilahin-Nas",
        translation: "The Ilah (God) of mankind,",
      },
      {
        number: 4,
        arabic: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ",
        transliteration: "Min-Sharril-Waswasil-Khan-Nas",
        translation:
          "From the evil of the whisperer (devil who whispers evil in the hearts of men), who withdraws (from his whispering in one's heart after one remembers Allah),",
      },
      {
        number: 5,
        arabic: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ",
        transliteration: "Al-Ladhi Yuwas-wisu Fee Sudurin-Nas",
        translation: "Who whispers in the breasts of mankind,",
      },
      {
        number: 6,
        arabic: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",
        transliteration: "Mina Al-Jinnati Wan-Nas",
        translation: "Of jinns and men.",
      },
    ],
  },
];
