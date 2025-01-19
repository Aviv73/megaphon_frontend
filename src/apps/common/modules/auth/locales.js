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
    "mobile": "Mobile",
    "alerts": {
      "welcomeBack": "Welcome back",
      "goodby": "Goodby",
      "welcome": "Welcome",
    },
    "emailIsTakenError": "User with that email already exists",
    "notLoggedInError": "Unauthorized, please login",
    "userNotAllowedError": "User not allowed",
    "invalidEmailOrPasswordError": "Invalid email or password",
    "cantFindAccountWithEmailError": "Could not find account with this email",
    "unAuthorizedError": "Un Authorized",

    "required2FactorAthMsg_": "Required 2 factor authentication. To finish authentication, please open your mobile and enter the password we sent to you",
    "required2FactorAthMsg": "Required 2 factor authentication",
  
    "secondFactorMethodMsg": "Method",
    "passValidationExplenation": "The password needs to be in 10 characters length and needs to include a number, an endlish character and a special character",
    
    "unknownEmailError": "Uunknown Email",
    "secFactorPassExpirationMsg": "The second factor auth password is valid fot 5 minutes",
    
    "cantSendSecondFactorAuthError": "Something went wrong, cant send second factor authentication password"
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
    "mobile": "נייד",
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
    "needsLoginError": "יש להתחבר למערכת",

    "required2FactorAthMsg_": "נדרשת הזדהות נוספת. כדי לסיים את הליך ההתחברות, אנא הזן את הסיסמה שנשלחה אליך לנייד.",
    "required2FactorAthMsg": "נדרשת הזדהות נוספת כדי לסיים את הליך ההתחברות על ידי סיסמה חד פעמית שתשלח אליך",
    
    "secondFactorMethodMsg": "בחר כיצד אתה מעוניין לקבל את הסיסמה",
    "passValidationExplenation": "הסיסמה צריכה להיות באורך של 10 תוים לפחות וצריכה לכלול: מספר, אות באנגלית, ותו מיוחד",
    
    "unknownEmailError": "כתובת מייל לא מוכרת",
    "secFactorPassExpirationMsg": "הקוד החד פעמי תקף ל5 דקות",
    
    "cantSendSecondFactorAuthError": "משהו השתבש, המערכת לא הצליחה לשלוח את קוד האימות"
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