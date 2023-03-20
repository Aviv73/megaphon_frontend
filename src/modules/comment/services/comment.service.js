import { httpService } from '@/modules/common/services/http.service';

const ENDPOINT = 'comment';

export const commentService = {
  query,
  get,
  add,
  update,
  save,
  remove,
  getEmptyItem
}

function query(filterBy) {
  return httpService.get(`${ENDPOINT}`, filterBy);
}
function get(id) {
  if (!id) return getEmptyItem();
  return httpService.get(`${ENDPOINT}/${id}`);
}
function add(comment) {
  return httpService.post(`${ENDPOINT}`, comment);
}
function update(comment) {
  return httpService.put(`${ENDPOINT}`, comment);
}
function remove(id) {
  return httpService.delete(`${ENDPOINT}/${id}`);
}
function save(comment) {
  return comment._id? update(comment) : add(comment);
}


function getEmptyItem() {
  return {
    content: '',
    attachedId: '',
  }
}