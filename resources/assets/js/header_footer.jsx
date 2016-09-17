/**
 * Here are the React components for Nav and it's children loginmenu and registration form,
 * and for the site footer. These components are bundled with webpack and called from
 * main.blade.php
 */

require('styles.css');

import React from 'react';

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

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

var RegisterForm = React.createClass({

    getInitialState: function() {
        return {
            open: false,
            emailErr: '',
            passwordErr: '',
            password_conf_Err: ''
        };
    },
    handleOpen: function() {
        this.setState({open: true});
    },
    handleClose: function() {
        this.setState({
            open: false,
            emailErr: '',
            passwordErr: '',
            password_conf_Err: ''
        });
    },
    handleSubmit: function(e) {
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
        // @TODO fetch() browser support detection
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
    },
    render: function() {

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
                    <TextField id="rEmail" floatingLabelText="Email:" floatingLabelFixed={true} type="email" errorText={this.state.emailErr} /><br/>
                    <TextField id="rPassword" floatingLabelText="Password:" floatingLabelFixed={true} type="password" errorText={this.state.passwordErr} /><br/>
                    <TextField id="rConfPassword" floatingLabelText="Confirm Password:" floatingLabelFixed={true} errorText={this.state.password_confErr} type="password"/>
                </form>
            </Dialog>
        );
    }
});

var LoginMenu = React.createClass({

    getInitialState: function() {
        return {
            open: false,
            emailErr: '',
            passwordErr: ''
        };
    },
    handleOpen: function(event) {
        event.preventDefault();
        this.setState({open: true, anchorEl: event.currentTarget});
    },
    handleClose: function() {
        this.setState({
            open: false,
            emailErr: '',
            passwordErr: ''
        });
    },
    handleSubmit: function(e) {
        e.preventDefault();
        this.setState({
            emailErr: '',
            passwordErr: ''
        });
        var form = new FormData(document.querySelector('login-form'));
        form.set('email', document.getElementById('lEmail').value);
        form.set('password', document.getElementById('lPassword').value);
        fetch('/auth/login', {
            method: 'POST',
            body: form,
            headers: {'X-CSRF-Token': _token, "Accept": "application/json"},
            credentials: 'same-origin'
        })
            .then(function(response) {
                if(response.ok){
                    this.handleClose();
                    window.location.href = '/';
                }
                else
                {
                    response.json()
                        .then(function(json) {
                            this.setState({
                                emailErr: json.email,
                                passwordErr: json.password
                            });
                        }.bind(this));
                }
            }.bind(this)).catch(function (errors) {
                console.log(errors);
            });
    },
    handleRegOpen: function() {
        this.props.openRegForm();
        this.handleClose();
    },
    render: function() {
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
});

var NavBar = React.createClass({
    childContextTypes: {muiTheme: React.PropTypes.object.isRequired},
    getChildContext: function() {
        return {muiTheme: getMuiTheme(baseTheme)};
    },
    openRegForm: function() {
        this.refs.regform.setState({open: true});
    },
    logout: function() {
        window.location.href = '/auth/logout';
    },
    render: function() {
        var loginoutlink = '';
        if(!logged_in) {
            loginoutlink= React.createElement(
                'div',
                {},
                React.createElement(LoginMenu, {openRegForm: this.openRegForm}),
                React.createElement(RegisterForm, {ref:"regform"}));
        } else {
            var logoutlink= React.createElement(FlatButton, {onClick: this.logout}, "Logout");
            var name = (cur_user.profile.first) ? cur_user.profile.first : cur_user.email;
            var user  = React.createElement('a', {href: window.location.origin + '/profile'}, "Oh hello, " + name);
            loginoutlink = React.createElement('div', {id: 'logout_link'}, user, logoutlink);
        }
        return (
            <AppBar
                ref="appbar"
                title={<a href='/'>InvoiceTrackr</a>}
                iconElementRight={loginoutlink}
                showMenuIconButton={false}
                style={{background: '#BBDEFB'}}
            />
        );
    }
});

var Footer = React.createClass({
    childContextTypes: {muiTheme: React.PropTypes.object.isRequired},
    getChildContext: function() {
        return {muiTheme: getMuiTheme(baseTheme)};
    },
    render: function() {
        return (
            <Toolbar style={{display: 'flex', justifyContent: 'space-around', height: '10vh'}} >
                <ToolbarGroup style={{display: 'block'}}>
                    <span><a href="http://github.com/realjv3" target="_blank">Created by John Verity</a></span>
                    <img src="https://www.dropbox.com/s/a9dssghwmtbfq8j/NoGodNoMasters_icon.png?dl=1" style={{width: '26px', position: 'relative',top: '6px', margin: '0 -10px 0 5px'}}/>
                    <ToolbarSeparator style={{float: 'none'}}/>
                    <img src="https://www.dropbox.com/s/46tmdwda5btqyzv/YellowOnBlackBipCotFlag-NO_QR-Code-small.png?dl=1" style={{width: '45px', position: 'relative',top: '10px', margin: '0 0 0 5px'}}/>
                    <span><a href="http://bipcot.org/" target="_blank">BipCot NoGov License</a></span>
                </ToolbarGroup>
            </Toolbar>
        );
    }
});

export {NavBar, Footer}
