import React from 'react';
import Paper from 'material-ui/Paper';
import { grey200, red500 } from 'material-ui/styles/colors';

export default function ResultPanel({result}) {

    if (!result) { return null; }

    let theme = {
        errorColor: red500,
        backgroundColor: grey200
    };

    let style = {
        height: 50,
        marginTop: '10px',
        backgroundColor: theme.backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };
    if (result && result.code) {
        style.color = theme.errorColor;
    }

    return (
        <Paper style={ style } rounded={ false } zDepth={1}>
            {result.message}
        </Paper>
    );
}
