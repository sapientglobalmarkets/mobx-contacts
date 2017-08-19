import React from 'react';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: {
        borderRight: `1px solid ${theme.palette.text.divider}`
    }
});

function VerticalDividerBase({ classes }) {
    return <div className={classes.root} />;
}

export const VerticalDivider = withStyles(styles)(VerticalDividerBase);
