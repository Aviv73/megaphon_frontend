const  en = {
  "release": {
    "release": "Release",
    "releases": "Releases",
    "by": "By",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this release?",
      "removeSuccess": "Release removed successfully!",
      "savedReleaseSuccess": "Release saved successfully!",
      "reportReleaseSuccess": "Release reported successfully!"
    }
  }
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
    "content": "מידע",
    "images": "תמונות",
    "videos": "לצפיה",
    "files": "קבצים",
    "links": "קישורים"
  }
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
export const releaseLocales = {
  en,
  he,
  heF
}