const en = {
  "account": {
    "account": "Account",
    "accounts": "Accounts",
    "firstname": "First name",
    "lastname": "Last name",
    "username": "Username",
    "email": "Email",
    "password": "Password",
    "editAccount": "Edit account",
    "newPassword": "New password",
    "confirmPassword": "Confirm password",
    "role": "Role",
    "viewAllAccounts": "View all accounts",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this account?",
      "removeSuccess": "Account removed successfully",
      "savedSuccess": "Account saved successfully"
    }
  }
}
const he = {
  "account": {
    "account": "משתמש",
    "accounts": "משתמשים",
    "firstname": "שם פרטי",
    "lastname": "שם משפחה",
    "username": "שם משתמש",
    "email": "דואר אלקטרוני",
    "password": "סיסמה",
    "editAccount": "ערוך פרטי משתמש",
    "newPassword": "סיסמה חדשה",
    "confirmPassword": "הזן שוב סיסמה",
    "role": "תפקיד",
    "viewAllAccounts": "הצג את כל משתמשי המערכת",
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את המשתמש?",
      "removeSuccess": "משתמש נמחק בהצלחה",
      "savedSuccess": "פרטי משתמש נשמרו בהצלחה"
    }
  }
}
const heF = {
  ...he,
  account: {
    ...he.account,
    "editAccount": "ערכי פרטי משתמש",
    "confirmPassword": "הזיני שוב סיסמה",
    "block": "חסמי",
    "unBlock": "בטלי חסימה",
    alerts: {
      ...he.account.alerts,
      "confirmRemove": "האם את בטוחה שאת רוצה למחוק את המשתמש?",
    }
  }
}

export const accountLocales = {
  en,
  he,
  heF
}