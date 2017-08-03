import React from 'react';
import { CircularProgress } from 'material-ui/Progress';
import { createStyleSheet, withStyles } from 'material-ui/styles';

const styleSheet = createStyleSheet('BusyIndicator', () => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

function BusyIndicatorBase({ classes }) {
    return (
        <div className={classes.root}>
            <CircularProgress />
        </div>
    );
}

export const BusyIndicator = withStyles(styleSheet)(BusyIndicatorBase);
