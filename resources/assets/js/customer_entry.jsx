/**
 * Customer entry modal
 */

import React from 'react';
import Proptypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import States from 'states.jsx';
import {getSelectedCustomer} from 'util.jsx';

class CustomerEntry extends React.Component
{
    constructor(props) {
        super(props);

        this.formfields = {
            cust_entry_company: '',
            cust_entry_first: '',
            cust_entry_last: '',
            cust_entry_email: '',
            cust_entry_addr1: '',
            cust_entry_addr2: '',
            cust_entry_city: '',
            cust_entry_zip: '',
            cust_entry_cell: '',
            cust_entry_office: ''
        };

        this.state = {
            open: false,
            snackbarOpen: false,
            fields: JSON.parse(JSON.stringify(this.formfields)),
            errors: JSON.parse(JSON.stringify(this.formfields)),
            message: '',
            edit: false
        };
    }

    removeErrors = () => this.setState({errors: JSON.parse(JSON.stringify(this.formfields))});

    handleOpen = (chosen, edit = false) => {
        if (edit) { //if editing, chosen is an id, need to pre-fill form with chosen customer's data
            const customer = getSelectedCustomer();
            this.setState({
                open: true,
                fields: {
                    cust_entry_id: customer.id,
                    cust_entry_company: customer.company,
                    cust_entry_first: customer.first,
                    cust_entry_last: customer.last,
                    cust_entry_email: customer.email,
                    cust_entry_addr1: customer.cust_profile.addr1,
                    cust_entry_addr2: customer.cust_profile.addr2,
                    cust_entry_city: customer.cust_profile.city,
                    cust_entry_state: customer.cust_profile.state,
                    cust_entry_zip: customer.cust_profile.zip,
                    cust_entry_cell: customer.cust_profile.cell,
                    cust_entry_office: customer.cust_profile.office
                },
                edit: edit
            });
        } else {//else if creating, chosen is a string, company field gets default value of input
            const tmp = this.state.fields;
            tmp.cust_entry_company = chosen;
            this.setState({open: true, fields: tmp, edit: edit});
        }
    };

    handleClose = () => {
        this.removeErrors();
        this.setState({
            open: false,
            snackbarOpen: false,
            fields: JSON.parse(JSON.stringify(this.formfields))
        });
    };

