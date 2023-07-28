const en = {
  "organization": {
    "organization": "Organization",
    "organizations": "Organizations",
    "editOrganization": "Edit organization",
    "name": "Organization name",
    "fromEmails": "From emails",
    "logos": "logos",
    "logo": "logo",
    "defaultGalleryCredit": "Default gallery credit",
    "distributionBcc": "Distribution Bcc",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this organization?",
      "removeSuccess": "Organization removed successfully",
      "savedSuccess": "Organization saved successfully"
    }
  }
}
const he = {
  "organization": {
    "organization": "ארגון",
    "organizations": "ארגונים",
    "editOrganization": "ערוך פרטי ארגון",
    "newPassword": "סיסמה חדשה",
    "unBlock": "בטל חסימה",
    "name": "שם האירגון",
    "fromEmails": "כתובות דוא״ל מהן מופץ הרליס",
    "logos": "לוגואים",
    "logo": "לוגו",
    "defaultGalleryCredit": "ברירת מחדל לקרדיט גלריה",
    "distributionBcc": "הפצה bcc",
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את הארגון?",
      "removeSuccess": "ארגון נמחק בהצלחה",
      "savedSuccess": "פרטי ארגון נשמרו בהצלחה"
    }
  }
}
const heF = {
  ...he,
  organization: {
    ...he.organization,
    "editOrganization": "ערכי פרטי ארגון",
    alerts: {
      ...he.organization.alerts,
      "confirmRemove": "האם את בטוחה שאת רוצה למחוק את הארגון?",
    }
  }
}

export const organizationLocales = {
  en,
  he,
  heF
}