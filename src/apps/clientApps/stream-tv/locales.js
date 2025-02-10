const  en = {
  "releaseLocales": {
    "release": "Release",
    "releases": "Releases",
    "main": "Main",
    "monthlySummary": "Monthly summary",
    "broadcastTimes": "Broadcast times",
    archive: "Archive"
    // "monthPublish": "Month of publish",
    // "alerts": {
    //   "confirmRemove": "Are you sure you want to remove this release?",
    //   "removeSuccess": "Release removed successfully!",
    //   "savedReleaseSuccess": "Release saved successfully!",
    //   "reportReleaseSuccess": "Release reported successfully!"
    // },
    // "content": "Content",
    // "images": "Images",
    // "videos": "Videos",
    // "files": "Files",
    // "links": "Links"
  },
  archive: "Archive"
}
const he = {
  "releaseLocales": {
    "release": "רליס",
    "releases": "רליסים",
    "main": "ראשי",
    "monthlySummary": "תקצירי החודש",
    "broadcastTimes": "לוח שידורים",
    archive: "ארכיון"
    // "monthPublish": "חודש הוצאה לאור",
    // "alerts": {
    //   "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את הרליס?",
    //   "removeSuccess": "רליס נמחק בהצלחה!",
    //   "savedReleaseSuccess": "פרטי רליס נשמרו בהצלחה!",
    //   "reportReleaseSuccess": "רליס דווח בהצלחה!"
    // },
    // "content": "תקציר",
    // "images": "תמונות",
    // "videos": "צפיה",
    // "files": "קבצים",
    // "links": "קישורים"
  },
  archive: "ארכיון"
}
const heF = {
  ...he,
  releaseLocales: {
    ...he.releaseLocales,
    // alerts: {
    //   ...he.releaseLocales.alerts,
    //   "confirmRemove": "האם את בטוחה שאת רוצה למחוק את הרליס?",
    // }
  }
}
export default {
  en,
  he,
  heF
}