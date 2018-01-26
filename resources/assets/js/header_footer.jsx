/**
 * Here are the React components for Nav and it's children loginmenu and registration form,
 * and for the site footer. These components are bundled with webpack and called from
 * main.blade.php
 */

require('styles.css');

import React from 'react';

import 'whatwg-fetch';
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();
import {showOverlay, hideOverlay} from 'util.jsx';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import List from 'material-ui/List/List.js';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar/AppBar';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {indigo100} from 'material-ui/styles/colors.js';

class RegisterForm extends React.Component
{

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            emailErr: '',
            passwordErr: '',
            password_conf_Err: ''
        };
    }

    handleOpen = () => {
        this.setState({open: true});
    }

    handleClose = () => {
        this.setState({
            open: false,
            emailErr: '',
            passwordErr: '',
            password_conf_Err: ''
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            emailErr: '',
            passwordErr: '',
            password_confErr: ''
        });
        var form = new FormData(document.getElementById('reg-form'));
        form.append('email', document.getElementById('rEmail').value);
        form.append('password', document.getElementById('rPassword').value);
        form.append('password_confirmation', document.getElementById('rConfPassword').value);
        fetch('/auth/register',
            {
                method: 'POST',
                body: form,
                headers: new Headers(
                    {
                        "X-CSRF-TOKEN": _token,
                        "Accept": "application/json"
                    }),
                credentials: 'same-origin'
            }).then(function(response) {
                if(response.ok) {
                    this.handleClose();
                    window.location.href = '/';
                }
                else {
                    response.json()
                        .then(function(json) {
                            this.setState({
                                emailErr: json.email,
                                passwordErr: json.password,
                                password_confErr: json.password_confirmation
                            });
                        }.bind(this));
                }
            }.bind(this));
    }

    render() {

        const actions= [
                <FlatButton label='Cancel' primary={true} onClick={this.handleClose}/>,
                <FlatButton label='Submit' primary={true} onClick={this.handleSubmit} />
            ],
            style = { maxWidth: 'none'};

        return (
            <Dialog
                open={this.state.open}
                title='Register'
                actions={actions}
                modal={true}
                contentStyle={style}
                >
                <form id='reg-form'>
                    <TextField id="rEmail" floatingLabelText="Email" type="email" errorText={this.state.emailErr} /><br/>
                    <TextField id="rPassword" floatingLabelText="Password" type="password" errorText={this.state.passwordErr} /><br/>
                    <TextField id="rConfPassword" floatingLabelText="Confirm Password" errorText={this.state.password_confErr} type="password"/>
                </form>
            </Dialog>
        );
    }
}

class LoginMenu extends React.Component
{

    constructor(props) {
        super(props);
        this.state =  {
            open: false,
            emailErr: '',
            passwordErr: ''
        };
    }

    handleOpen = (event) => {
        event.preventDefault();
        this.setState({open: true, anchorEl: event.currentTarget});
    }