    handleSave = () => {
        this.removeErrors();
        const cust = new FormData();
        const fields = Object.keys(this.formfields);
        cust.set('id', this.state.fields.cust_entry_id);
        for (let i = 0; i < fields.length; i++) {
            cust.set(fields[i], document.getElementById(fields[i]).value);
        }
        cust.set('cust_entry_state', this.refs.cust_entry_state.state.value ? this.refs.cust_entry_state.state.value : '');
        fetch('save_customer?edit=' + this.state.edit , {
            method: 'post',
            body: cust,
            headers: {'X-CSRF-Token': _token, 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json'},
            credentials: 'same-origin'
        }).then((response) => {
            if(response.ok) {   //if save went ok, show Snackbar, update global cur_user & update the cust. drop-down
                response.json().then(
                    json => {
                        cur_user = JSON.parse(json.cur_user);
                        for(var i = 0; i < cur_user.customer.length; i++)
                            if(cur_user.customer[i].company === this.state.fields.cust_entry_company) {
                                cur_user.customer[i].selected = true;
                                break;
                            }
                        this.setState({message: json.message, snackbarOpen: true});
                        this.props.updateCustomersDropDown();
                    }
                );
            } else {    //flash errors into view
                response.json().then(function(errors) {
                    const keys = Object.keys(errors);
                    const fields = {};
                    for (let i = 0; i < keys.length; i++)
                        fields[keys[i]] = errors[keys[i]];
                    this.setState({errors: fields});
                }.bind(this));
            }
        });
    };

    render() {
        const actions = [
            <FlatButton
                label="Save Customer"
                onClick={this.handleSave}
                style={{color: 'green'}}
                />,
            <FlatButton
                label="Cancel"
                onClick={this.handleClose}
                style={{color: 'red'}}
                />
        ], style = {width: 'initial', marginRight: '50px'};
        var title = (this.state.edit) ? "Edit this customer." : "So this is a new customer. Nice.";
        return (
            <Dialog
                title={title}
                actions={actions}
                modal={true}
                open={this.state.open}
                bodyStyle={{overflow: 'auto'}}
                >
                <form id="cust_entry">
                    <fieldset>
                        <TextField
                            floatingLabelText="Company"
                            errorText={this.state.errors.cust_entry_company}
                            id="cust_entry_company"
                            className="profile_field"
                            style={style}
                            defaultValue={this.state.fields.cust_entry_company}
                            />
                        <TextField
                            floatingLabelText="First Name"
                            errorText={this.state.errors.cust_entry_first}
                            id="cust_entry_first"
                            className="profile_field"
                            style={style}
                            defaultValue={this.state.fields.cust_entry_first}
                            />
                        <TextField
                            floatingLabelText="Last Name"
                            errorText={this.state.errors.cust_entry_last}
                            id="cust_entry_last"
                            className="profile_field"
                            style={style}
                            defaultValue={this.state.fields.cust_entry_last}
                            />
                        <TextField
                            floatingLabelText="Email"
                            type="email"
                            errorText={this.state.errors.cust_entry_email}
                            id="cust_entry_email"
                            className="profile_field"
                            style={style}
                            defaultValue={this.state.fields.cust_entry_email}
                            />
                    </fieldset>
                    <fieldset>
                        <TextField
                            style={{ width: '300px'}}
                            floatingLabelText="Address1"
                            hintText="Address1"
                            id="cust_entry_addr1"
                            defaultValue={this.state.fields.cust_entry_addr1}
                            errorText={this.state.errors.cust_entry_addr1}
                            /><br />
                        <TextField
                            style={{ width: '300px'}}
                            floatingLabelText="Address2"
                            hintText="Address2"
                            id="cust_entry_addr2"
                            defaultValue={this.state.fields.cust_entry_addr2}
                            errorText={this.state.errors.cust_entry_addr2}
                            /><br />
                        <span style={{paddingTop: '30px', paddingBottom: '30px'}}>
                            <TextField
                                floatingLabelText="City"
                                id="cust_entry_city"
                                className="profile_field"
                                style={style}
                                defaultValue={this.state.fields.cust_entry_city}
                                errorText={this.state.errors.cust_entry_city}
                                />
                            <States
                                defaultValue={this.state.fields.cust_entry_state}
                                className="profile_field"
                                style={{top: '17px', width: '87px', paddingRight: '10px'}}
                                ref="cust_entry_state"
                                />
                            <TextField
                                floatingLabelText="Zip"
                                className="profile_field"
                                id="cust_entry_zip"
                                style={style}
                                defaultValue={this.state.fields.cust_entry_zip}
                                errorText={this.state.errors.cust_entry_zip}
                                />
                        </span><br />
                        <TextField
                            floatingLabelText="Cell"
                            id="cust_entry_cell"
                            type="tel"
                            style={style}
                            defaultValue={this.state.fields.cust_entry_cell}
                            errorText={this.state.errors.cust_entry_cell}
                            />
                        <TextField
                            floatingLabelText="Office"
                            id="cust_entry_office"
                            type="tel"
                            style={style}
                            defaultValue={this.state.fields.cust_entry_office}
                            errorText={this.state.errors.cust_entry_office}
                            />
                    </fieldset>
                    <Snackbar bodyStyle={{textAlign: 'center'}} open={this.state.snackbarOpen} message={this.state.message} onRequestClose={this.handleClose} autoHideDuration={3000} />
                </form>
            </Dialog>
        );
    }
}

CustomerEntry.propTypes = {
    // This component needs a method passed as a prop that will render
    // the contents of the parent component's customer drop-down
    updateCustomersDropDown: Proptypes.func.isRequired
}

export {CustomerEntry as default};