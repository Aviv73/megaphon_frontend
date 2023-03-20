const  en = {
  "settings": {
    "settings": "Settings",
    "darkMode": "Dark mode",
    "locale": "Locale",
    "accessability": "Accessability",
    "theme": "Theme",
    "themes": {
      "lemon": "Lemon",
      "dark": "Dark",
      "red": "Simply Red",
      "purple": "Deep Purple",
      "pink": "la Vie en Rose",
      "blue": "Baby Blue",
    },
    "alerts": {}
  }
}
const he = {
  "settings": {
    "settings": "הגדרות",
    "darkMode": "מצב חשוך",
    "locale": "שפה",
    "accessability": "נגישות",
    "theme": "נושא",
    "themes": {
      "lemon": "לימון",
      "dark": "חשוך",
      "red": "פשוט אדום",
      "purple": "סגול עמוק",
      "pink": "החיים בורוד",
      "blue": "ערב כחול עמוק",
    },
    "alerts": {}
  }
}
const heF = {
  ...he,
  settings: {
    ...he.settings,
    alerts: {
      ...he.settings.alerts,
    }
  }
}
export const settingsLocales = {
  en,
  he,
  heF
}