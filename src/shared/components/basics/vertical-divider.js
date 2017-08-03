import React from 'react';
import { createStyleSheet, withStyles } from 'material-ui/styles';

const styleSheet = createStyleSheet('VerticalDivider', theme => ({
    root: {
        borderRight: `1px solid ${theme.palette.text.divider}`
    }
}));

function VerticalDividerBase({ classes }) {
    return <div className={classes.root} />;
}

export const VerticalDivider = withStyles(styleSheet)(VerticalDividerBase);
