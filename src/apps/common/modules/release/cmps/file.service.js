


export function extractFileSrc(fileItem) {
  return fileItem.src || fileItem.link || fileItem.url;
}

export const filterFilesCb = c => extractFileSrc(c);

export function filterFileItems(fileItems) {
  return fileItems.filter(filterFilesCb);
}