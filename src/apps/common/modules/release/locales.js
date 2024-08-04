const  en = {
  "release": {
    alerts: {
    },
    tabs: {
      "content": "Content",
      "images": "Images",
      "videos": "Videos",
      "files": "Files",
      "links": "Links",
      "festivals": "Festivals",
      "special": "Special",
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
      "files": "קבצים",
      "links": "קישורים",
      "festivals": "פסטיבלים",
      "special": "ספיישל",
    },
    alerts: {
    },
    newReleases: "חדשים",
    mostWatched: "הנצפים ביותר",
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