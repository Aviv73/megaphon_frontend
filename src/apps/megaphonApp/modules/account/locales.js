const en = {
  "accountLocales": {
    "createAccount": "Create Account",
    "account": "Account",
    "accounts": "Accounts",
    "firstname": "First name",
    "lastname": "Last name",
    "username": "Username",
    "email": "Email",
    "mobile": "Mobile",
    "password": "Password",
    "editAccount": "Edit account",
    "newPassword": "New password",
    "confirmPassword": "Confirm password",
    "role": "Role",
    "viewAllAccounts": "View all accounts",
    "inviteAccounts": "Invite accounts",
    "isPandingForApproval": "Panding for approval",
    "newsletter": "Newsletter",
    "skipSecondFactorAuth": "Skip second actor auth",
    "mediaAccounts": "Media accounts",
    mailing: {
      "sms": "Sms",
      "newsletter": "Newsletter",
      unsubscribeMsg: "No, I dont want to recive any mailing from Megaphon."
    },
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this account?",
      "removeSuccess": "Account removed successfully",
      "savedSuccess": "Account saved successfully",
      "cantUploadContactsError": "Something went wrong, cant upload contacts file",
      "uploadedContactsSuccessfully": "Uploaded contacts file successfully"
    }
  }
}
const he = {
  "accountLocales": {
    "createAccount": "צור משתמש",
    "account": "משתמש",
    "accounts": "משתמשים",
    "firstname": "שם פרטי",
    "lastname": "שם משפחה",
    "username": "שם משתמש",
    "email": "דואר אלקטרוני",
    "mobile": "נייד",
    "password": "סיסמה",
    "editAccount": "ערוך פרטי משתמש",
    "newPassword": "סיסמה חדשה",
    "confirmPassword": "הזן שוב סיסמה",
    "role": "תפקיד",
    "viewAllAccounts": "הצג את כל משתמשי המערכת",
    "inviteAccounts": "הזמן משתמשים",
    "isPandingForApproval": "ממתין לאישור",
    "newsletter": "ניוזלטר",
    "skipSecondFactorAuth": "בטל אימות שני",
    "mediaAccounts": "אנשי מדיה",
    mailing: {
      "sms": "sms",
      "newsletter": "ניוזלטר",
      unsubscribeMsg: "לא, אני לא מעוניין בקבלת דיוור כלשהו מאתר מגפון"
    },
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את המשתמש?",
      "removeSuccess": "משתמש נמחק בהצלחה",
      "savedSuccess": "פרטי משתמש נשמרו בהצלחה",
      "cantUploadContactsError": "משהו השתבש, המערכת לא הצליחה להעלות את הקובץ",
      "uploadedContactsSuccessfully": "אנשי קשר הועלו בהצלחה"
    }
  }
}
const heF = {
  ...he,
  accountLocales: {
    ...he.accountLocales,
    "createAccount": "צרי משתמש",
    "editAccount": "ערכי פרטי משתמש",
    "confirmPassword": "הזיני שוב סיסמה",
    "block": "חסמי",
    "unBlock": "בטלי חסימה",
    alerts: {
      ...he.accountLocales.alerts,
      "confirmRemove": "האם את בטוחה שאת רוצה למחוק את המשתמש?",
    }
  }
}

export const accountLocales = {
  en,
  he,
  heF
}