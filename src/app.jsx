import styles from './index.scss';
import React from 'react';
import MapComponent from './MapComponent.jsx';
import TitleBar from './TitleBar.jsx';
import SideMenu from './SideMenu.jsx';

export default class App extends React.Component {
	render() {
		return (
			<div className={styles.maxHeight}>
				<TitleBar title="These are some maps"></TitleBar>
        <div className={styles.mainContainer}>
          <SideMenu className={styles.sideMenu}> </SideMenu>
          <MapComponent className={styles.maxHeight}></MapComponent>
        </div>
				<TitleBar title="Alexa Crap"></TitleBar>
			</div>
		)
	}
}
