

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
        // item[field.fieldName] = [createItemForDynamicForm(field.fields)];
        item[field.fieldName] = [];
        break;
      case 'LONGRICHTEXT':
      case 'RICHTEXT':
        item[field.fieldName] = '';
        break;
      case 'ROW': 
        // item[field.fields].forEach(c => {
        field.fields.forEach(c => {
          item[c.fieldName] = createItemForDynamicForm([c])[c.fieldName]
        });
        break;
        
      case 'VIDEOURL': 
        item[field.fieldName] = '';

      case 'IMAGE':
      case 'FILE':
      case 'VIDEO':
        if (field.propsToPass?.onlySrc) item[field.fieldName] = '';
        else item[field.fieldName] = {src: '', title: ''};
        break;
        
      case 'CORPABLE_IMAGE':
      case 'IMAGEGALLERY':
      case 'RELEASES_SELECTOR':
      case 'SELECT_RELEASES_FROM_INNER_PARAM':
        item[field.fieldName] = [];
        break;

      case 'IMAGEINARRAY':
      case 'VIDEOINARRAY':
      case 'FILEINARRAY':
        item[field.fieldName] = [];
        break;


      case 'SEPARATOR':
      case 'SEPARATOR_BOLD':
        break;


      default:
        item[field.fieldName] = '';

    }
  }
  return item;
}

