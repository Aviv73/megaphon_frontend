const  en = {
  "auth": {
    "logout": "Logout",
    "editUserDetails": "Edit user details",
    "forgotPassword": "Forgot password?",
    "sendMeNewPassword": "Send me new password",
    "newPasswordSentTo": "New password sent to email",
    "firstname": "First name",
    "lastname": "Last name",
    "username": "Username",
    "email": "Email",
    "password": "Password",
    "newPassword": "New password",
    "confirmPassword": "Confirm password",
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
    "unAuthorizedError": "Un Authorized",

    "required2FactorAthMsg": "Required 2 factor authentication. To finish authentication, please open your mobile and enter the password we sent to you"
  },
}
const he = {
  "auth": {
    "logout": "התנתק",
    "editUserDetails": "ערוך פרטי משתמש",
    "forgotPassword": "שכחת סיסמה?",
    "sendMeNewPassword": "שלח לי סיסמה חדשה",
    "newPasswordSentTo": "סיסמה חדשה נשלחה למייל",
    "firstname": "שם פרטי",
    "lastname": "שם משפחה",
    "username": "שם משתמש",
    "email": "דואר אלקטרוני",
    "password": "סיסמה",
    "newPassword": "סיסמה חדשה",
    "confirmPassword": "הזן שוב סיסמה",
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
    "unAuthorizedError": "לא מורשה",

    "required2FactorAthMsg": "נדרשת הזדהות נוספת. כדי לסיים את הליך ההתחברות, אנא הזן את הסיסמה שנשלחה אליך לנייד."
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