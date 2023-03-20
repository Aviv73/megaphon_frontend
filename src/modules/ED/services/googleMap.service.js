// googleApi?

// let API_KEY = 'AIzaSyClJEGatJZ5nsl0wqdDZ3KLGNHKVUsY9WA';
// let API_KEY = 'AIzaSyAe2XGlg89MWiVjLX03yWczKkhJV2wS3Jc';
// let API_KEY = 'AIzaSyAOnAXgEw57B4TwBiapcl08aer_grWgPDo';
// let API_KEY = 'AIzaSyDdM-mXBbvyBn24sF6Z-CR7jfYQRpgj1y8';
// let API_KEY = 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg'; // FROM GOOGLE DEV DOV
let API_KEY = '';
const setApiKey = (key) => API_KEY = key;

async function initMap(containerEl, center = { lat:0, lng: 0 }) {
  const connectionRes = await _connectGoogleApi();
  if (connectionRes.err) return connectionRes;
  return new google.maps.Map(containerEl, {
    center,
    zoom: 15,
    mapId: 'GOOGLE_MAP_ELEMENT'
  });
}

async function _connectGoogleApi() {
  if (window.google) return {};
  const elScript = document.createElement('script');
  elScript.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  // elScript.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=beta`;
  // elScript.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=maps&libraries=marker&v=beta`;
  // elScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=marker&v=beta`;
  elScript.async = true;

  document.body.append(elScript);
  const res = await new Promise((resolve, reject) => {
    elScript.onload = resolve;
    elScript.onerror = (err) => resolve({ err: 'cantConnectGoogleApi' });
  });
  setHtmlMarkerClass();
  return res;
}

function getCoordBySearchStr(locationSearchStr) {
  return fetch(_createGeocodeAPI(locationSearchStr))
          .then(data => data.json())
}
function _createGeocodeAPI(locationSearchStr) {
  return `https://maps.googleapis.com/maps/api/geocode/json?address=${locationSearchStr}&key=${API_KEY}`;
}


function addElementToMap(map, location, el = _createDefaultMarkEl()) {
  el.classList.add('map-marker');

  return new HtmlMarker(location, map, el);
  // return new google.maps.marker.AdvancedMarkerView({
  return new google.maps.Marker({
    map,
    position: location,
    content: el
  });
}
function _createDefaultMarkEl() {
  const el = document.createElement('div');
  return el;
}

function removeElementFromMap(preview) {
  preview.onRemove();
  // preview.setMap(null);
}



export const googleMapService = {
  setApiKey,
  initMap,
  getCoordBySearchStr,
  addElementToMap,
  removeElementFromMap
}


var HtmlMarker;
function setHtmlMarkerClass() {
  HtmlMarker = class HtmlMarker extends google.maps.OverlayView {
    constructor(position, map, html) {
        super();
        this.position = position;
        this.html = html;
        this.setMap(map);
    }

    updatePosition(newPosition) {
      this.position = newPosition;
      this.draw();
    }
  
    onAdd() {
        let div;
        if (typeof this.html === 'string') {
          div = document.createElement("div");
          div.innerHTML = this.html;
        } else div = this.html;
        div.style.position = "absolute";
        this.getPanes().overlayMouseTarget.appendChild(div);
        this.div = div;
    }
  
    draw() {
        let point = this.getProjection().fromLatLngToDivPixel(this.position);
        if (point) {
            this.div.style.left = point.x + "px";
            this.div.style.top = point.y + "px";
        }
    }
  
    onRemove() {
        if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    }
  }
}