import L from 'leaflet'

var colorMarker: any = (color: string) => {
    return new L.Icon({
	iconUrl: `img/marker-icon-2x-${color}.png`,
	shadowUrl: 'img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});
}

export {colorMarker};