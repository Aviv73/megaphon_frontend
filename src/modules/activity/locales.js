const  en = {
  "activity": {
    "activity": "Activity",
    "activities": "Activities",
    "noMoreActivities": "No more activities",
    "alerts": {}
  }
}
const he = {
  "activity": {
    "activity": "פעילות",
    "activities": "פעילויות",
    "noMoreActivities": "אין פעילויות נוספות",
    "alerts": {}
  }
}
const heF = {
  ...he,
  activity: {
    ...he.activity,
    alerts: {
      ...he.activity.alerts
    }
  }
}
export const activityLocales = {
  en,
  he,
  heF
}