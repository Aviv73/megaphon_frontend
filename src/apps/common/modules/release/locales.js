const  en = {
  "release": {
    tabs: {
      "content": "Content",
      "images": "Images",
      "videos": "Videos",
      "files": "Files",
      "links": "Links",
      "festivals": "Festivals",
      "special": "Special",
    },
    alerts: {
    }
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
    }
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