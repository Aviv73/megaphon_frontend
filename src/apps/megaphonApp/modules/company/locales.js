const  en = {
  "company": {
    "company": "company",
    "companies": "companies",
    "by": "By",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this company?",
      "removeSuccess": "company removed successfully",
      "savedSuccess": "company saved successfully",
    }
  }
}
const he = {
  "company": {
    "company": "ארגון",
    "companies": "ארגונים",
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את התגית?",
      "removeSuccess": "ארגון נמחק בהצלחה",
      "savedSuccess": "פרטי ארגון נשמרו בהצלחה",
    }
  },

}
const heF = {
  ...he,
  company: {
    ...he.company,
    alerts: {
      ...he.company.alerts,
      "confirmRemove": "האם את בטוחה שאת רוצה למחוק את התגית?",
    }
  }
}
export const companyLocales = {
  en,
  he,
  heF
}