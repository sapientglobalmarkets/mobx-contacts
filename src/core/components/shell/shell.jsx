import React from 'react';
import Header from './header';
// import DevTools from 'mobx-react-devtools';

import styles from './shell.css';

export default function Shell(props) {
    return (
        <div className={styles.shell}>
            <Header />
            {props.children}
            {/* <DevTools position={{top: 46, left: 25}} /> */}
        </div>
    );
}
