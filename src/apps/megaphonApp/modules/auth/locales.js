const  en = {
  "auth": {
    "logout": "Logout",
    "editUserDetails": "Edit user details",
    "alerts": {
      "welcomeBack": "Welcome back",
      "goodby": "Goodby",
      "welcome": "Welcome"
    }
  },
  "notLoggedInError": "Unauthorized, please login",
  "userNotAllowedError": "User not allowed"
}
const he = {
  "auth": {
    "logout": "התנתק",
    "editUserDetails": "ערוך פרטי משתמש",
    "alerts": {
      "welcomeBack": "ברוך שובך",
      "goodby": "להתראות",
      "welcome": "ברוך הבא"
    }
  },
  "notLoggedInError": "לא מורשה, יש להתחבר למערכת",
  "userNotAllowedError": "אין הרשאה למשתמש"
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