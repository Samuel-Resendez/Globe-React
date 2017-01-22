import styles from './index.scss';
import React from 'react';
import MapComponent from './Map.jsx';
import TitleBar from './TitleBar.jsx';
import SideMenu from './SideMenu.jsx';
import Websocket from 'react-websocket';

const SOCKET_URL = "wss://globe-sb.herokuapp.com/websocket"
// const SOCKET_URL = "ws://65d12708.ngrok.io/websocket";
export default class App extends React.Component {
	constructor(props) {
		super(props)
	}
	handleData(data) {
		data = JSON.parse(data)
    if(typeof data === "string")
      data = JSON.parse(data);
    console.log(data);
		if (data.hasOwnProperty('latitude')) {
			let pos = {
				lat: data.latitude,
				lon: data.longitude
			}
			this.refs.map.zoomToLocation(pos);
		}
    else if (data.hasOwnProperty('zoomFactor')){
      this.refs.map.zoomControl(data.zoomFactor);
    }
    else if (data.hasOwnProperty('map_style')){
      this.refs.map.changeBase(data.map_style);
    }
    else if (data.hasOwnProperty("position")){
      this.refs.map.autoPan(data.direction, data.position);
    }
    else if (data.hasOwnProperty('bin')){
      this.refs.map.dataManager(data.bin);
    }
    else{
      console.log("No idea what to do with:")
      console.log(data)
    }
	}

	render() {
		return (
			<div className={styles.maxHeight}>
				<div className={styles.mainContainer}>
					<SideMenu className={styles.sideMenu}></SideMenu>
					<MapComponent ref="map" className={styles.mapContainer}></MapComponent>
				</div>
				<Websocket reconnect={true} url={SOCKET_URL} onMessage={this.handleData.bind(this)} debug={true}/>
			</div>
		)
	}
}
