import React from 'react'
import styles from './index.scss';

export default class SideMenu extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<div>
        dangerouslySet
        <object data="src/globe-black.svg" type="image/svg+xml"></object>
        <img src="./globe-black.svg" classNames={styles.log}></img>
        <svg xmlns="./globe-black.svg" viewBox="0 0 100 100" version="1.1" className={styles.logo}></svg>
				<logo className={styles.logo} />
			</div>
		)
	}
}
