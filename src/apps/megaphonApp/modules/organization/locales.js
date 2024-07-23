const en = {
  "organization": {
    "organization": "Organization",
    "organizations": "Organizations",
    "editOrganization": "Edit organization",
    "createOrganization": "Create organization",
    "name": "Organization name",
    "fromEmails": "From emails",
    "logos": "logos",
    "logo": "logo",
    "defaultGalleryCredit": "Default gallery credit",
    "distributionBcc": "Distribution Bcc",
    "domain": "Sub Domain",
    "clientApp": "Client app",
    "designPreferences": "Landing page preferences",
    "bodyColor": "Text color",
    "bodyBg": "Bsckground color",
    "headerColor": "Header text color",
    "headerBg": "Header background color",
    "headersColor": "Headings text color",
    "domainTakenError": "Domain is alredy taken by another organization!",
    "inviteMembers": "Invite members",
    "searchOrganizations": "Search organization",
    "addOrganization": 'Add organization',
    "orgRoles": {
      "admin": "Admin",
      "producer": "Producer",
      "user": "User",
      "client": "Watch only"
    },
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this organization?",
      "removeSuccess": "Organization removed successfully",
      "savedSuccess": "Organization saved successfully",
      "invetationSentSuccess": "Invetation sent successfully",
      "requestSentSuccess": "Request sent successfully",
      "confirmAccountApproval": "Are you sure you want to approve this account to join the organization?"
    },
    "approveJoin": "Approve join"
  }
}
const he = {
  "organization": {
    "organization": "ארגון",
    "organizations": "ארגונים",
    "editOrganization": "ערוך פרטי ארגון",
    "createOrganization": "צור ארגון חדש",
    "newPassword": "סיסמה חדשה",
    "unBlock": "בטל חסימה",
    "name": "שם האירגון",
    "fromEmails": "כתובות דוא״ל מהן מופץ הרליס",
    "logos": "לוגואים",
    "logo": "לוגו",
    "defaultGalleryCredit": "ברירת מחדל לקרדיט גלריה",
    "distributionBcc": "הפצה bcc",
    "domain": "תת דומיין",
    "clientApp": "אפליקציית לקוח",
    "designPreferences": "העדפות דף נחיתה",
    "bodyColor": "צבע טקסט",
    "bodyBg": "צבע רקע",
    "headerColor": "צבע טקסט הדר",
    "headerBg": "צבע רקע הדר",
    "headersColor": "צבע כותרים",
    "domainTakenError": "הדומיין הזה כבר בשימוש באירגון אחר!",
    "inviteMembers": "הזמן משתמשים",
    "searchOrganizations": "חפש ארגון",
    "addOrganization": 'הצטרף לארגון',
    "orgRoles": {
      "admin": "אדמין",
      "producer": "מפיץ",
      "user": "משתמש",
      "client": "צפיה בלבד"
    },
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את הארגון?",
      "removeSuccess": "ארגון נמחק בהצלחה",
      "savedSuccess": "פרטי ארגון נשמרו בהצלחה",
      "invetationSentSuccess": "הזמנה נשלחה בהצלחה",
      "requestSentSuccess": "בקשה נשלחה בהצלחה",
      "confirmAccountApproval": "האם אתה בטוח שאתה מעוניין לאשר את הצטרפות המשתמש לארגון?"
    },
    "approveJoin": "אשר הצרפות"
  }
}
const heF = {
  ...he,
  organization: {
    ...he.organization,
    "editOrganization": "ערכי פרטי ארגון",
    "createOrganization": "צרי ארגון חדש",
    "inviteMembers": "הזמיני משתמשים",
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