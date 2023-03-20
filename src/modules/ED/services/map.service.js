import { googleMapService } from "./googleMap.service";
import { elementService } from "../../common/services/element.service";
import { msgService } from "./msg.service";
const El = elementService.El;
import evEmmiter from '@/modules/common/services/event-emmiter.service';



const AccountsPreviewMap = {}; // id: {el, preview}


function updateAccountMapPreview(map, account, selectedAccounts) {
  // const prevEl = document.querySelector(`${_getAccountPreviewSelector(account)}`);
  const prevEl = AccountsPreviewMap[account._id]?.el;
  if (!prevEl) return addAccountMapPreview(map, account, selectedAccounts);
  const newEl = createAccountMapEl(account, selectedAccounts);
  const oldMsgsEl = prevEl.querySelector('ul');
  oldMsgsEl.innerHTML = newEl.querySelector('ul').innerHTML;

  // console.log(AccountsPreviewMap[account._id]);
  // AccountsPreviewMap[account._id].preview.setPosition(account.location);
  AccountsPreviewMap[account._id].preview.updatePosition(account.location);
}
function addAccountMapPreview(map, account, selectedAccounts) {
  const el = createAccountMapEl(account, selectedAccounts);
  const preview = googleMapService.addElementToMap(map, account.location, el);
  // AccountsPreviewMap[account._id] = preview;
  AccountsPreviewMap[account._id] = {el, preview};
  return preview;
}
function createAccountMapEl(account, selectedAccounts) {
  const elMsg = El(`<ul hidden></ul>`, {}, account.msgs.length? account.msgs.map(c => El(`<li>${msgService.transMsg(c.txt)}</li>`)) : [El(`<li>No messages..</li>`)]);
  const el = El(`<div class="account-map-preview ${_getAccountPreviewSelector(account)}"></div>`, {},
    [
      El(`<p>${account.username}</p>`, {onclick: () => elMsg.hidden = !elMsg.hidden}),
      El(`<input type="checkbox"/>`, {
        checked: selectedAccounts.find(c => c._id === account._id)? true : '',
        oninput: (ev) => evEmmiter.emit('map-user-selected', { account, ev, val: ev.target.checked }) 
      }),
      elMsg
    ]
  );
  return el;
}
function _getAccountPreviewSelector(account) {
  return `account-map-preview-${account._id}`;
}

function removeAccountFromMap(account) {
  googleMapService.removeElementFromMap(AccountsPreviewMap[account._id].preview);
  delete AccountsPreviewMap[account._id];
}

function clearAllAccountsData() {
  for (let key in AccountsPreviewMap) removeAccountFromMap({_id: key});
}

export const mapService = {
  addAccountMapPreview,
  updateAccountMapPreview,
  removeAccountFromMap,
  createAccountMapEl,
  clearAllAccountsData
}