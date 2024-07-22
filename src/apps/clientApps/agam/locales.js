const  en = {
  "release": {
    "release": "Release",
    "releases": "Releases",
    "by": "By",
    "paint": "Paint",
    "translator": "Translator",
    "pageCount": "Page count",
    "forAge": "Ages",
    "monthPublish": "Month of publish",
    "price": "Price",
    "main": "Main",
    "firstChapter": "First chapter",
    "comunicat": "Press file",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this release?",
      "removeSuccess": "Release removed successfully!",
      "savedReleaseSuccess": "Release saved successfully!",
      "reportReleaseSuccess": "Release reported successfully!"
    },

    bought: 'bought',
    original: 'original'
  },
  "about": "About Agam",
  "allBooks": "All books",
  "archive": "Archive"
}
const he = {
  "release": {
    "release": "רליס",
    "releases": "רליסים",
    "by": "מאת",
    "paint": "איור",
    "translator": "תרגום",
    "pageCount": "מספר עמודים",
    "forAge": "גילאים",
    "monthPublish": "חודש הוצאה לאור",
    "price": "מחיר לצרכן",
    "main": "כללי",
    "firstChapter": "פרק ראשון",
    "comunicat": "קומוניקט",
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את הרליס?",
      "removeSuccess": "רליס נמחק בהצלחה!",
      "savedReleaseSuccess": "פרטי רליס נשמרו בהצלחה!",
      "reportReleaseSuccess": "רליס דווח בהצלחה!"
    },
    bought: 'רכש',
    original: 'מקור'
  },
  "about": "אודות אגם",
  "allBooks": "לכל ספרי אגם",
  "archive": "ארכיון"
}
const heF = {
  ...he,
  release: {
    ...he.release,
    alerts: {
      ...he.release.alerts,
      "confirmRemove": "האם את בטוחה שאת רוצה למחוק את הרליס?",
    }
  }
}
export default {
  en,
  he,
  heF
}