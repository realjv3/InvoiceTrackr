/**
 * Created by John on 4/29/2016.
 */

var RegisterForm= React.createClass({

    getInitialState: function() {
        return {open: false};
    },
    handleOpen: function() {
        this.setState({open: true});
    },
    handleClose: function() {
        this.setState({open: false});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        fetch('auth/register', {method: 'GET'})
        .then(function(resp) {console.log(resp.blob())});
    },
    render: function() {

        const actions= [
            <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
            <FlatButton label="Submit" primary={true} keyboardFocused={true} onClick={this.handleClose} />
        ];

        return (
            <div>
                <Dialog
                    open={this.state.open}
                    title="Register"
                    actions={actions}
                    modal={true}
                    onRequestClose={this.handleClose}
                    >
                    <form onSubmit={this.handleSubmit}>
                        <List>
                            <ListItem>
                                <TextField
                                    floatingLabelText="Username:"
                                    floatingLabelFixed={true}
                                    /><br />
                            </ListItem>
                            <ListItem>
                                <TextField
                                    floatingLabelText="Password:"
                                    floatingLabelFixed={true}
                                    type="password"
                                    /><br />
                            </ListItem>
                        </List>
                        <FlatButton label="Register" type="submit" />
                    </form>
                </Dialog>
            </div>
        );
    }
});

var LoginMenu= React.createClass({

    getInitialState: function() {
        return {open: false};
    },
    handleOpen: function(event) {
        event.preventDefault();
        this.setState({open: true, anchorEl: event.currentTarget});
    },
    handleClose: function() {
        this.setState({open: false});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        fetch('/auth/login', {method: 'GET'})
        .then(function(resp) {
                console.log(resp.blob());
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
                    <form onSubmit={this.handleSubmit}>
                        <List>
                            <ListItem>
                                <TextField
                                    floatingLabelText="Username:"
                                    floatingLabelFixed={true}
                                    /><br />
                            </ListItem>
                            <ListItem>
                                <TextField
                                    floatingLabelText="Password:"
                                    floatingLabelFixed={true}
                                    type="password"
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
    render: function() {
        return (
            <AppBar
                title="do.stuff"
                iconElementRight={
                    <div>
                        <LoginMenu openRegForm={this.openRegForm} />
                        <RegisterForm ref="regform" />
                    </div>
                }
            />
        )
    }
});

ReactDOM.render(<NavBar menucss="" menubuttoncss="" />, document.getElementById('appbar'));