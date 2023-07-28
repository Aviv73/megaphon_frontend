const  en = {
  "tag": {
    "tag": "tag",
    "tags": "tags",
    "by": "By",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this tag?",
      "removeSuccess": "tag removed successfully!",
      "savedtagSuccess": "tag saved successfully",
    }
  }
}
const he = {
  "tag": {
    "tag": "תגית",
    "tags": "תגיות",
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את התגית?",
      "removeSuccess": "תגית נמחקה בהצלחה",
      "savedtagSuccess": "פרטי תגית נשמרו בהצלחה",
    }
  },

}
const heF = {
  ...he,
  tag: {
    ...he.tag,
    alerts: {
      ...he.tag.alerts,
      "confirmRemove": "האם את בטוחה שאת רוצה למחוק את התגית?",
    }
  }
}
export const tagLocales = {
  en,
  he,
  heF
}