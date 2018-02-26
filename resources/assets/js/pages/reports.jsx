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
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Card from 'material-ui/Card/Card.js';
import CardHeader from 'material-ui/Card/CardHeader.js';
import CardText from 'material-ui/Card/CardText.js';
import CardActions from 'material-ui/Card/CardActions.js';

//import Trx from 'module_trx.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

function Main_area() {
    const muiTheme = getMuiTheme({
        textField: {hintColor: "rgba(0, 0, 0, 0.67)", disabledTextColor: "rgba(0, 0, 0, 0.4)"}
    });
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <Paper className="main_area">
                <Card className="cards">
                    <CardHeader
                        title="Reports"
                        subtitle="Keep an eye on things"
                        actAsExpander={false}
                        avatar="https://res.cloudinary.com/realjv3/image/upload/v1516748942/business-1_pgeoxj.png"
                        />
                    <CardText expandable={false} style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flexWrap: 'nowrap'
                    }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                </Card>
            </Paper>
        </MuiThemeProvider>
    );
}

ReactDOM.render(<Main_area />, document.getElementById('content'));


