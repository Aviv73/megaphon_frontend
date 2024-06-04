const userRoles = { // 'user', 'admin', 'producer'
  admin: 'admin',
  user: 'user',
  // producer: 'producer',
  // client: 'client',
}
const userRolesMap = {
  [userRoles.admin]: 1,
  [userRoles.user]: 3,
  [userRoles.producer]: 2,
  [userRoles.client]: 3
}

const organizationRoles = {
  // creator: 'creator',
  admin: 'admin',
  producer: "producer",
  client: 'client',
}

const organizationStatuses = {
  pending: 'pending',
  approved: 'approved',
  declined: 'declined',
  left: 'left'
}

const userGenders = {
  male: 'male',
  female: 'female',
  other: 'other',
  whatEver: 'whatEver'
}

const FILE_STORAGE_PATH = 'public/storage';


const exportItems = {
  userRoles,
  userRolesMap,
  FILE_STORAGE_PATH,
  organizationRoles,
  organizationStatuses,
  userGenders,
}


/* FOR NODE ENV:: */
// module.exports = exportItems;

// /* FOR ES6 ENV:: */
export default exportItems;

