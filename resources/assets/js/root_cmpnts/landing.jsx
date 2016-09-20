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

function Slogan() {
    return (
        <div id="greeting">
            <h1>Track billable items.</h1>
            <h1>Create and send invoices.</h1>
            <h1>Get paid.</h1>
        </div>
    )
}
ReactDOM.render(<Slogan />, document.getElementById('content'));

