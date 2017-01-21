import React from 'react'
import styles from './index.scss';

export default class SideMent extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return (
    <h3 className={styles.titleBar}>This is the side menu</h3>
    )
  }
}
