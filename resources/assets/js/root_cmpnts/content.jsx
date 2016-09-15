/**
 * Global modules for all pages
 */
require('styles.css');

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
import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';

import Trx from 'module_trx.jsx';

var Main_area = React.createClass({
    render: function() {
        return (
            <Paper className="main_area">
                <Trx />
                <Card className="cards">
                    <CardHeader
                        title="Invoices"
                        subtitle="Cash rules everything around me"
                        actAsExpander={true}
                        showExpandableButton={true}
                        avatar="https://www.dropbox.com/s/1x89klicik0olnk/money.png?dl=1"
                        />
                    <CardText expandable={true}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                    <CardActions expandable={true}>
                        <FlatButton label="Action1" />
                        <FlatButton label="Action2" />
                    </CardActions>
                </Card>
                <Card className="cards">
                    <CardHeader
                        title="Reports"
                        actAsExpander={true}
                        showExpandableButton={true}
                        avatar="https://www.dropbox.com/s/q4fou4u4qvx0z09/business-1.png?dl=1"
                        />
                    <CardText expandable={true}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                    <CardActions expandable={true}>
                        <FlatButton label="Action1" />
                        <FlatButton label="Action2" />
                    </CardActions>
                </Card>
            </Paper>
        );
    }
});

ReactDOM.render(<Main_area />, document.getElementById('content'));
