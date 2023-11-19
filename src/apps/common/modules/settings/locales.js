const  en = {
  "settings": {
    "settings": "Settings",
    "darkMode": "Dark mode",
    "locale": "Locale",
    "accessability": "Accessability",
    "theme": "Theme",
    "themes": {
      "default": "Light",
      "dark": "Dark",
    },
    "textSize": "Text size",
    "textSizeSmall": "Small",
    "textSizeMedium": "Medium",
    "textSizeBig": "Big",
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
      "default": "בהיר",
      "dark": "חשוך"
    },
    "textSize": "גודל טקסט",
    "textSizeSmall": "קטן",
    "textSizeMedium": "בינוני",
    "textSizeBig": "גדול",
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