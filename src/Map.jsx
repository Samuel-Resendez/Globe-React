import React from 'react';
import styles from './index.scss';
let config = {};
config.params = {
	center: [
		40.71, -74
	],
	zoomControl: false,
	zoom: 2,
	maxZoom: 18,
	minZoom: 1,
	scrollwheel: false,
	legends: true,
	infoControl: false,
	attributionControl: true
};

var markerParams = {
	radius: 5,
	fillColor: 'orange',
	color: '#000',
	weight: 1,
	opacity: 0.5,
	fillOpacity: 0.8
};
export default class MapComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			map: null,
			meteorLayer: null,
			crashLayer: null,
			strikeLayer: null,
			policeLayer: null
		}
	}
	componentDidMount() {
		if (!this.state.map)
			this.init(this._mapNode);
		this.getData().then((data) => {
			console.log(data);
			this.createMetorLayer(this.toGeo(data.data.features[2]));
			this.createStrikeLayer(this.toGeo(data.data.features[1]));
			this.createCrashLayer(this.toGeo(data.data.features[0]));
			this.createPoliceLayer(this.toGeo(data.data.features[3]));
			let overlayMaps = {
				"Meteor Strikes": this.state.meteorLayer,
				"Plane Crashes": this.state.crashLayer,
				"Drone Strikes": this.state.strikeLayer,
				"Police Killings": this.state.policeLayer
			}
			let baseLayers = {
				"Dark": this.state.darkGray,
				"Topographic": this.state.topographic,
				"Streets": this.state.streets
			}
			L.control.layers(baseLayers, overlayMaps).addTo(this.state.map);

		}).catch((err) => {
			console.log(err);
		});

	}
	toGeo(geojson) {
		var obj = {
			"type": "Feature Collection",
			"features": geojson
		}
		console.log(obj)
		return obj
	}
	componentDidUpdate(prevProps, prevState) {
		this.state.map.invalidateSize();
	}
	getData() {
		var url = "https://sbhacks3.herokuapp.com/all"
		return axios.get(url);
	}
	zoomControl(factor) {
		var currZoom = this.state.map.getZoom();
		if (currZoom > 12) {
			factor /= 2;
		}
		this.state.map.zoomOut(factor);
		this.state.map.invalidateSize();
	}
	setZoom(value) {
		this.state.map.setZoom(value);
		this.state.map.invalidateSize();
	}
	autoPan(value, zoom) {
		console.log("Tried to pan", value)
		var pos = [0, 0]
		console.log(zoom)
		if (value == 1)
			pos = [0, -20];
		if (value == 2)
			pos = [20, 0];
		if (value == 3)
			pos = [0, 20];
		if (value == 4)
			pos = [-20, 0];
		if (zoom != -1)
			this.setZoom(zoom);
		console.log(pos)
		this.state.map.panBy(pos);
	}
	pointToLayerMeteor(feature, latlng) {
		let params = markerParams;
		return L.circleMarker(latlng, params);
	}
	pointToLayerStrike(feature, latlng) {
		let params = markerParams;
		params.fillColor = 'blue';
		return L.circleMarker(latlng, params);
	}
	pointToLayerCrash(feature, latlng) {
		let params = markerParams;
		params.fillColor = 'red';
		return L.circleMarker(latlng, params);
	}
	pointToLayerPolice(feature, latlng) {
		let params = markerParams;
		params.fillColor = 'pink';
		return L.circleMarker(latlng, params)
	}
	onEachFeature(feature, layer) {
		const popupContent = `<p>${feature.properties.popupContent}</p>`;
		layer.bindPopup(popupContent);
	}
	updateGeoJsonLayer(geojson) {
		this.state.geojsonLayer.clearLayers();
		// re-add the geojson so that it filters out subway lines which do not match state.filter
		this.state.geojsonLayer.addData(geojson)
		// fit the map to the new geojson layer's geographic extent
		this.setState({geojson});
		this.zoomToFeature(this.state.geojsonLayer);
		this.state.map.invalidateSize();
	}
	createMetorLayer(geojson) {
		let meteorLayer = L.geoJson(geojson, {
			onEachFeature: this.onEachFeature,
			pointToLayer: this.pointToLayerMeteor
		});
		meteorLayer.addTo(this.state.map);
		this.setState({meteorLayer: meteorLayer});
		this.state.map.removeLayer(meteorLayer);
	}
	createStrikeLayer(geojson) {
		let strikeLayer = L.geoJson(geojson, {
			onEachFeature: this.onEachFeature,
			pointToLayer: this.pointToLayerStrike
		});
		strikeLayer.addTo(this.state.map);
		this.setState({strikeLayer: strikeLayer});
		this.state.map.removeLayer(strikeLayer);
	}
	createCrashLayer(geojson) {
		let crashLayer = L.geoJson(geojson, {
			onEachFeature: this.onEachFeature,
			pointToLayer: this.pointToLayerCrash
		});
		crashLayer.addTo(this.state.map);
		this.setState({crashLayer: crashLayer});
		this.state.map.removeLayer(crashLayer);

	}
	createPoliceLayer(geojson) {
		let policeLayer = L.geoJson(geojson, {
			onEachFeature: this.onEachFeature,
			pointToLayer: this.pointToLayerPolice
		});
		policeLayer.addTo(this.state.map);
		this.setState({policeLayer: policeLayer});
		this.state.map.removeLayer(policeLayer);
	}
	zoomToLocation(pos) {
		this.state.map.panTo(pos)
		this.state.map.invalidateSize();
	};
	changeBase(base) {
		if (base == 0)
			this.state.darkGray.bringToFront();
		if (base == 1)
			this.state.topographic.bringToFront();
		if (base == 2)
			this.state.streets.bringToFront();
		}
	zoomToFeature(target) {
		var fitBoundsParams = {
			paddingTopLeft: [
				200, 10
			],
			paddingBottomRight: [10, 10]
		};
		console.log("Target");
		console.log(target.getBounds())
		this.state.map.fitBounds(target.getBounds(), fitBoundsParams);
	}
	dataManager(selection) {
		let that = this.state;
		if (selection[0])
			that.map.addLayer(that.meteorLayer)
		else
			that.map.removeLayer(that.meteorLayer)
		if (selection[1])
			that.map.addLayer(that.crashLayer)
		else
			that.map.removeLayer(that.crashLayer)
		if (selection[2])
			that.map.addLayer(that.strikeLayer)
		else
			that.map.removeLayer(that.strikeLayer)
		if (selection[3])
			that.map.addLayer(that.policeLayer)
		else
			that.map.removeLayer(that.policeLayer)

	}
	init(id) {
		if (this.state.map)
			return;
		let map = L.map(id, config.params);
		L.control.zoom({position: "topright"}).addTo(map);
		L.control.scale({position: "bottomright"}).addTo(map);
		let darkGray = L.esri.basemapLayer('DarkGray').addTo(map);
		let topographic = L.esri.basemapLayer('Topographic').addTo(map);
		let streets = L.esri.basemapLayer('Streets').addTo(map);
		this.setState({darkGray, topographic, streets});
		this.setState({map});
	}
	render() {
		return (
			<div id="mapUI" className={styles.maxHeight}>
				<div ref={(node) => this._mapNode = node} id="map"/>
			</div>
		)
	}
};
