import { httpService } from '@/modules/common/services/http.service';

const ENDPOINT = 'activity';

export const activityService = {
  query,
  get,
  add,
  update,
  save,
  remove,
  getEmptyActivity
}

function query(filterBy) {
  return httpService.get(`${ENDPOINT}`, filterBy);
}
function get(id) {
  if (!id) return getEmptyActivity();
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


function getEmptyActivity() {
  return {
    name: '',
    desc: '',
    with: [],
    data: {},
    attachedId: '',
  }
}