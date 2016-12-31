/**
 * Global modules for all pages
 */

import React from 'react';
import ReactDOM from 'react-dom';

import 'whatwg-fetch';
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import {NavBar, Footer} from 'header_footer.jsx';
ReactDOM.render(<NavBar />, document.getElementById('appbar'));
ReactDOM.render(<Footer />, document.getElementById('footer'));

/**
 * Local modules for this page
 * Here are components for updating user profiles
 */

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import SaveIcon from 'material-ui/svg-icons/content/save';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import States from 'states.jsx';

class Profile extends React.Component
{
    formfields = {
        company: '',
        first: '',
        last: '',
        email: '',
        addr1: '',
        addr2: '',
        city: '',
        zip: '',
        cell: '',
        office: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            formfields: this.formfields,
            message: '',
            open: false
        };
    }

    static childContextTypes = {muiTheme: React.PropTypes.object.isRequired};
    getChildContext = () => {
        return {
            muiTheme: getMuiTheme({
                textField: {hintColor: "rgba(0, 0, 0, 0.77)", disabledTextColor: "rgba(0, 0, 0, 0.4)"}
            })
        };
    }

    handleClose = () => {
        this.setState({open: false});
    }

    handleSave = (e) => {
        e.preventDefault();
        var form = new FormData(document.getElementById('profile-form'));
        var fields = Object.keys(this.formfields);
        for(var i = 1; i < fields.length; i++)
            form.set(fields[i], document.getElementById(fields[i]).value);
        form.set('state', this.refs.user_state.state.value);
        fetch('/profile/save', {
            method: 'POST',
            body: form,
            headers: {'X-CSRF-Token': _token, 'X-Requested-With': 'XMLHttpRequest', "Accept": "application/json"},
            credentials: 'same-origin'
        }).then(function(response){
            if(!response.ok) {
                response.json().then(function(json) {
                    var newState = {};
                    for(var field in json) {
                        var key = field;
                        newState[key] = json[key];
                    }
                    this.setState({formfields: newState});
                }.bind(this));
            } else {
                response.text().then(function(text) {
                    this.setState({formfields: this.formfields, message: text, open: true});
                }.bind(this));
            }
        }.bind(this));
    }

    render() {
        return (
            <Paper id="profile">
                <form id="profile-form" onSubmit={this.handleSave}>
                    <fieldset style={{ margin: '5px', padding: '20px', border: 'solid 1px #E0DEDE', backgroundColor: '#F7FAF5'}}>
                        <TextField
                            floatingLabelText="Company"
                            className="profile_field"
                            name="company"
                            id="company"
                            errorText={this.state.formfields.company}
                            defaultValue={cur_user.profile.company}
                        /><br />
                        <TextField
                            floatingLabelText="First"
                            className="profile_field"
                            name="first"
                            id="first"
                            errorText={this.state.formfields.first}
                            defaultValue={cur_user.profile.first}
                        />
                        <TextField
                            floatingLabelText="Last"
                            className="profile_field"
                            name="last"
                            id="last"
                            errorText={this.state.formfields.last}
                            defaultValue={cur_user.profile.last}
                        /><br />
                        <TextField
                            floatingLabelText="Email"
                            className="profile_field"
                            defaultValue={cur_user.email}
                            name="email"
                            id="email"
                            errorText={this.state.formfields.email}
                            defaultValue={cur_user.email}
                        />
                    </fieldset>
                    <fieldset style={{ margin: '5px', padding: '20px', border: 'solid 1px #E0DEDE', backgroundColor: '#F7FAF5'}}>
                        <TextField
                            style={{ width: '300px'}}
                            floatingLabelText="Address1"
                            className="profile_field"
                            name="addr1"
                            id="addr1"
                            errorText={this.state.formfields.address1}
                            defaultValue={cur_user.profile.address1}
                        /><br />
                        <TextField
                            style={{ width: '300px'}}
                            floatingLabelText="Address2"
                            className="profile_field"
                            name="addr2"
                            id="addr2"
                            errorText={this.state.formfields.address2}
                            defaultValue={cur_user.profile.address2}
                        /><br />
                    <span style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}} >
                        <TextField
                            floatingLabelText="City"
                            className="profile_field"
                            name="city"
                            id="city"
                            errorText={this.state.formfields.city}
                            defaultValue={cur_user.profile.city}
                        />
                        <States ref="user_state" defaultValue={cur_user.profile.state} style={{width: '50px', paddingRight: '10px'}} />
                        <TextField
                            style={{width: '100px'}}
                            floatingLabelText="Zip"
                            className="profile_field"
                            name="zip"
                            id="zip"
                            errorText={this.state.formfields.zip}
                            defaultValue={cur_user.profile.zip}
                        /><br />
                    </span>
                        <TextField
                            floatingLabelText="Cell"
                            className="profile_field"
                            name="cell"
                            id="cell"
                            type="tel"
                            errorText={this.state.formfields.cell}
                            defaultValue={cur_user.profile.cell}
                        />
                        <TextField
                            floatingLabelText="Office"
                            className="profile_field"
                            name="office"
                            id="office"
                            type="tel"
                            errorText={this.state.formfields.office}
                            defaultValue={cur_user.profile.office}
                        />
                    </fieldset>
                    <FlatButton secondary={true} label="Save" icon={<SaveIcon />} type="submit" style={{color:'green'}}/>
                    <FlatButton primary={true} label="Cancel" icon={<CancelIcon />} href="/"  style={{color:'red'}}/>
                </form>
                <Snackbar open={this.state.open} message={this.state.message} onRequestClose={this.handleClose} autoHideDuration={3000} />
            </Paper>
        );
    }
}

export {Profile as default };

ReactDOM.render(<Profile />, document.getElementById('content'));
