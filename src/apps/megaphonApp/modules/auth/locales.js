const  en = {
  "auth": {
    "logout": "Logout",
    "editUserDetails": "Edit user details",
    "forgotPassword": "Forgot password?",
    "sendMeNewPassword": "Send me new password",
    "newPasswordSentTo": "New password sent to email",
    "alerts": {
      "welcomeBack": "Welcome back",
      "goodby": "Goodby",
      "welcome": "Welcome"
    }
  },
  "notLoggedInError": "Unauthorized, please login",
  "userNotAllowedError": "User not allowed",
  "invalidUsernameOrPasswordError": "Invalid username or password",
  "cantFindAccountWithEmailError": "Could not find account with this email",
}
const he = {
  "auth": {
    "logout": "התנתק",
    "editUserDetails": "ערוך פרטי משתמש",
    "forgotPassword": "שכחת סיסמה?",
    "sendMeNewPassword": "שלח לי סיסמה חדשה",
    "newPasswordSentTo": "סיסמה חדשה נשלחה למייל",
    "alerts": {
      "welcomeBack": "ברוך שובך",
      "goodby": "להתראות",
      "welcome": "ברוך הבא"
    }
  },
  "notLoggedInError": "לא מורשה, יש להתחבר למערכת",
  "userNotAllowedError": "אין הרשאה למשתמש",
  "invalidUsernameOrPasswordError": "שם משתמש או סיסמא שגויים",
  "cantFindAccountWithEmailError": "לא נמצא משתמש עם כתובת המייל הזאת",
}
const heF = {
  ...he,
  auth: {
    ...he.auth,
    alerts: {
      ...he.auth.alerts
    }
  }
}
export const authLocales = {
  en,
  he,
  heF
}