const  en = {
  "release": {
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
  "release": {
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
  release: {
    ...he.release,
    alerts: {
      ...he.release.alerts,
    }
  }
}
export const releaseLocales = {
  en,
  he,
  heF
}