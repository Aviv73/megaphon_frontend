

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
      case 'SELECT':
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
        
      case 'MULTISELECT':
      case 'IMAGEGALLERY':
      case 'RELEASES_SELECTOR':
      case 'SELECT_RELEASES_FROM_INNER_PARAM':
        item[field.fieldName] = [];
        break;

      case 'SINGLE-IMAGE_IN_ARRAY':
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




import { isDateValid } from '@/apps/common/modules/common/services/util.service';
export function validateDataByDataField(dataField, data) {
  switch (dataField.type) {
    case 'NUMBER':
      return typeof data === 'number';
    case 'TEXT':
    case 'SELECT':
    case 'EMAIL':
    case 'IMAGE_SRC':
    case 'FILE_SRC':
    case 'URL':
    case 'VIDEOURL':
      return !!data?.trim()?.length;
    case 'DATE':
      return isDateValid(data);
    case 'LONGRICHTEXT':
    case 'RICHTEXT':
      return !!data?.trim()?.length;
    case 'VIDEOS':
    case 'LINKS':
    case 'IMAGEGALLERY':
      return !!data.filter(c => c.src).length;
    case 'SEPARATOR':
    case 'SEPARATOR_BOLD':
      return false;
    // case 'ROW':
    case 'ROW':
      return false
    case 'TABLE':
      if (dataField.uiType === 'FilesSection') return !!data.filter(c => c.src).length;
    case 'TABLE':
    case 'RELEASES_SELECTOR':
    case 'SELECT_RELEASES_FROM_INNER_PARAM':
      return !!data.length;
    case 'IMAGE':
    case 'FILE':
    case 'VIDEO':
      return !!data.src;
    case 'MULTISELECT':
      return !!data.filter(Boolean).length;
    case 'SINGLE-IMAGE_IN_ARRAY':
    case 'FILEINARRAY':
    case 'VIDEOINARRAY':
      return !!data?.[0]?.length;
  }
}