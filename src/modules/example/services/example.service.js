import { httpService } from '@/modules/common/services/http.service';

const ENDPOINT = 'example';

export const exampleService = {
  query,
  get,
  add,
  update,
  save,
  remove,
  getEmptyItem
}

function query(filterBy) {
  return httpService.get(ENDPOINT, filterBy);
}
function get(id) {
  if (!id) return getEmptyItem();
  return httpService.get(`${ENDPOINT}/${id}`);
}
function add(item) {
  return httpService.post(ENDPOINT, item);
}
function update(item) {
  return httpService.put(ENDPOINT, item);
}
function remove(id) {
  return httpService.delete(`${ENDPOINT}/${id}`);
}
function save(item) {
  return item._id? update(item) : add(item);
}


function getEmptyItem() {
  return {
    key: ''
  }
}