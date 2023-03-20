import { httpService } from '@/modules/common/services/http.service';

const ENDPOINT = 'post';

export const postService = {
  query,
  get,
  add,
  update,
  save,
  remove,
  getEmptyItem
}

function query(filterBy, organizationId) {
  return httpService.get(`${ENDPOINT}/${organizationId}`, filterBy);
}
function get(id, organizationId) {
  if (!id) return getEmptyItem();
  return httpService.get(`${ENDPOINT}/${organizationId}/${id}`);
}
function add(post, organizationId) {
  return httpService.post(`${ENDPOINT}/${organizationId}`, post);
}
function update(post, organizationId) {
  return httpService.put(`${ENDPOINT}/${organizationId}`, post);
}
function remove(id, organizationId) {
  return httpService.delete(`${ENDPOINT}/${organizationId}/${id}`);
}
function save(post, organizationId) {
  return post._id? update(post, organizationId) : add(post, organizationId);
}


function getEmptyItem() {
  return {
    type: '',
    content: '',
    organizationId: 'public'
  }
}