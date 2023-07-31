

export function createItemForDynamicForm(dataFields = []) {
  const item = {};
  for (let field of dataFields) {
    switch (field.type) {
      case 'TEXT':
      case 'EMAIL':
      case 'URL':
      case 'VIDEOURL':
      case 'IMAGE_SRC':
      case 'LOGOSELECTION':
      case 'SELECTIONWITHIMAGE':
        item[field.fieldName] = '';
        break;
      case 'DATE':
        item[field.fieldName] = null;
        break;
      case 'NUMBER':
        item[field.fieldName] = 0;
        break;
      case 'SELECTION':
        item[field.fieldName] = '';
        break;
      case 'TABLE':
        item[field.fieldName] = [createItemForDynamicForm(field.fields)];
        break;
      case 'LONGRICHTEXT':
      case 'RICHTEXT':
        item[field.fieldName] = '';
        break;
      case 'ROW': 
        // item[field.fields].forEach(c => {
          // console.log(field);
        field.fields.forEach(c => {
          item[c.fieldName] = createItemForDynamicForm([c])[c.fieldName]
        });
        break;
        
      case 'VIDEOURL': 
        item[field.fieldName] = '';

      case 'IMAGE':
      case 'CORPABLE_IMAGE':
      case 'IMAGEGALLERY':
      case 'IMAGEGALLERY':
      case 'FILE':
        item[field.fieldName] = [];

      case 'SEPARATOR':
      case 'SEPARATOR_BOLD':
        break;

      default:
        item[field.fieldName] = '';

    }
  }
  return item;
}

