import { httpService } from '@/modules/common/services/http.service';
import { getRandomId } from '../../common/services/util.service';

const ENDPOINT = 'shopping-list';

export const shoppingListService = {
  query,
  get,
  add,
  update,
  save,
  remove,
  getEmptyShoppingList,
  getEmptyShoppingProduct,
  getEmptyPrice
}

function query(filterBy, organizationId) {
  return httpService.get(`${ENDPOINT}/${organizationId}`, filterBy);
}
function get(id, organizationId) {
  if (!id) return getEmptyShoppingList();
  return httpService.get(`${ENDPOINT}/${organizationId}/${id}`);
}
function add(shoppingList, organizationId) {
  return httpService.post(`${ENDPOINT}/${organizationId}`, shoppingList);
}
function update(shoppingList, organizationId) {
  return httpService.put(`${ENDPOINT}/${organizationId}`, shoppingList);
}
function remove(id, organizationId) {
  return httpService.delete(`${ENDPOINT}/${organizationId}/${id}`);
}
function save(shoppingList, organizationId) {
  return shoppingList._id? update(shoppingList, organizationId) : add(shoppingList, organizationId);
}


function getEmptyShoppingList() {
  return {
    title: '',
    products: [],
    cart: []
  }
}

function getEmptyShoppingProduct() {
  return {
    id: getRandomId(),
    name: '',
    count: 0,
    minCount: 0,
    maxCount: 0,
    prices: []
  }
}

function getEmptyPrice() {
  return { shopName: '', value: 0 }
}