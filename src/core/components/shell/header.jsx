import React from 'react';
import AppBar from 'material-ui/AppBar';

export default class Header extends React.Component {

    render() {
        let headerStyle = {
            flex: '0 0 64px'
        };

        return (
            <div style={headerStyle}>
                <AppBar
                    title="MobX Contacts"
                    showMenuIconButton={false}
                />
            </div>
        );
    }
}
