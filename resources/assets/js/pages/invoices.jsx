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

import getMuiTheme from 'material-ui/styles/getMuiTheme';

var Main_area = React.createClass({
    childContextTypes: {muiTheme: React.PropTypes.object.isRequired},
    getChildContext: function() {
        return {
            muiTheme: getMuiTheme({
                textField: {hintColor: "rgba(0, 0, 0, 0.67)", disabledTextColor: "rgba(0, 0, 0, 0.4)"}
            })
        };
    },
    render: function() {
        return (
            <Paper className="main_area">
                <InvoiceModule />
            </Paper>
        );
    }
});

ReactDOM.render(<Main_area />, document.getElementById('content'));
