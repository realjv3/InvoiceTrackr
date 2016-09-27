/**
 * Global modules for all pages
 */

import React from 'react';
import ReactDOM from 'react-dom';

require('landing.css');
var timer = require('ic_av_timer_black_24dp_2x.png');
var cart = require('ic_shopping_cart_black_24dp_2x.png');
var receipt = require('ic_receipt_black_24dp_2x.png');
var send = require('ic_send_black_24dp_2x.png');
var money = require('ic_monetization_on_black_24dp_2x.png');

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import {NavBar, Footer} from 'header_footer.jsx';
ReactDOM.render(<NavBar />, document.getElementById('appbar'));
ReactDOM.render(<Footer />, document.getElementById('footer'));


if(window.innerWidth > 1030) {
    let html = '<div id="landing_animation">';
    html += '<img src="'+money+'" class="gwd-img-6n2d gwd-gen-1lpngwdanimation"><p class="gwd-p-16e3 gwd-gen-18sogwdanimation"><span class="gwd-span-6ayw gwd-span-n2tp">Get paid.</span><br></p>';
    html += '<img src="'+receipt+'" class="gwd-img-1155 gwd-gen-1hfggwdanimation">';
    html += '<img src="'+send+'" class="gwd-img-sg9z gwd-gen-17zogwdanimation">';
    html += '<p class="gwd-p-18f6 gwd-gen-um4ugwdanimation">Create and send invoices.</p>';
    html += '<img src="'+cart+'" class="gwd-img-1wnw gwd-gen-7uo2gwdanimation">';
    html += '<img src="'+timer+'" class="gwd-img-12cy gwd-gen-18u5gwdanimation">';
    html += '<span class="gwd-span-1iss"><span class="gwd-span-2elb">Track billable items.</span><br></span>';
    html += '</div> <!-- div#greeting -->';
    document.getElementById('content').innerHTML = html;
}
 else {
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
}

