const en = {
  "organizationLocales": {
    "orgRoles": {
      "creator": "Creator",
      "admin": "Admin",
      "producer": "Producer",
      "user": "User",
      "client": "Watch only",
      "developer": "Developer"
    }
  }
}
const he = {
  "organizationLocales": {
    "orgRoles": {
      "creator": "יוצר",
      "admin": "אדמין",
      "producer": "מפיץ",
      "user": "משתמש",
      "client": "צפיה",
      "developer": "מפתח"
    }
  }
}
const heF = {
  ...he,
  organizationLocales: {
    ...he.organizationLocales,
    alerts: {
      ...he.organizationLocales.alerts,
    }
  }
}

export const organizationLocales = {
  en,
  he,
  heF
}