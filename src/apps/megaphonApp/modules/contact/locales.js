const  en = {
  "contactLocales": {
    "contact": "Contact",
    "contacts": "Contacts",
    "contactName": "Contact name",
    "role": "Role",
    "companyName": "Company name",
    "editContact": "Edit contact",
    "createContact": "Create contact",
    "notes": "Notes",
    "cellular": "Cellular",
    "phone": "Phone",
    "mobile": "Mobile",
    "uploadFromFile": "Import file",
    "loadXlFile": "Load Xl file",
    "unsubscribed": "Unsubscribed",
    "unsubscribe": "Unsubscribe",
    "reSubscribe": "Resubscribe",
    "confirmToggleSubscriptionValueMsg": "Are you sure you want to change the subscribtion settings for this contact?",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this contact?",
      "removeSuccess": "Contact removed successfully",
      "savedSuccess": "Contact saved successfully",
      "cantUploadContactsError": "Something went wrong, cant upload contacts file",
      "uploadedContactsSuccessfully": "Uploaded contacts file successfully",
      "saveAsMailingListPromptMsg": "Save also as mailing list? (canceling will save the contacts but will not create a mailing list)",
      "confirmUploadContactsFileMsg": "Are you sure you want to upload this file?"
    },
    "emailIsTakenError": "Contact with that email already exists",
    "maxTimesAllowdToWatchVideo": "Max times allowd to watch video",
    "uploadFileTooltipMsg": "xl file.\nvalid columns:\nemail, firstName, lastName,\nmobile (format: +972500000000),\ntags (sepparated by ,),\ncompany",
    "downloadEmtyFileToFill": "Doanload empty file to fill"
  },
}
const he = {
  "contactLocales": {
    "contact": "איש קשר",
    "contacts": "אנשי קשר",
    "contactName": "שם איש קשר",
    "role": "תפקיד",
    "companyName": "גוף תקשורת",
    "tags": "תגיות",
    "editContact": "עריכת איש קשר",
    "createContact": "צור איש קשר",
    "notes": "הערות",
    "cellular": "נייד",
    "phone": "טלפון",
    "mobile": "טלפון נייד",
    "uploadFromFile": "העלה קובץ",
    "loadXlFile": "טען קובץ אקסל",
    "unsubscribed": "ביטל מנוי",
    "unsubscribe": "ביטול מנוי",
    "reSubscribe": "חידוש מנוי",
    "confirmToggleSubscriptionValueMsg": "האם אתה בטוח שאתה מעוניין לשנות את פרטי ההרשמה של איש קשר זה?",
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את איש הקשר?",
      "removeSuccess": "איש קשר נמחק בהצלחה",
      "savedSuccess": "פרטי איש קשר נשמרו בהצלחה",
      "cantUploadContactsError": "משהו השתבש, המערכת לא הצליחה להעלות את הקובץ",
      "uploadedContactsSuccessfully": "אנשי קשר הועלו בהצלחה",
      "saveAsMailingListPromptMsg": "האם תרצה לשמור בנוסף כרשימת תפוצה? (ביטול ישמור את אנשי הקשר אך ללא רשימת תפוצה)",
      "confirmUploadContactsFileMsg": "האם אתה בטוח שתרצה להעלות את הקובץ?"
    },
    "emailIsTakenError": "איש קשר עם המייל הזה כבר קיים במערכת",
    "maxTimesAllowdToWatchVideo": "כמות צפיות מקסימלית בוידאו",
    "uploadFileTooltipMsg": "קובץ מסוג xl.\nשמות העמודות:\nfirstName, lastName, email,\nmobile (format: +972500000000),\ntags (מופרד עם ,),\ncompany\n\nשמות העמודות צריכות להיות במדוייק כדי שהמידע ייקלט בצורה תקינה.",
    "downloadEmtyFileToFill": "הורד קובץ ריק למילוי"
  },
}
const heF = {
  ...he,
  contactLocales: {
    ...he.contactLocales,
    alerts: {
      ...he.contactLocales.alerts,
      "confirmRemove": "האם את בטוחה שאת רוצה למחוק את איש הקשר?",
    }
  }
}
export const contactLocales = {
  en,
  he,
  heF
}