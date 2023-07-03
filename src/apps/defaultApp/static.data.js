const baseImgSrc = '@/apps/agam/assets/images';

export const contactData = {
  contacts: [
    {
      title: 'מנהלת שיווק',
      phone: '000-0000-000',
      email: 'info@debi.co.il'
    },
    {
      title: 'יועצת תקשורת',
      phone: '000-0000-000',
      email: 'info@debi.co.il'
    }
  ],
  mediaItems: [
    {
      name: 'facebook',
      title: 'דבי תקשורת',
      img: require(`@/apps/agam/assets/images/media/facebook.svg`),
      link: 'https://www.facebook.com/debi/'
    },
    {
      name: 'instegram',
      title: '@debi',
      img: require(`@/apps/agam/assets/images/media/instegram.svg`),
      link: 'https://www.instagram.com/debi/'
    },
    {
      name: 'tiktok',
      title: '_@debi',
      img: require(`@/apps/agam/assets/images/media/tiktok.svg`),
      link: 'https://www.tiktok.com/@debi_'
    },
    {
      name: 'youtube',
      title: 'דבי תקשורת',
      img: require(`@/apps/agam/assets/images/media/youtube.svg`),
      link: 'https://www.youtube.com/channel/UCqLjZATnh7TIU4YOOZ4nU7A'
    },
    {
      name: 'web',
      title: 'debi.com',
      img: require(`@/apps/agam/assets/images/media/web.svg`),
      link: 'https://www.debi.com'
    },
  ]
}

export const crewMembers = [
  {
    name: 'ליאור שרף',
    img: require(`@/apps/agam/assets/images/crew/lior.png`),
    role: 'בעלים ומנכ"ל ההוצאה',
    contactFor: 'לאנשים שלא מצפים לקבל תשובה במילניום הקרוב'
  },
  {
    name: 'ראובת ניצן',
    img: require(`@/apps/agam/assets/images/crew/reovat.png`),
    role: 'עורכת ההוצאה',
    contactFor: 'הגשת כתב יד, וקבלת מידע על הוצאת ספר באגם'
  },
  {
    name: 'נטע שרף שוכמן',
    img: require(`@/apps/agam/assets/images/crew/neta.png`),
    role: 'מנהלת השיווק',
    contactFor: 'הצעות לשיתופי פעולה, הגשת קו"ח ופניות כלליות'
  },
  {
    name: 'טל שוכמן',
    img: require(`@/apps/agam/assets/images/crew/tal.png`),
    role: 'מנהל דיגיטלי',
    contactFor: 'תמיכה טכנית באתר וקבלת מידע על הזמנות'
  },
];

export const features = [
  {
    title: 'ספרות ילדים ונוער',
    img: require(`@/apps/agam/assets/images/features/keadsAndYoughth.png`),
    content:  [ 
      'אנו מלקטים את הספרות העולמית והמקומית הטובה ביותר, החדשנית ביותר והקסומה ביותר, זו אשר בכוחה להעניק לקוראים הצעירים תחושה שהם שייכים, אוהבים ומוגנים. רק כך, אנו מאמינים, נפתחת בפניהם הדלת לעולמות הדמיון והאגדה, החלימה והלמידה, חדוות הקריאה והכלת הסיפור ומסריו בפתיחות ובפליאה.'
    ].join('\n\n')
  },
  {
    title: 'פרוזה, עיון ופנאי',
    img: require(`@/apps/agam/assets/images/features/readAndLeisure.png`),
    content: [
      'מספרי העיון והפנאי שלנו מגוונים. אנו מתפרסים על פני מספר תחומים, ומשתדלים לאסוף אלינו את הספרים המעניינים והמוצלחים ביותר.',
      'ספרי ההדרכה שלנו זוכים לבדיקה ויעוץ של אנשי מקצוע רלוונטיים, וספרי הפרוזה שלנו מטופלים על ידי מיטב העורכים. כל זאת כדי להפיק ספרות אותנטית ומקורית מחד, אולם כזו שמצליחה להבקיע את הצעד הנוסף, המעניין, המסקרן, האמיץ, הלא ידוע ומפתיע - ולהסב את מירב ההנאה מספרות טובה.'
    ].join('\n\n')
  },
  {
    title: 'חכמים ביום',
    img: require(`@/apps/agam/assets/images/features/daySmarters.png`),
    content: [
      'חוברות העבודה של אגם הפכו זה מכבר לנמכרות מסוגן בישראל, והן זוכות לקבלה ואהדה חסרת תקדים בקרב ילדים, הורים ומורים.',
      'החוברות מיועדות לילדים מגיל 3 ועד הסוף היסודי, ועוקבות אחר תוכנית הלימודים של משרד החינוך.',
      'כל החוברות מגוונות, מעשירות, ססגוניות ומזמינות, וייחודן בשיטת הלימוד היסודית אך מהירה ופשוטה, שלאחריה תרגול שכל כולו משחקים והנאה.',
      'וזה עובד!',
    ].join('\n\n')
  },
]