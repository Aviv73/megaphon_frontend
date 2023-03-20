const  en = {
  "organization": {
    "organization": "Organization",
    "organizations": "Organizations",
    "newOrganization": "New Organization",
    "editOrganization": "Edit organization",
    "createOrganization": "Create new organization",
    "yourRoles": "Your roles",
    "members": "Members",
    "inviteMembers": "Invite members",
    "alerts": {
      "confirmRemoveOrg": "Are you sure you want to remove this organization?",
      "removedSuccess": "Organization removed successfully",
      "savedSuccess": "Organization saved successfully",
      "invetationSentSuccess": "Invetation sent successfully",
      "confirmLeave": "Are you sure you want to leave this organization?",
      "confirmRemoveAccount": "Are you sure you want to remove this account from the organization?"
    }
  },
  "noAuthToRemoveOrganizationError": "Unauthorized, cant remove organization",
  "noAuthToEditOrganizationError": "Unauthorized, cant edit organization",
  "noAuthToChangeAccountOrganizationStatusError": "Unauthorized, cant change account status in organization",
  "userNotAllowdInOrganizationError": "Authorization error: user not allowd",
  "noAuthToChangeAccountOrganizationRolesError": "Unauthorized, cant change account roles in organization",
  "noAuthToRemoveUserFromOrganizationError": "Unauthorized, cant remove account from organization"
}
const he = {
  "organization": {
    "organization": "ארגון",
    "organizations": "ארגונים",
    "newOrganization": "ארגון חדשה",
    "editOrganization": "ערוך ארגון",
    "createOrganization": "צור ארגון חדשה",
    "yourRoles": "התפקידים שלך",
    "members": "חברים",
    "inviteMembers": "הזמן משתמשים",
    "alerts": {
      "confirmRemoveOrg": "האם אתה בטוח שאתה רוצה למחוק את הארגון?",
      "removedSuccess": "ארגון נמחקה בהצלחה",
      "savedSuccess": "ארגון נשמרה בהצלחה",
      "invetationSentSuccess": "הזמנה נשלחה בהצלחה",
      "confirmLeave": "האם אתה בטוח שאתה רוצה רוצה לעזוב את הארגון?",
      "confirmRemoveAccount": "האם אתה בטוח שאתה רוצה להסיר את המשתמש מהארגון?"
    }
  },
  "noAuthToRemoveOrganizationError": "לא מורשה, אין אפשרות למחוק ארגון",
  "noAuthToEditOrganizationError": "לא מורשה, אין אפשרות לערוך ארגון",
  "noAuthToChangeAccountOrganizationStatusError": "לא מורשה, אין אפשרות לעדכן סטטוס של משתמש בתוך ארגון",
  "userNotAllowdInOrganizationError": "אין הרשאה",
  "noAuthToChangeAccountOrganizationRolesError": "לא מורשה, אין אפשרות לעדכן תפקיד של משתמש בתוך ארגון",
  "noAuthToRemoveUserFromOrganizationError": "לא מורשה, אין אפשרות להסיר משתמש מארגון"
}
const heF = {
  ...he,
  organization: {
    ...he.organization,
    "editOrganization": "ערכי ארגון",
    "createOrganization": "צרי ארגון חדשה",
    "inviteMembers": "הזמיני משתמשים",
    alerts: {
      ...he.organization.alerts,
      "confirmRemoveOrg": "האם את בטוחה שאת רוצה למחוק את הארגון?",
      "confirmLeave": "האם את בטוחה שאת רוצה לעזוב את הארגון?",
      "confirmRemoveAccount": "האם בטוחה שאת רוצה להסיר את המשתמש מהארגון?"
    }
  }
}
export const organizationLocales = {
  en,
  he,
  heF
}