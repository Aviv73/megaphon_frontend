const  en = {
  "release": {
    "release": "Release",
    "releases": "Releases",
    "main": "Main",
    "monthlySummary": "Monthly summary",
    "broadcastTimes": "Broadcast times"
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
  }
}
const he = {
  "release": {
    "release": "רליס",
    "releases": "רליסים",
    "main": "ראשי",
    "monthlySummary": "תקצירי החודש",
    "broadcastTimes": "לוח שידורים"
    // "monthPublish": "חודש הוצאה לאור",
    // "alerts": {
    //   "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את הרליס?",
    //   "removeSuccess": "רליס נמחק בהצלחה!",
    //   "savedReleaseSuccess": "פרטי רליס נשמרו בהצלחה!",
    //   "reportReleaseSuccess": "רליס דווח בהצלחה!"
    // },
    // "content": "מידע",
    // "images": "תמונות",
    // "videos": "לצפיה",
    // "files": "קבצים",
    // "links": "קישורים"
  }
}
const heF = {
  ...he,
  release: {
    ...he.release,
    // alerts: {
    //   ...he.release.alerts,
    //   "confirmRemove": "האם את בטוחה שאת רוצה למחוק את הרליס?",
    // }
  }
}
export default {
  en,
  he,
  heF
}