console.log(listing.geometry.coordinates);
if(listing.geometry.coordinates.length>0){
    mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
container: 'map', // container ID
center: listing.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset:25})
   .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`)
)
.addTo(map);
}else{
mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
container: 'map', // container ID
center: [75.7217,29.1492], // starting position [lng, lat]
zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({color:"red"})
.setLngLat([75.7217,29.1492])
.setPopup(
    new mapboxgl.Popup({ offset:25})
   .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`)
)
.addTo(map);
};
