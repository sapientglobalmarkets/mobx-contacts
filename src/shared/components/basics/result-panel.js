import React from 'react';
import Paper from 'material-ui/Paper';
import { createStyleSheet, withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styleSheet = createStyleSheet('ResultPanel', theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: 16,
        marginBottom: 16
    }),
    error: {
        color: theme.palette.error[500]
    }
}));

/**
 * @param result: Example: { code: 'error', message: 'No Internet connection' }
 */
function ResultPanelBase({ classes, result }) {
    if (!result) {
        return null;
    }

    return (
        <Paper className={classes.root} square>
            <Typography
                type="body1"
                className={result.code ? classes.error : null}
            >
                {result.message}
            </Typography>
        </Paper>
    );
}

export const ResultPanel = withStyles(styleSheet)(ResultPanelBase);
