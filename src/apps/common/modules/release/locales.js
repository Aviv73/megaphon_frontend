const  en = {
  "releaseLocales": {
    alerts: {
    },
    tabs: {
      "content": "Content",
      "images": "Images",
      "videos": "Videos",
      "watch": "Watch",
      "files": "Files",
      "links": "Links",
      "festivals": "Festivals",
      "special": "Special",
      "contact": "Contact",
      "broadcastTimes": "Broadcast times",
      "teaser": "Teaser / Promo",
      "reviews": "Reviews",
      "contacts": "Contacts",
      "comunicat": "Comunicat"
    },
    newReleases: "News",
    mostWatched: "Most watched",
    monthlyRecommendation: "Monthly reccommendation"
  }
}
const he = {
  "releaseLocales": {
    tabs: {
      "content": "תקציר",
      "images": "תמונות",
      "videos": "צפיה",
      "watch": "צפיה",
      "files": "קבצים",
      "links": "קישורים",
      "festivals": "פסטיבלים",
      "special": "ספיישל",
      "contact": "צור קשר",
      "broadcastTimes": "זמני שידור",
      "teaser": "טיזר / פרומו",
      "reviews": "ביקורות",
      "contacts": "אנשי קשר",
      "comunicat": "קומוניקט"
    },
    alerts: {
    },
    newReleases: "חדשים",
    mostWatched: "הכי הנצפים",
    monthlyRecommendation: "המלצת החודש"
  }
}
const heF = {
  ...he,
  releaseLocales: {
    ...he.releaseLocales,
    alerts: {
      ...he.releaseLocales.alerts,
    }
  }
}
export const releaseLocales = {
  en,
  he,
  heF
}