/**
 * Created by John on 4/29/2016.
 */

var RegisterForm= React.createClass({

    getInitialState: function() {
        return {
            open: false,
            nameErr: '',
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
            nameErr: '',
            emailErr: '',
            passwordErr: '',
            password_conf_Err: ''
        });
    },
    handleSubmit: function(e) {
        e.preventDefault();

        this.setState({
            nameErr: '',
            emailErr: '',
            passwordErr: '',
            password_confErr: ''
        });
        var form = new FormData(document.getElementById('reg-form'));
        form.append('email', document.getElementById('rEmail').value);
        form.append('name', document.getElementById('rName').value);
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
            if(response.ok)
                this.handleClose();
            else
            {
                response.json()
                .then(function(json) {
                    this.setState({
                        emailErr: json.email,
                        nameErr: json.name,
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
                    <TextField id="rName" floatingLabelText="Name:" floatingLabelFixed={true} errorText={this.state.nameErr} /><br/>
                    <TextField id="rPassword" floatingLabelText="Password:" floatingLabelFixed={true} type="password" errorText={this.state.passwordErr} /><br/>
                    <TextField id="rConfPassword" floatingLabelText="Confirm Password:" floatingLabelFixed={true} errorText={this.state.password_confErr} type="password"/>
                </form>
            </Dialog>
        );
    }
});

var LoginMenu= React.createClass({

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
        var form = new FormData(document.getElementById('login-form'));
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

    openRegForm: function() {
        this.refs.regform.setState({open: true});
    },
    logout: function() {
        window.location.href = 'auth/logout';
    },
    render: function() {

        var loginlink= React.createElement(
            'div',
            {},
            React.createElement(LoginMenu, {openRegForm: this.openRegForm}),
            React.createElement(RegisterForm, {ref:"regform"}));
        var logoutlink= React.createElement(FlatButton, {onClick: this.logout}, "Logout");

        return (
            <AppBar
                ref="appbar"
                title="Invoice this"
                iconElementRight={(loggedin) ? logoutlink : loginlink}
            />
        )
    }
});

ReactDOM.render(<NavBar />, document.getElementById('appbar'));