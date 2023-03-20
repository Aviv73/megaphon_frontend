let msgMap = {
  // "shual": "🦊",
  // "danger": "❌",
  // "sos": "🆘",
  // "needHelp": "🤞",
  // "turnOnLights": "💡",
  // "hy": "🖐",
  // "ok": "👍",
  // "rockNRoll": "🤘",
  // "rockNRoll2": "🤙",
  // "wave": "👋",
  // "spiderman": "🤟",
  // "thanks": "🙏",
  // "mascle": "💪",
  // "selfy": "🤳",
  // "chips": "🍟",
  // "burger": "🍔",
  // "pizza": "🍕",
  // "salad": "🥗",
  // "falafel": "🥙",
  // "fu": "🖕",
  // "robot": "👾",
}

const setMsgMap = (map) => msgMap = map;
// const getMsgs = () => msgMap;
const transMsg = msg => msgMap[msg] || msg;



import { httpService } from '@/modules/common/services/http.service';
const ENDPOINT = 'ed-app/msg';


function getMsgs() {
  return httpService.get(`${ENDPOINT}/`);
}
function updateMsgs(msgsMapToUpdate) {
  return httpService.put(`${ENDPOINT}/`, msgsMapToUpdate);
}

export const msgService = {
  setMsgMap,
  transMsg,

  getMsgs,
  updateMsgs
}