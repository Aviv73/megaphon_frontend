const en = {
  "organizationLocales": {
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
    "loginPagePreferences": "Login page preferences",
    "loginPageBgImage": "login page background image",
    "loginBgImg": "Login page bg img",
    "loginPageMsg": "Login page msg",
    "bodyColor": "Text color",
    "bodyBg": "Bsckground color",
    "headerColor": "Header text color",
    "headerBg": "Header background color",
    "headersColor": "Headings text color",
    "headersBgColor": "Headings bg color",
    "domainTakenError": "Domain is alredy taken by another organization!",
    "inviteMembers": "Invite members",
    "searchOrganizations": "Search organization",
    "addOrganization": 'Add organization',
    "mediaLinks": "Media",
    "requireAuth": "Require authentication",
    "require2FactorAuth": "Require 2nd factor authentication",
    "useVideoWaterMark": "Use video watermark",
    "organizationSettings": "Organization settings",
    "orgRoles": {
      "creator": "Creator",
      "admin": "Admin",
      "producer": "Producer",
      "user": "User",
      "client": "Watch only",
      "developer": "Developer"
    },
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this organization?",
      "removeSuccess": "Organization removed successfully",
      "savedSuccess": "Organization saved successfully",
      "invetationSentSuccess": "Invetation sent successfully",
      "requestSentSuccess": "Request sent successfully",
      "confirmAccountApproval": "Are you sure you want to approve this account to join the organization?"
    },
    "approveJoin": "Approve join",
    "saveOrgToUploadFilesMsg": "Save organization in order to upload files"
  }
}
const he = {
  "organizationLocales": {
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
    "loginPagePreferences": "העדפות דף התחברות",
    "loginPageBgImage": "תמונת רקע",
    "loginBgImg": "צבע רקע",
    "loginPageMsg": "הודעה",
    "bodyColor": "צבע טקסט",
    "bodyBg": "צבע רקע",
    "headerColor": "צבע טקסט הדר",
    "headerBg": "צבע רקע הדר",
    "headersColor": "צבע כותרים",
    "headersBgColor": "צבע רקע כותרים",
    "domainTakenError": "הדומיין הזה כבר בשימוש באירגון אחר!",
    "inviteMembers": "הזמן משתמשים",
    "searchOrganizations": "חפש ארגון",
    "addOrganization": 'הצטרף לארגון',
    "mediaLinks": "מדיה",
    "requireAuth": "דרושה הזדהות",
    "require2FactorAuth": "דרושה הזדהות נוספת",
    "useVideoWaterMark": "ווטרמארק על וידאו",
    "organizationSettings": "הגדרות ארגון",
    "orgRoles": {
      "creator": "יוצר",
      "admin": "אדמין",
      "producer": "מפיץ",
      "user": "משתמש",
      "client": "צפיה",
      "developer": "מפתח"
    },
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את הארגון?",
      "removeSuccess": "ארגון נמחק בהצלחה",
      "savedSuccess": "פרטי ארגון נשמרו בהצלחה",
      "invetationSentSuccess": "הזמנה נשלחה בהצלחה",
      "requestSentSuccess": "בקשה נשלחה בהצלחה",
      "confirmAccountApproval": "האם אתה בטוח שאתה מעוניין לאשר את הצטרפות המשתמש לארגון?"
    },
    "approveJoin": "אשר הצטרפות",
    "saveOrgToUploadFilesMsg": "שמור את הארגון על מנת להעלות קבצים"
  }
}
const heF = {
  ...he,
  organizationLocales: {
    ...he.organizationLocales,
    "editOrganization": "ערכי פרטי ארגון",
    "createOrganization": "צרי ארגון חדש",
    "inviteMembers": "הזמיני משתמשים",
    alerts: {
      ...he.organizationLocales.alerts,
      "confirmRemove": "האם את בטוחה שאת רוצה למחוק את הארגון?",
    }
  }
}

export const organizationLocales = {
  en,
  he,
  heF
}