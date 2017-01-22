import React from 'react';
import styles from './index.scss';
let config = {};
config.params = {
	center: [
		40.71, -74
	],
	zoomControl: false,
	zoom: 13,
	maxZoom: 18,
	minZoom: 11,
	scrollwheel: false,
	legends: true,
	infoControl: false,
	attributionControl: true
};

config.tileLayer = {
	uri: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
	params: {
		minZoom: 11,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
		id: '',
		accessToken: ''
	}
};
let testData = {
	"type": "FeatureCollection",
	"features": [
		{
			"type": "Feature",
			"geometry": {
				"coordinates": [
					-74, 40.71
				],
				"type": "Point"
			},
			"properties": {
				"name": "B1",
				"popupContent": "2 civilians killed out of 8 total people killed"
			}
		}, {
			"type": "Feature",
			"geometry": {
				"coordinates": [
					-74.1, 40.8
				],
				"type": "Point"
			},
			"properties": {
				"name": "B1",
				"popupContent": "2 civilians killed out of 8 total people killed"
			}
		}
	]
}
export default class MapComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			map: null,
			tileLayer: null,
			geojsonLayer: null,
			geojson: null
		}
		// this.pointToLayer = this.pointToLayer.bind(this);
		// this.updateGeoJsonLayer = this.updateGeoJsonLayer.bind(this);
		// this.addGeoJsonLayer = this.addGeoJsonLayer.bind(this);
		// this.zoomToFeature = this.zoomToFeature.bind(this);
	}
	componentDidMount() {
		if (!this.state.map)
			this.init(this._mapNode);
		this.getData().then((data)=>{
      this.updateGeoJsonLayer(data.data);
    }).catch((err)=>{
      console.log(err);
    });

	}
	componentDidUpdate(prevProps, prevState) {
		this.state.map.invalidateSize();
		// code to run when the component receives new props or state
		// check to see if geojson is stored, map is created, and geojson overlay needs to be added
		if (this.state.geojson && this.state.map && !this.state.geojsonLayer) {
			// add the geojson overlay
			this.addGeoJsonLayer(this.state.geojson);
		}
	}
	getData() {
		var url = "https://sbhacks3.herokuapp.com/strikes"
		return axios.get(url);
	}
	zoomControl(factor) {
		this.state.map.zoomOut(factor);
		this.state.map.invalidateSize();
	}
	setZoom(value) {
		this.state.map.setZoom(value);
		this.state.map.invalidateSize();
	}
	pointToLayer(feature, latlng) {
		// renders our GeoJSON points as circle markers, rather than Leaflet's default image markers
		// parameters to style the GeoJSON markers
		var markerParams = {
			radius: 5,
			fillColor: 'orange',
			color: '#fff',
			weight: 1,
			opacity: 0.5,
			fillOpacity: 0.8
		};
		console.log(latlng)

		return L.circleMarker(latlng, markerParams);
	}
	updateGeoJsonLayer(geojson) {
		this.state.geojsonLayer.clearLayers();
		// re-add the geojson so that it filters out subway lines which do not match state.filter
		this.state.geojsonLayer.addData(geojson);
		// fit the map to the new geojson layer's geographic extent
		this.setState({geojson});
		this.zoomToFeature(this.state.geojsonLayer);
    this.state.map.invalidateSize();
	}
	addGeoJsonLayer(geojson) {
		console.log("Added Data");
		console.log(this.state)
		console.log(geojson);
		let geojsonLayer = L.geoJson(geojson);
		console.log(geojsonLayer)
		// add our GeoJSON layer to the Leaflet map object
		geojsonLayer.addTo(this.state.map);
		// store the Leaflet GeoJSON layer in our component state for use later
		this.setState({geojsonLayer: geojsonLayer});
		console.log("Finished")
		// fit the geographic extent of the GeoJSON layer within the map's bounds / viewport
	}
	zoomToLocation(pos) {
		this.state.map.panTo(pos)
		this.state.map.invalidateSize();
	};
	zoomToFeature(target) {
		// pad fitBounds() so features aren't hidden under the Filter UI element
		var fitBoundsParams = {
			paddingTopLeft: [
				200, 10
			],
			paddingBottomRight: [10, 10]
		};
		console.log("Target");
		console.log(target.getBounds())
		// set the map's center & zoom so that it fits the geographic extent of the layer
		this.state.map.fitBounds(target.getBounds(), fitBoundsParams);
	}
	init(id) {
		if (this.state.map)
			return;
		let map = L.map(id, config.params);
		L.control.zoom({position: "topright"}).addTo(map);
		L.control.scale({position: "bottomright"}).addTo(map);
		// const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);
    var layer = L.esri.Vector.basemap('Newspaper').addTo(map);
    this.setState({map: map, tileLayer: tileLayer});
		this.setState({geojson: testData})
	}
	render() {
		return (
			<div id="mapUI" className={styles.maxHeight}>
				<div ref={(node) => this._mapNode = node} id="map"/>
			</div>
		)
	}
};
