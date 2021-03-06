import React from 'react';
import styles from './DescriptionCardCyan.module.css';

const DescriptionCardCyan = ({span_text , img}) => {


    return(
        <>
            <div className={`row ${styles.container_text} cyan`}>
                <div className={`col s12 m5 l5`}>
                    <img className={`${styles.img}`} src={img}/>
                </div>
                <div className={`col s12 m7 l7 ${styles.container_text__text}`}>
                        <span>{span_text}</span>
                </div>
            </div>

        </>
    )
}

export default DescriptionCardCyan;