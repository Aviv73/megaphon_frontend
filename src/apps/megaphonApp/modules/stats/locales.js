const  en = {
  "statsLocales": {
    "stats": "Statistics",
    "alerts": {
    }
  },
}
const he = {
  "statsLocales": {
    "stats": "סטטיסטיקות",
    "alerts": {
    }
  },
}
const heF = {
  ...he,
  statsLocales: {
    ...he.statsLocales,
    alerts: {
      ...he.statsLocales.alerts
    }
  }
}
export const statsLocales = {
  en,
  he,
  heF
}