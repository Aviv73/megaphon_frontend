const  en = {
  "comment": {
    "comment": "Comment",
    "comments": "Comments",
    "showComments": "Show comments",
    "hideComments": "Hide comments",
    "noMoreComments": "No more comments",
    "alerts": {
      "confirmRemove": "Are you sure you want to remove this comment?",
      "removedSuccess": "Comment removed successfully",
      "savedSuccess": "Comment saved successfully"
    }
  },
  "noAuthToEditCommentError": "Unauthorized, cant edit comment",
  "noAuthToRemoveCommentError": "Unauthorized, cant remove comment"
}
const he = {
  "comment": {
    "comment": "תגובה",
    "comments": "תגובות",
    "showComments": "הצג תגובות",
    "hideComments": "הסתר תגובות",
    "noMoreComments": "אין תגובות נוספות",
    "alerts": {
      "confirmRemove": "האם אתה בטוח שאתה רוצה למחוק את התגובה?",
      "removedSuccess": "תגובה נמחקה בהצלחה",
      "savedSuccess": "תגובה נשמרה בהצלחה"
    }
  },
  "noAuthToEditCommentError": "לא מורשה, אין אפשרות לערוך תגובה",
  "noAuthToRemoveCommentError": "לא מורשה, אין אפשרות למחוק תגובה"
}
const heF = {
  ...he,
  comment: {
    ...he.comment,
    "showComments": "הציגי תגובות",
    "hideComments": "הסתירי תגובות",
    alerts: {
      ...he.comment.alerts,
      "confirmRemove": "האם את בטוחה שאת רוצה למחוק את התגובה?",
    }
  }
}
export const commentLocales = {
  en,
  he,
  heF
}