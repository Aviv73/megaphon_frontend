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
    },
    "emailIsTakenError": "User with that email already exists",
    "notLoggedInError": "Unauthorized, please login",
    "userNotAllowedError": "User not allowed",
    "invalidEmailOrPasswordError": "Invalid email or password",
    "cantFindAccountWithEmailError": "Could not find account with this email",
  },
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
    },
    "emailIsTakenError": "משתמש עם המייל הזה כבר קיים במערכת",
    // "notLoggedInError": "לא מורשה, יש להתחבר למערכת",
    "notLoggedInError": "יש להתחבר למערכת",
    "userNotAllowedError": "אין הרשאה למשתמש",
    "invalidEmailOrPasswordError": "מייל או סיסמה שגויים",
    "cantFindAccountWithEmailError": "לא נמצא משתמש עם כתובת המייל הזאת",
  },
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