    handleClose = () => {
        this.setState({
            open: false,
            emailErr: '',
            passwordErr: ''
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        showOverlay();
        this.setState({
            emailErr: '',
            passwordErr: ''
        });
        var form = new FormData(document.querySelector('login-form'));
        form.append('email', document.getElementById('lEmail').value);
        form.append('password', document.getElementById('lPassword').value);
        fetch('/auth/login', {
            method: 'POST',
            body: form,
            headers: {'X-CSRF-Token': _token, "Accept": "application/json"},
            credentials: 'same-origin'
        })
            .then((response) => {
                if(response.ok) {
                    this.handleClose();
                    window.location.href = '/';
                } else {
                    response.json()
                        .then((json) => {
                            hideOverlay();
                            this.setState({
                                emailErr: json.email,
                                passwordErr: json.password
                            });
                        });
                }
            }).catch(function (errors) {
                console.log(errors);
            });
    }

    handleRegOpen = () => {
        this.props.openRegForm();
        this.handleClose();
    }

    render() {
        return (
            <div>
                <FlatButton label="Login" onClick={this.handleOpen} style={{ top: '8px'}}/>
                <Popover open={this.state.open} anchorEl={this.state.anchorEl} onRequestClose={this.handleClose} >
                    <form id="login-form" onSubmit={this.handleSubmit}>
                        <List>
                            <ListItem>
                                <TextField
                                    floatingLabelText="Email:"
                                    floatingLabelFixed={true}
                                    type="email"
                                    id="lEmail"
                                    errorText={this.state.emailErr}
                                    /><br />
                            </ListItem>
                            <ListItem>
                                <TextField
                                    floatingLabelText="Password:"
                                    floatingLabelFixed={true}
                                    type="password"
                                    id="lPassword"
                                    errorText={this.state.passwordErr}
                                    /><br />
                            </ListItem>
                        </List>
                        <FlatButton label="Login" type="submit" />
                    </form>
                    <Divider />
                    <FlatButton label="Register" onClick={this.handleRegOpen} />
                </Popover>
            </div>
        );

    }
}

const NavMenu = () => {
    return (
        <List style={{display: 'flex', flexDirection: 'row'}}>
            <ListItem href="/" primaryText="Transactions" rightIcon={ <img src="http://res.cloudinary.com/realjv3/image/upload/v1516748943/clock-1_nwisn9.png"/> } />
            <ListItem href="/invoices" primaryText="Invoices" rightIcon={ <img src="http://res.cloudinary.com/realjv3/image/upload/v1516748941/money_fy1hi1.png"/> } />
            <ListItem style={{display: 'none'}} href="/reports" primaryText="Reports" rightIcon={ <img src="http://res.cloudinary.com/realjv3/image/upload/v1516748942/business-1_pgeoxj.png"/> } />
        </List>
    );
}

class NavBar extends React.Component
{
    constructor(props) {
        super(props);
    }

    muiTheme = getMuiTheme({
        appBar: {color: indigo100},
        textField: {hintColor: "rgba(0, 0, 0, 0.67)", disabledTextColor: "rgba(0, 0, 0, 0.4)"}
    });

    openRegForm = () => {
        this.refs.regform.setState({open: true});
    }

    logout = () => {
        window.location.href = '/auth/logout';
    }

    render() {
        var loginoutlink = '', nav = '';
        if(!logged_in) {
            loginoutlink= React.createElement(
                'div',
                {},
                React.createElement(LoginMenu, {openRegForm: this.openRegForm}),
                React.createElement(RegisterForm, {ref:"regform"})
            );
        } else {
            var logoutlink= React.createElement(FlatButton, {onClick: this.logout}, "Logout");
            var name = (cur_user.profile.first) ? cur_user.profile.first : cur_user.email;
            var user  = React.createElement('a', {href: window.location.origin + '/profile'}, "Oh hello, " + name);
            loginoutlink = React.createElement('div', {id: 'logout_link'}, user, logoutlink);
            nav = <NavMenu />;
        }
        return (
            <MuiThemeProvider muiTheme={this.muiTheme}>
                <AppBar
                    ref="appbar"
                    title={<a href='/'>InvoiceTrackr</a>}
                    iconElementRight={(logged_in) ? nav : loginoutlink}
                    iconStyleRight={(logged_in) ? {marginTop: '0px !i', marginLeft: 'auto', marginRight: 'auto'} : {}}
                    showMenuIconButton={false}
                    children={(logged_in) ? loginoutlink : ''}
                    titleStyle={{flex: 'initial'}}
                />
            </MuiThemeProvider>
        );
    }
}

class Footer extends React.Component
{
    constructor(props) {
        super(props);
    }

    muiTheme = getMuiTheme({
        appBar: {color: '#3F51B5'},
        textField: {hintColor: '#C5CAE9'}
    });

    render() {
        return (
            <MuiThemeProvider muiTheme={this.muiTheme}>
                <Toolbar style={{display: 'flex', justifyContent: 'space-around', height: '10vh'}} >
                    <ToolbarGroup style={{display: 'flex'}}>
                        <span>
                            <a href="http://github.com/realjv3" target="_blank">
                                <img
                                    src="http://res.cloudinary.com/realjv3/image/upload/v1516748944/YellowOnBlackBipCotFlag-NO_QR-Code-small_hybudv.png"
                                    style={{width: '48px'}}
                                />
                            </a>
                        </span>
                        <ToolbarSeparator style={{margin: '0 24px 0 16px'}}/>
                        <span>
                            <a href="http://bipcot.org/" target="_blank">
                                <img
                                    src="http://res.cloudinary.com/realjv3/image/upload/v1516748942/NoGodNoMasters_icon_wadk8m.png"
                                    style={{width: '26px'}}
                                />
                            </a>
                        </span>
                    </ToolbarGroup>
                </Toolbar>
            </MuiThemeProvider>
        );
    }
}

export {NavBar, Footer}
