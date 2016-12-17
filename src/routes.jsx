import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import { ContactsPage } from './contacts';
import { Shell } from './core';

export let routes = (
    <Route path="/" component={Shell}>
        <IndexRoute component={ContactsPage}/>
        <Redirect from="*" to="/"/>
    </Route>
);
