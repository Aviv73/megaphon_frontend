const  en = {
  "settings": {
    "settings": "Settings",
    "darkMode": "Dark mode",
    "locale": "Locale",
    "accessability": "Accessability",
    "theme": "Theme",
    "themes": {
      "light": "Light",
      "dark": "Dark",
    },
    "textSize": "Text size",
    "textSizeSmall": "Small",
    "textSizeMedium": "Medium",
    "textSizeBig": "Big",
    "textSizeBigger": "Bigger",
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
      "light": "בהיר",
      "dark": "חשוך"
    },
    "textSize": "גודל טקסט",
    "textSizeSmall": "קטן",
    "textSizeMedium": "בינוני",
    "textSizeBig": "גדול",
    "textSizeBigger": "ענק",
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