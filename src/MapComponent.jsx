import React from 'react'
import styles from './index.scss';
import {Map, Marker, Popup, TileLayer, GeoJSON} from 'react-leaflet';

var testData = {
	"type": "FeatureCollection",
	"features": [
		{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [30, 30]
			},
			"properties": {
				"prop0": "value0"
			}
		}, {
			"type": "Feature",
			"geometry": {
				"type": "LineString",
				"coordinates": [
					[
						102.0, 0.0
					],
					[
						103.0, 1.0
					],
					[
						104.0, 0.0
					],
					[105.0, 1.0]
				]
			},
			"properties": {
				"prop0": "value0",
				"prop1": 0.0
			}
		}
	]
}
export default class MapComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			lat: 30,
			lng: 30,
			data: testData,
			zoom: 13
		};
		this.onLat = this.onLat.bind(this);
		this.onLng = this.onLng.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	updatePosition(pos) {
		this.setState({lat: pos.lat, lng: pos.lng})
	}
	handleSubmit(event) {
		console.log(event);
		// this.forceUpdate();
		this.updateData();
		event.preventDefault();

	}
	onLat(event) {
		console.log(event.target.value);
		this.setState({lat: event.target.value})
	}
	onLng(event) {
		console.log(event.target.value);
		this.setState({lng: event.target.value})
	}
	updateData(obj) {
		this.setState({data: obj});
		this.forceUpdate();
	}
	componentDidMount() {
		console.log("MOUNTED")
	}
	render() {
		var position = [this.state.lat, this.state.lng];
		return (
			<div className={styles.mapContainer}>
				<Map className={styles.map} center={position} zoom={this.state.zoom} data={this.state.data}>
					<TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'/>
					<GeoJSON data={testData}></GeoJSON>
				</Map>
				<form onSubmit={this.handleSubmit}>
					<label>Lat</label>
					<input type="number" value={this.state.lat} onChange={this.onLat}/>
					<label>Lng</label>
					<input type="number" value={this.state.lng} onChange={this.onLng}/>
					<input type="submit" value="Submit"/>
				</form>
			</div>
		)
	}
}
