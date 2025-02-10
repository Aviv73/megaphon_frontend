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
    dataFields: {
      'details': 'Details',
      'title': 'Title',
      'englishTitle': 'English title',
      'subTitle': 'Sub title',
      "filmOrShow": "Film/Show",
      "film": "Film",
      "show": "Show",
      "licenseType": "License tType",
      "content": "Content",
      "tags": "Tags",
      "times": "Times",
      "broadcastTimes": "Broadcast times",
      "dayOrDays": "Day/Days",
      "date": "Date",
      "hour": "Hour",
      "broadcastChannel": "Broadcast channel",
      "broadcastTimesDescription": "Broadcast times description",
      "galleryCredit": "Gallery credit",
      "special": "Special",
      "videoFiles": "Video files",
      "video": "Video",
      "moreInfo": "More info",
      "teaser": "Teaser",
      "link": "Link",
      "links": "Links",
      "reviews": "Reviews",
      "contacts": "Contacts",
      "name": "Name",
      "role": "Role",
      "cellphone": "Cellphone",
      "email": "Email",
      "festivals": "Festivals",
      "uploadFiles": "Upload files",
      "mainImage": "Main image",
      "previewImage": "Preview image",
      "imagesToDownload": "Images to download",
      "images": "Images",
      "image": "Image",
      "comunicatFile": "Comunicat file",
      "newsLetterInfo": "News letter info",
      "newsletterImg": "Newsletter img",
      "newsletterTitle": "Newsletter title",
      "newsletterDesc": "Newsletter Description",
      "credit": "Credit",
      "shortTitle": "Short title",
      "shortTitleDescription": "Short title for display in list",
      "description": "Description"
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
    dataFields: {
      'details': 'פרטים',
      'title': 'כותרת',
      'englishTitle': 'כותרת באנגלית',
      'subTitle': 'כותרת משנה',
      "filmOrShow": "סרט/סדרה",
      "film": "סרט",
      "show": "סדרה",
      "licenseType": "סוג רישיון",
      "content": "תוכן",
      "tags": "תגיות",
      "times": "זמנים",
      "broadcastTimes": "זמני שידור",
      "dayOrDays": "יום/ימים",
      "date": "תאריך",
      "hour": "שעה",
      "broadcastChannel": "ערוץ משדר",
      "broadcastTimesDescription": "תיאור זמני שידור",
      "galleryCredit": "קרדיט לגלריה",
      "special": "ספיישל",
      "videoFiles": "קבצי וידאו",
      "video": "וידאו",
      "moreInfo": "מידע נוסף",
      "teaser": "טיזר",
      "link": "קישור",
      "links": "קישורים",
      "reviews": "ביקורות",
      "contacts": "אנשי קשר",
      "name": "שם",
      "role": "תפקיד",
      "cellphone": "טלפון",
      "email": "מייל",
      "festivals": "פסטיבלים",
      "uploadFiles": "העלאת קבצים",
      "mainImage": "תמונה ראשית",
      "previewImage": "תמונה ריבועית",
      "imagesToDownload": "תמונות להורדה",
      "images": "תמונות",
      "image": "תמונה",
      "comunicatFile": "קומוניקט",
      "newsLetterInfo": "פרטים לניוזלטר",
      "newsletterImg": "תמונה ראשית לניוזלטר",
      "newsletterTitle": "כותרת לניוזלטר",
      "newsletterDesc": "מידע לניוזלטר",
      "credit": "קרדיט",
      "shortTitle": "כותרת קצרה",
      "shortTitleDescription": "כותרת קצרה לתצוגה ברשימה",
      "description": "תאור"
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