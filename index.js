const ipFormEl    = document.querySelector("#ip-form")
const ipInputEl   = document.querySelector("#ip-addr")
const ipDetailsEl = document.querySelector(".ip-details")

let map;

// load user current IP when the DOM loads
window.addEventListener('load', () => {
	ipDetailsEl.style.display = "none"
	fetch('https://api.ipify.org/?format=json')
    .then(res => {
			if(!res.ok) {
				throw Error("Error while fetching visitor's IP")
			}
			return res.json()
		})
		.then(data => {
			fetchIpDetails(data.ip)
		})
		.catch(err => console.log(err))		
})

// Search and load an IP address
ipFormEl.addEventListener('submit', (e) => {
	ipDetailsEl.style.display = "grid"
	map.remove()
	e.preventDefault()

	const formData = new FormData(e.target)
	const ipInput = formData.get("ip-addr")

	fetchIpDetails(ipInput)

	ipInputEl.value = ""

})

// Helper fns
function fetchIpDetails(ip) {
	fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_86pDJApy7VCzJH9GgBlgQmDWRTxbI&ipAddress=${ip}`)
		.then(res => {
			if(!res.ok) {
				throw Error("Unable to get IP Address details")
			}
			return res.json()
		})
		.then(data => {
			const ipDetails = getIpDetails(data)
			renderMap(ipDetails.lat, ipDetails.lng)

			ipDetailsEl.innerHTML = renderIpDetailsHTML(ipDetails)
		})
		.catch(err => {
			console.log(err)
		}) 
}

function renderMap(lat, lng) {
	map = L.map('map').setView([lat, lng], 13);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
			maxZoom: 18,
			id: 'mapbox/streets-v11',
			tileSize: 512,
			zoomOffset: -1,
			accessToken: 'pk.eyJ1Ijoibnlha2lvIiwiYSI6ImNsMjZjdGgyZjA0aXMzbG5xMmVlbHJwNjUifQ.Dtu71-lxpqnG1gzE_as3Fg',
			doubleClickZoom:true
	}).addTo(map);

	L.marker([lat, lng]).addTo(map)
}

function renderIpDetailsHTML(ipData) {
	return `
		<h4 class="ip-detail-title title-ip"> ip address </h4>
		<p class="ip-detail-text details-ip"> ${ipData.ip} </p>
		<h4 class="ip-detail-title title-location"> location </h4>
		<p class="ip-detail-text details-location"> ${ipData.country},${ipData.city}, ${ipData.region} </p>
		<h4 class="ip-detail-title title-tz"> timezone </h4>
		<p class="ip-detail-text details-tz"> UTC ${ipData.timezone} </p>
		<h4 class="ip-detail-title title-isp"> isp </h4>
		<p class="ip-detail-text details-isp"> ${ipData.isp} </p>
	`
}


function getIpDetails(ipData) {
	return {
		ip: ipData.ip,
		country: ipData.location.country,
		city:ipData.location.city,
		region: ipData.location.region,
		lat: ipData.location.lat,
		lng: ipData.location.lng,
		timezone: ipData.location.timezone,
		isp: ipData.isp
	}
}




