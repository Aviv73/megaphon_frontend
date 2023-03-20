import { httpService } from '@/modules/common/services/http.service';

const ENDPOINT = 'bug';

export const bugService = {
  query,
  get,
  add,
  update,
  save,
  getEmptyBug
}

function query(filterBy) {
  return httpService.get(ENDPOINT, filterBy);
}
function get(id) {
  if (!id) return getEmptyBug();
  return httpService.get(`${ENDPOINT}/${id}`);
}
function add(bug) {
  return httpService.post(ENDPOINT, bug);
}
function update(bug) {
  return httpService.put(ENDPOINT, bug);
}
function save(bug) {
  return bug._id? update(bug) : add(bug);
}


function getEmptyBug() {
  return {
    title: '',
    desc: '',
    // status: 'pending'
  }
}