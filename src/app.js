import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import blue from 'material-ui/colors/blue';
import pink from 'material-ui/colors/pink';
import red from 'material-ui/colors/red';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'mobx-react';
import { contactStore } from 'shared/stores/contact.store';
import { Shell } from './shell';

export class App extends React.Component {
    render() {
        const palette = {
            primary: blue,
            accent: pink,
            error: red,
            type: 'light'
        };

        const typography = {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
        };

        const theme = createMuiTheme({ palette, typography });
        const stores = { contactStore };

        return (
            <MuiThemeProvider theme={theme}>
                <Provider {...stores}>
                    <Router>
                        <Shell />
                    </Router>
                </Provider>
            </MuiThemeProvider>
        );
    }
}
