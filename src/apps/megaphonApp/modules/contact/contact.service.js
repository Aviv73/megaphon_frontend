import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'contact';

export const contactService = {
  query,
  // get,
  // add,
  // update,
  // save,
  // remove,
  getEmptyItem
}

function query(filterBy, organizationId) {
  return httpService.get(`${ENDPOINT}/${organizationId}`, filterBy);
}
// function get(id, organizationId) {
//   if (!id) return getEmptyItem();
//   return httpService.get(`${ENDPOINT}/${organizationId}/${id}`);
// }
// function add(comment, organizationId) {
//   return httpService.post(`${ENDPOINT}/${organizationId}`, comment);
// }
// function update(comment, organizationId) {
//   return httpService.put(`${ENDPOINT}/${organizationId}`, comment);
// }
// function remove(id, organizationId) {
//   return httpService.delete(`${ENDPOINT}/${organizationId}/${id}`);
// }
// function save(comment, organizationId) {
//   return comment._id? update(comment) : add(comment);
// }


function getEmptyItem() {
  return {
    // name: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    tags: [],
    company: [],
    phone: null,
    cellular: null,
    notes: null,
    organizationId: '-1',
  }
}

/**
 * 
 * {
    "_id" : ObjectId("60c1eef9f6199ca68dd749dc"),
    "name" : "טלי בן עובדיה",
    "firstName" : "טלי",
    "lastName" : "בן עובדיה",
    "email" : "talibenovadia1@gmail.com",
    "tags" : [],
    "company" : [ 
        "60c1eef9fa436e0757342e44"
    ],
    "phone" : null,
    "cellular" : null,
    "notes" : null,
    "address" : null,
    "organizationId" : "-1"
}
 */