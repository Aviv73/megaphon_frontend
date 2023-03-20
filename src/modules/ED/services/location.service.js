

async function getGeoLocation() {
  if (!navigator.geolocation) return Promise.resolve({ err: 'notSuported' });
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }, (err) => resolve({ err: 'errorGettingLocation', message: _getPositionError(err) }));
  });
}

function _getPositionError(err) {
  switch (err.code) {
    case err.PERMISSION_DENIED: return 'permissionDenied';
    case err.POSITION_UNAVAILABLE: return 'permissionUnavailable';
    case err.TIMEOUT: return 'timeoutError';
    case err.UNKNOWN_ERROR: default: return 'unknownError';
  }
}

module.exports = {
  getGeoLocation
}