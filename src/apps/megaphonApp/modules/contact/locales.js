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
    "unsubscribed": "Unsubscribed",
    "unsubscribe": "Unsubscribe",
    "reSubscribe": "Resubscribe",
    "confirmToggleSubscriptionValueMsg": "Are you sure you want to change the subscribtion settings for this contact?",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this contact?",
      "removeSuccess": "Contact removed successfully",
      "savedSuccess": "Contact saved successfully",
    },
    "emailIsTakenError": "Contact with that email already exists",
    "maxTimesAllowdToWatchVideo": "Max times allowd to watch video",
    "uploadFileTooltipMsg": "csv or xl file.\nvalid columns:\nnfirstName, lastName, email, mobile, tags (sepparated by ,), company"
  },
}
const he = {
  "contactLocales": {
    "contact": "איש קשר",
    "contacts": "אנשי מדיה",
    "contactName": "שם איש מדיה",
    "role": "תפקיד",
    "companyName": "שם גוף",
    "editContact": "עריכת איש קשר",
    "createContact": "צור איש קשר",
    "notes": "הערות",
    "cellular": "נייד",
    "phone": "טלפון",
    "mobile": "טלפון נייד",
    "uploadFromFile": "העלה קובץ",
    "unsubscribed": "ביטל מנוי",
    "unsubscribe": "ביטול מנוי",
    "reSubscribe": "חידוש מנוי",
    "confirmToggleSubscriptionValueMsg": "האם אתה בטוח שאתה מעוניין לשנות את פרטי ההרשמה של איש קשר זה?",
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את איש הקשר?",
      "removeSuccess": "איש קשר נמחק בהצלחה",
      "savedSuccess": "פרטי איש קשר נשמרו בהצלחה",
    },
    "emailIsTakenError": "איש קשר עם המייל הזה כבר קיים במערכת",
    "maxTimesAllowdToWatchVideo": "כמות צפיות מקסימלית בוידאו",
    "uploadFileTooltipMsg": "קובץ מסוג csv או xl.\nשמות העמודות:\nfirstName, lastName, email, mobile, tags (מופרד עם ,), company"
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