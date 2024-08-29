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
      "broadcastTimes": "Broadcast times"
    },
    newReleases: "News",
    mostWatched: "Most watched",
    monthlyRecommendation: "Monthly reccommendation"
  }
}
const he = {
  "release": {
    tabs: {
      "content": "מידע",
      "images": "תמונות",
      "videos": "לצפיה",
      "watch": "לצפיה",
      "files": "קבצים",
      "links": "קישורים",
      "festivals": "פסטיבלים",
      "special": "ספיישל",
      "contact": "צור קשר",
      "broadcastTimes": "זמני שידור"
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