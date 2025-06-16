import { Utils } from '@/apps/common/modules/common/modules/common/services/util.service';

const mockBookReleases = [
  
  _createBookRelease(
    `חוט"ם כלב (כמעט) מושלם 3 - חיי הפרא של אמיץ-על`,
    // `הספר השלישי בסדרה “חוט”ם, הכלב הכמעט מושלם”.\nסוף סוף מתגשם החלום של אמיץ-על, חברו הטוב של חוט”ם: הוא פוגש זאב פרא אמיתי! כי יותר מכל, כלב הפאג הקטן רוצה לחיות חיים חופשיים עם להקת זאבים. אמיץ-על אינו מחבב במיוחד בני אדם, גם אם הם נחמדים מאוד, כמו המשפחה של חוט”ם.\nמיה, פלים וחוט”ם מתחילים לדאוג כשאמיץ-על נעלם בעקבות הזאב אל מעבה היער. וכאילו לא די בכך, מתברר להם גם שהם עומדים לעזוב את הבית האהוב שלהם. האם כלב הפאג הקטן יחזור הביתה, או שיעדיף להישאר עם הזאב? והאם מיה, פליפ וחוט”ם יצליחו למצוא למשפחתם בית חדש?\nהסדרה מיועדת לילדים בראשית קריאה, והיא מלווה לכל אורכה באיוריה הנפלאים של ברברה שולץ. בעלי החיים המופיעים בסדרה הם חכמים, משעשעים ומרגשים. הסדרה מלאה במסרים חיוביים וחיוניים, ולקוראים הצעירים לא נותר אלא לדון בסוגיה: האם חוט”ם הוא באמת כלב (כמעט) מושלם, והאם בכלל צריך להיות מושלמים?`,
    `<p><span style="color: rgb(206, 145, 120);">מושלם”.</span></p><p><span style="color: rgb(206, 145, 120);">סוף סוף מתגשם החלום של אמיץ-על, חברו הטוב של חוט”ם: הוא פוגש זאב פרא אמיתי! כי יותר מכל, כלב הפאג הקטן רוצה לחיות חיים חופשיים עם להקת זאבים. אמיץ-על אינו מחבב במיוחד בני אדם, גם אם הם נחמדים מאוד, כמו המשפחה של חוט”ם.</span></p><p><span style="color: rgb(206, 145, 120);">מיה, פלים וחוט”ם מתחילים לדאוג כשאמיץ-על נעלם בעקבות הזאב אל מעבה היער. וכאילו לא די בכך, מתברר להם גם שהם עומדים לעזוב את הבית האהוב שלהם. האם כלב הפאג הקטן יחזור הביתה, או שיעדיף להישאר עם הזאב? והאם מיה, פליפ וחוט”ם יצליחו למצוא למשפחתם בית חדש?</span></p><p><span style="color: rgb(206, 145, 120);">הסדרה מיועדת לילדים בראשית קריאה, והיא מלווה לכל אורכה באיוריה הנפלאים של ברברה שולץ. בעלי החיים המופיעים בסדרה הם חכמים, משעשעים ומרגשים. הסדרה מלאה במסרים חיוביים וחיוניים, ולקוראים הצעירים לא נותר אלא לדון בסוגיה: האם חוט”ם הוא באמת כלב (כמעט) מושלם, והאם בכלל צריך להיות מושלמים?</span></p>`,
    'בטינה אוברכט',
    'בטינה אוברכט',
    'חנה לבנת',
    176,
    8, 11,
    new Date(2022, 1, 1).getTime(),
    64.5,
    [{
      src: `https://images-evrit.yit.co.il/Images/Products/NewBO/Products/24063/chotem_Master.jpg`,
    }],
    {title: 'שעת סיפור - "כמוך בדיוק" - מהותי | אגם', src: 'https://www.youtube.com/embed/otrH5hxJ2GE'},
    [{
      "src" : "https://images.megaphon.co.il/643eac15afc5d349300c087f/b6e4a140-ddfb-11ed-bbc2-6306736ebcde.xlsx",
      "title" : "pathways-errors.json.xlsx"
    }],
    [{
      "src" : "https://images.megaphon.co.il/643eac15afc5d349300c087f/bb2a3a30-ddfb-11ed-bbc2-6306736ebcde.xlsx",
      "title" : "sub-ref-errors.json (1).xlsx"
    }],
    'ספרי עיון ופנאי',
    'פוליטיקס ואקטורליה',
    '2'
  ),
  _createBookRelease(
    'דירה להשכיר',
    `דירה להשכיר הוא ספר ילדים מפורסם של הסופרת והמשוררת העברית לאה גולדברג. בספר מופיעים שלושה סיפורים: "דירה להשכיר", "כך ולא כך" ו"מעשה בשלושה אגוזים". לראשונה הופיע הסיפור המרכזי בספר, "דירה להשכיר", בעיתון "משמר לילדים" ב-22 באוקטובר 1948 עם איוריה של רות שלוס.`,
    'לאה גולדברג',
    'הרינג סינג',
    '',
    56,
    8, 99,
    new Date(1959, 1, 1).getTime(),
    100,
    [{
      src: `https://upload.wikimedia.org/wikipedia/he/thumb/6/67/ED0BB21F2EDB436982574A6D0FEF4984.jpg/200px-ED0BB21F2EDB436982574A6D0FEF4984.jpg`,
    }],
    '',
    '',
    '',
    'ספרי ילדים',
    'ספרי פעוטות',
    '1'
  ),
]

const mockReleases = [
  ...mockBookReleases,
  createMonthRelease(
    'מרץ 2023',
    'כל הספרים החדשים של חודש מרץ 2023',
    mockBookReleases,
    '3'
  )
]


function createMonthRelease(title = '', desc = '', childrenReleases = [], _id) {
  return _createFullReleaseItemLike({ title, desc, childrenReleases, _id }, 'group')
}

function _createBookRelease(title = '', desc = '', author = '', painter = '', translator = '', pageCount = '', forAgeMin = 0, forAgeMax = 0, publishedAt = 0, price = 0, mainImage = '', video = '', firstChapterLink = '', comunicatLink = '', type = '', subType = '', _id) {
  return _createFullReleaseItemLike({
    title, desc, author, painter, translator, pageCount, forAgeMin, forAgeMax, publishedAt, price ,mainImage, video, firstChapterLink, comunicatLink, type, subType, _id
  }, 'simple')
}

function _createFullReleaseItemLike(data = {}, releaseType) {
  return {
    "_id" : data._id || Utils.getRandomId(),
    "releaseType" : releaseType || "SOME_RELEASE_TYPE",
    "releaseData" : {
        ...data,
        releaseType
    },
    "design" : {
        "landingPage" : {
            "templateData" : {}
        },
        "email" : {
            "templateData" : {}
        }
    },
    "distribution" : {},
    "organizationId" : "SOME_ORG_ID",
    "allText" : JSON.stringify(data) || "SOME_TEXT_ABOUT_IT",
    "preview" : {
        "organizationId" : "SOME_ORG_ID",
        "template" : {},
        "releaseData" : {
          ...data
        },
        "templateData" : {
            "PAGE" : {},
            "EMAIL" : {}
        },
        "pageType" : "page"
    },
    "folder" : "",
    "distributionId" : "SOME_DISTRBUTIONLIST_ID"
  }
}