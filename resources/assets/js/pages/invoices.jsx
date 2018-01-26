/**
 * Global modules for all pages
 */
import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import {NavBar, Footer} from 'header_footer.jsx';
ReactDOM.render(<NavBar />, document.getElementById('appbar'));
ReactDOM.render(<Footer />, document.getElementById('footer'));

/**
 * Local modules for this page
 * Main content area that contains trx, invoicing and reporting modules
 */
import Paper from 'material-ui/Paper';
import InvoiceModule from 'module_invoices.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

function Main_area() {
    const muiTheme = getMuiTheme({
        textField: {hintColor: "rgba(0, 0, 0, 0.67)", disabledTextColor: "rgba(0, 0, 0, 0.4)"}
    });
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <Paper className="main_area">
                <InvoiceModule />
            </Paper>
        </MuiThemeProvider>
    );
}

ReactDOM.render(<Main_area />, document.getElementById('content'));
