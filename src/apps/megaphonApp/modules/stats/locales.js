const  en = {
  "statsLocales": {
    "stats": "Statistics",

    "last24Hr": "Last 24 hours",
    "last7Days": "Last 7 days",
    "lastMonth": "Last month",
    "lastYear": "Last year",
    "fromDate": "From date",
    "toDate": "To date",

    "numberOfAccountsWatched": "By the number of accounts watched",
    "byTotalWatchTimes": "By total times the video has been watched",
    "watchesPerVideo": "Watches per video",
    "watchesPerMonth": "Watches per month",
    "totalWatchsCount": "Total watchs count",
    "totalWatchTime": "Total watch time",
    "deviceReport": "Device report",
    "countryReport": "Country report",
    "activity": "Activity",
    "alerts": {
    }
  },
}
const he = {
  "statsLocales": {
    "stats": "סטטיסטיקות",

    "last24Hr": "24 שעות אחרונות",
    "last7Days": "שבוע אחרון",
    "lastMonth": "חודש אחרון",
    "lastYear": "שנה אחרונה",
    "fromDate": "מתאריך",
    "toDate": "לתאריך",

    "numberOfAccountsWatched": "על פי מספר המשתמשים השונים שצפו",
    "byTotalWatchTimes": "על פי מספר הצפיות הכולל",
    "watchesPerRelease": "צפיות לפי רליס",
    "watchesPerMonth": "צפיות לפי חודש",
    "totalWatchsCount": "כמות צפיות מצטברת",
    "totalWatchTime": "זמן צפיה מצטבר",
    "deviceReport": "דוח מכשירים",
    "countryReport": "דוח מדינות",
    "activity": "פעילות",
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