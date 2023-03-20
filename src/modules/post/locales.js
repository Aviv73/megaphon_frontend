const  en = {
  "post": {
    "post": "Post",
    "posts": "Posts",
    "createNewPost": "Create new post",
    "editPost": "Edit post",
    "saySomething": "Say something",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this post?",
      "removeSuccess": "post removed successfully",
      "savedSuccess": "post saved successfully"
    }
  },
  "noAuthToEditPostError": "Unauthorized, cant edit post",
  "noAuthToRemovePostError": "Unauthorized, cant remove post"
}
const he = {
  "post": {
    "post": "פוסט",
    "posts": "פוסטים",
    "createNewPost": "צור פוסט חדש",
    "editPost": "ערוך פוסט",
    "saySomething": "כתוב משהו",
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את הפוסט?",
      "removeSuccess": "פוסט נמחק בהצלחה",
      "savedSuccess": "פוסט נשמר בהצלחה"
    }
  },
  "noAuthToEditPostError": "לא מורשה, אין אפשרות לערוך פוסט",
  "noAuthToRemovePostError": "לא מורשה, אין אפשרות למחוק פוסט"
}
const heF = {
  ...he,
  post: {
    ...he.post,
    "createNewPost": "צרי פוסט חדש",
    "editPost": "ערכי פוסט",
    "saySomething": "כתבי משהו",
    alerts: {
      ...he.post.alerts,
      "confirmRemove": "האם את בטוחה שאת רוצה למחוק את הפוסט?",
    }
  }
}
export const postLocales = {
  en,
  he,
  heF
}