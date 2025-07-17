
// import { Utils } from '@/apps/common/modules/common/services/util.service';
// import { fixFileSrcToThumbnail } from '../../../../common/modules/common/services/file.service';

// export function createItemForDynamicForm(dataFields = []) {
//   const item = {};
//   for (let field of dataFields) {
//     if (field.defaultValue) {
//       item[field.fieldName] = field.defaultValue;
//       continue;
//     }
//     switch (field.type) {
//       case 'ID':
//         return item[field.fieldName] = Utils.getRandomId();
//       case 'TEXT':
//       case 'EMAIL':
//       // case 'URL':
//       // case 'VIDEOURL':
//       // case 'IMAGE_SRC':
//       case 'LOGOSELECTION':
//       case 'SELECTIONWITHIMAGE':
//         item[field.fieldName] = '';
//         break;
//       case 'DATE':
//         item[field.fieldName] = null;
//         break;
//       case 'NUMBER':
//         item[field.fieldName] = 0;
//         break;
//       case 'SELECT':
//         item[field.fieldName] = '';
//         break;
//       case 'TABLE':
//         // item[field.fieldName] = [createItemForDynamicForm(field.fields)];
//         item[field.fieldName] = [];
//         break;
//       case 'LONGRICHTEXT':
//       case 'RICHTEXT':
//         item[field.fieldName] = '';
//         break;
//       case 'ROW': 
//         // item[field.fields].forEach(c => {
//         field.fields.forEach(c => {
//           item[c.fieldName] = createItemForDynamicForm([c])[c.fieldName]
//         });
//         break;
        
//       // case 'VIDEOURL': 
//       //   item[field.fieldName] = '';

//       case 'IMAGE':
//       case 'FILE':
//       case 'VIDEO':
//         // if (field.propsToPass?.onlySrc) item[field.fieldName] = '';
//         /* else */ item[field.fieldName] = {src: '', title: ''};
//         break;
        
//       case 'MULTISELECT':
//       case 'IMAGEGALLERY':
//       case 'RELEASES_SELECTOR':
//       case 'SELECT_RELEASES_FROM_INNER_PARAM':
//         item[field.fieldName] = [];
//         break;

//       // case 'SINGLE-IMAGE_IN_ARRAY':
//       // case 'IMAGEINARRAY':
//       case 'VIDEOINARRAY':
//       // case 'FILEINARRAY':
//         item[field.fieldName] = [];
//         break;

//       case 'TYPE':
//         item[field.fieldName] = field.defaultValue;


//       case 'SEPARATOR':
//       case 'SEPARATOR_BOLD':
//       case 'LIGHT_SEPARATOR':
//         break;


//       default:
//         item[field.fieldName] = '';

//     }
//   }
//   return item;
// }




// export function validateDataByDataField(dataField, data, rootData, fullParent) {
//   switch (dataField.type) {
//     case 'ID':
//       return typeof !!data;
//     case 'NUMBER':
//       return typeof data === 'number';
//     case 'TEXT':
//     case 'SELECT':
//     case 'EMAIL':
//     // case 'IMAGE_SRC':
//     // case 'FILE_SRC':
//     // case 'URL':
//     // case 'VIDEOURL':
//       return data && !!data?.trim()?.length;
//     case 'DATE':
//       return Utils.isDateValid(data);
//     case 'LONGRICHTEXT':
//     case 'RICHTEXT':
//       // return !!data?.trim()?.length;
//       return data && !!Utils.htmlStrToText(data).trim()?.length;
//     case 'VIDEOS':
//     case 'LINKS':
//     case 'IMAGEGALLERY':
//       return data && !!data.filter(c => fixFileSrcToThumbnail(c, fullParent)).length;
//     case 'SEPARATOR':
//     case 'SEPARATOR_BOLD':
//     case 'LIGHT_SEPARATOR':
//       return false;
//     // case 'ROW':
//     case 'ROW':
//       // return true;
//       // console.log(dataField, data, rootData)
//       return dataField.fields.some(c => validateDataByDataField(c, Utils.getDeepVal(rootData, c.fieldName)))
//       // return false
//     case 'TABLE':
//       if (dataField.uiType === 'FilesSection') return data && !!data.filter(c => fixFileSrcToThumbnail(c, fullParent)).length;
//       // return data.filter(c => dataField, c)
//     case 'TABLE':
//     case 'RELEASES_SELECTOR':
//     case 'SELECT_RELEASES_FROM_INNER_PARAM':
//       return data && !!data.length;
//     case 'IMAGE':
//     case 'FILE':
//     case 'VIDEO':
//       return data && !!fixFileSrcToThumbnail(data, fullParent);
//     case 'MULTISELECT':
//       return data && !!data.filter(Boolean).length;
//     // case 'SINGLE-IMAGE_IN_ARRAY':
//     // case 'FILEINARRAY':
//     case 'VIDEOINARRAY':
//       return !!data?.[0]?.length;
//     case 'TYPE':
//         !!data;
//   }
// }

const dynamicFormModule = window.dynamicFormModule;
export const createItemForDynamicForm = dynamicFormModule.createItemForDynamicForm;
export const validateDataByDataField = dynamicFormModule.validateDataByDataField;