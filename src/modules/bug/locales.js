const  en = {
  "bug": {
    "bug": "Bug",
    "bugs": "Bugs",
    "reportABug": "Report a bug",
    "resolve": "resolve",
    "ignore": "Ignore",
    "pending": "Pending",
    "reportABugMsg": "Found a bug in our system? getting errors? something feels wrong or just could work better? tell us about it!",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this bug?",
      "removeSuccess": "Bug removed successfully!",
      "savedBugSuccess": "Bug saved successfully!",
      "reportBugSuccess": "Bug reported successfully!"
    }
  }
}
const he = {
  "bug": {
    "bug": "באג",
    "bugs": "באגים",
    "reportABug": "דווח על באג",
    "resolve": "פתור",
    "ignore": "התעלם",
    "pending": "בעבודה",
    "reportABugMsg": "מצאת באג במערכת? חוטף שגיאות וארורים? משהו מרגיש לא כשורה או פשוט יכול לעבוד טוב יותר? ספר לנו!",
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את הבאג?",
      "removeSuccess": "באג נמחק בהצלחה!",
      "savedBugSuccess": "פרטי באג נשמרו בהצלחה!",
      "reportBugSuccess": "באג דווח בהצלחה!"
    }
  }
}
const heF = {
  ...he,
  bug: {
    ...he.bug,
    "reportABug": "דווחי על באג",
    "resolve": "פתרי",
    "ignore": "התעלמי",
    "reportABugMsg": "מצאת באג במערכת? חוטפת שגיאות וארורים? משהו מרגיש לא כשורה או פשוט יכול לעבוד טוב יותר? ספרי לנו!",
    alerts: {
      ...he.bug.alerts,
      "confirmRemove": "האם את בטוחה שאת רוצה למחוק את הבאג?",
    }
  }
}
export const bugLocales = {
  en,
  he,
  heF
}