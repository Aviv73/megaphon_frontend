const  en = {
  "contact": {
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
    "uploadFromFile": "Import file",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this contact?",
      "removeSuccess": "Contact removed successfully",
      "savedSuccess": "Contact saved successfully",
    }
  }
}
const he = {
  "contact": {
    "contact": "איש קשר",
    "contacts": "אנשי קשר",
    "contactName": "שם איש מדיה",
    "role": "תפקיד",
    "companyName": "שם גוף",
    "editContact": "עריכת איש קשר",
    "createContact": "צור איש קשר",
    "notes": "הערות",
    "cellular": "נייד",
    "phone": "טלפן",
    "uploadFromFile": "העלה קובץ",
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את איש הקשר?",
      "removeSuccess": "איש קשר נמחק בהצלחה",
      "savedSuccess": "פרטי איש קשר נשמרו בהצלחה",
    },
  }
}
const heF = {
  ...he,
  contact: {
    ...he.contact,
    alerts: {
      ...he.contact.alerts,
      "confirmRemove": "האם את בטוחה שאת רוצה למחוק את איש הקשר?",
    }
  }
}
export const contactLocales = {
  en,
  he,
  heF
}