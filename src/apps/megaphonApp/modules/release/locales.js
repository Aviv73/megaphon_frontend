const  en = {
  "release": {
    "release": "Release",
    "releases": "Releases",
    "editRelease": "Edit release",
    "createRelease": "Create release",
    "saveAndClose": "Save and close",
    "confirmAndDistribute": "Confirm and distribute",
    "designAndPreview": "Design and preview",
    "landingPageDesign": "Landing page design",
    "newsletterDesign": "Newsletter design",
    "searchReleases": "Search releases",
    "filterByYear": "Filter by year",
    "addToFolder": "Add to folder",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this release?",
      "removeSuccess": "Release removed successfully",
      "savedSuccess": "Release saved successfully",
      "leaveConfirm": "Leave without saving?"
    },

    bought: 'bought',
    original: 'original',

    distributedAt: "Distributed at"
  },
  "distribute": {
    "distributeRelease": "Distribute release",
    "contactsToDistribute": "Contacts to distribute",
    "selfContacts": "Self contacts",
    "contactsWasSelected": "contacts was selected",
    "fromEmail": "From email",
    "addCustomContact": "Add contact email",
    "customEmailToAdd": "Contact email to add",
    "sendTestMail": "Send test mail",
    "confirmAndDistribute": "Confirm and distribute",
    "distributeReleaseConfirmMsg": "Are you sure you want to distribute the release?",

    "remove": "remove",
    "add": "add",
    "addAll": "add all",
    "removeAll": "remove all",
    "mailingList": "Mailing lists",
    "noMailingListsFound": "No mailing lists found",
    "cantCreateEmptyMailingList": "Cant create empty mailing list",
    "saveMailingList": "Save contact list",
    "testEmail": "Test email",

    "sccessfullyDistributedReleaseTo": "Successfully distributed release to",
    "cantSenDistributionTo": "Couldn`t send distribution email to",
    "tryAgain": "Try again",
    "backToEditRelease": "Back to edit release",
    "noMatchingDesignTemplateFound": "No matching newsletter design was found",

    "loadDistributionList": "Load distribution list",
    "saveDistributionList": "Save distribution list",

    "report": "Report",

    "loadingMsg": "Distributing release, it might take a while",
    wached: 'Wached',
    newsOpened: 'Newsletter opened',
    newsletter: 'News letter',
    "enterenceOrigins": 'Enterence Origins',
    copySendToEmailUrl: 'Copy url to send in email',
    'origin': 'Origin',
    'unsubscribed': 'Unsubscribed',
    origins: {
      email: 'Email',
      distribution: 'Distribution'
    },
    allowReply: 'Allow response'
  }
}
const he = {
  "release": {
    "release": "רליס",
    "releases": "רליסים",
    "editRelease": "עריכת רליס",
    "createRelease": "יצירת רליס",
    "saveAndClose": "שמירה ויציאה",
    "confirmAndDistribute": "אישור והפצה",
    "designAndPreview": "עיצוב ותצוגה מקדימה",
    "landingPageDesign": "עיצוב דף נחיתה",
    "newsletterDesign": "עיצוב מייל הפצה",
    "searchReleases": "חפש רליסים",
    "filterByYear": "פלטר לפי שנה",
    "addToFolder": "הוסף לתיקייה",
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את הרליס?",
      "removeSuccess": "רליס נמחק בהצלחה",
      "savedSuccess": "פרטי רליס נשמרו בהצלחה",
      "leaveConfirm": "האם אתה בטוח שאתה מעוניין לעזוב מבלי לשמור את השינויים?"
    },
    bought: 'רכש',
    original: 'מקור',

    distributedAt: "הופץ"
  },
  "distribute": {
    "distributeRelease": "הפצת רליס",
    "contactsToDistribute": "אנשי קשר להפצה",
    "selfContacts": "ספר כתובות אישי",
    "contactsWasSelected": "אנשי קשר נבחרו",
    "fromEmail": "אימייל שליחה",
    "addCustomContact": "הוספת מייל איש קשר",
    "customEmailToAdd": "אימייל",
    "sendTestMail": "שלח מייל בדיקה",
    "confirmAndDistribute": "אישור והפצה",
    "distributeReleaseConfirmMsg": "האם אתה בטוח שאתה מעוניין להפיץ את הרליס?",

    "remove": "הסר",
    "add": "הוסף",
    "addAll": "הוסף הכל",
    "removeAll": "הסר הכל",
    "mailingList": "רשימת תפוצה",
    "noMailingListsFound": "לא נמצאו רשימות תפוצה",
    "cantCreateEmptyMailingList": "אי אפשר לייצר רשימת תפיצה ריקה",
    "saveMailingList": "שמור רשימת תפוצה",
    "testEmail": "מייל בדיקה",

    "sccessfullyDistributedReleaseTo": "רליס הופץ בהצלחה ל",
    "cantSenDistributionTo": "המערכת לא הצליחה להפיץ רליס ל",
    "tryAgain": "נסה שוב",
    "backToEditRelease": "חזור לעריכת רליס",
    "noMatchingDesignTemplateFound": "לא נמצאה תבנית עיצובית מתאימה למייל הפצה",

    "loadDistributionList": "טען רשימת תפוצה",
    "saveDistributionList": "שמור רשימת תפוצה",

    "report": "דוח רליס",

    "loadingMsg": "מפיץ את הרליס, זה עשוי לקחת רגע..",
    wached: 'צפייה',
    newsOpened: 'ניוזלטר נפתח',
    newsletter: 'ניוזלטר',
    "enterenceOrigins": 'מקורות כניסה',
    copySendToEmailUrl: 'העתק קישור לשליחה במייל',
    origin: 'מקור',
    'unsubscribed': 'ביטל מנוי',
    origins: {
      email: 'אימייל',
      distribution: 'הפצה'
    },
    allowReply: 'אפשר תגובה'
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