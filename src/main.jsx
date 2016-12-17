import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory, Router} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';

import { routes } from './routes';

// Stores
import { contactStore } from './contacts';

// Styles
import 'sanitize.css/sanitize.css';
import './assets/styles/styles.css';

// Avoid iOS's 300ms tap delay by injecting TapEventPlugin
injectTapEventPlugin();

// Enable strict mode for MobX. This disallows state changes outside of an action
useStrict(true);

ReactDOM.render(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Provider contactStore={contactStore}>
            <Router history={browserHistory}>
                {routes}
            </Router>
        </Provider>
    </MuiThemeProvider>,
    document.querySelector('main')
);
