import React from 'react'
import styles from './index.scss';
import logo from './globe.svg';
import usc from './usclogo.svg';

export default class SideMenu extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<div className={styles.logoBox}>

				<span className={styles.globe}>
					<img src={logo}></img>
				</span>
	
			</div>
		)
	}
}
