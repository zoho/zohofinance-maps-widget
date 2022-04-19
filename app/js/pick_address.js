let map;
let geocoder;
let marker;

async function loadGmapSDK() {
	let orgDetailsJson = await window.ZFAPPS.get('organization');
	let { organization_id , data_center_extension } = orgDetailsJson['organization'];

	let domainAPI = `https://books.zoho${data_center_extension}/api/v3`;
	let connection_link_name = 'addresstypeahead_books_connection';

	try {
		let orgVariablesJson = await window.ZFAPPS.request({
			url: `${domainAPI}/settings/orgvariables/vl__u9w51_gmap_api_key`,
			method: 'GET',
			url_query: [
				{
					key: 'organization_id',
					value: organization_id
				}
			],
			connection_link_name: connection_link_name
		}).catch((error) => {
			console.error(error);
		});

		let response = JSON.parse(orgVariablesJson.data.body);
		let { orgvariable: { value } } = response;

    injectGMapSDK(value);

	} catch (err) {
		console.log('Error in request', err);
	}
}

function injectGMapSDK(API_KEY) {
  let head = document.getElementsByTagName("head")[0];
  let script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
  script.type = "text/javascript";
  head.appendChild(script);
}


function initMap() {
  let location = { lat: -34.397, lng: 150.644 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 8,
  });
  geocoder = new google.maps.Geocoder();

  // Creates the marker for current location
  createMarker(location);

  // Watches click event on map. whenever user clicks, it reset the marker position.
  map.addListener("click", (mapsMouseEvent) => {
    marker.setMap(null);
    createMarker(mapsMouseEvent.latLng);
    loadWithPostion(mapsMouseEvent.latLng);
  });
}

function createMarker(location) {
  marker = new google.maps.Marker({ position: location, map: map, draggable: true });

  marker.addListener("dragend", (mapMarker) => {
    this.loadWithPostion(mapMarker.latLng);
  });
}

let addressParams = ['locality', 'administrative_area_level_1', 'country', 'postal_code', 'street'];
let addressObject = {};

// Results of clicked location.
function loadWithPostion(location) {
  geocoder.geocode({ location: location }, (results, status) => {
    console.log(results);
    fillInAddress(results[0]);
  });
};

// Function will reset the all address params for every marker position changes
function resetParams() {
  addressParams.forEach((param) => {
    addressObject[param] = "";
    document.getElementById(param).value = "";
  })
}

function fillInAddress(place) {

  resetParams();

  for (var i = 0; i < place.address_components.length; i++) {
    let addressType = place.address_components[i].types[0];
    if (addressParams.includes(addressType)) {
      let result = place.address_components[i].long_name || "";
      addressObject[addressType] = result;
      document.getElementById(addressType).value = result;
    }
  }

  let address = place.formatted_address;
  let locality = addressObject.locality;
  let result =  locality ? address.split(locality)[0] : address;
  addressObject.street = result;
  document.getElementById('street').value = result;
};

function setAddressInZBooks(param) {
  return window.ZFAPPS.set(param, {
    address: addressObject.street,
    city: addressObject.locality,
    state: addressObject.administrative_area_level_1,
    country: addressObject.country,
    zip: addressObject.postal_code
  });
};

async function applyAddress() {
  let isBillingEnabled = document.querySelector("#billing").checked;
  let isShippingEnabled = document.querySelector("#shipping").checked

  if (isBillingEnabled) {
    await setAddressInZBooks('contact.billing_address');
  }

  if (isShippingEnabled) {
    await setAddressInZBooks('contact.shipping_address');
  }

  closeModal();
}

function closeModal() {
  window.ZFAPPS.closeModal();
}
