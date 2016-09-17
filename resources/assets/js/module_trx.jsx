/**
 * Created by John on 8/22/2016.
 * React components for Trx tracking module
 */

import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Autocomplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import Card from 'material-ui/Card/Card.js';
import CardActions from 'material-ui/Card/CardActions.js';
import CardHeader from 'material-ui/Card/CardHeader.js';
import CardText from 'material-ui/Card/CardText.js';

import States from 'states.jsx';

var CustomerEntry = React.createClass({
    formfields: {
        company: '',
        first: '',
        last: '',
        email: '',
        addr1: '',
        addr2: '',
        city: '',
        state: '',
        zip: '',
        cell: '',
        office: ''
    },
    getInitialState: function() {
        return {
            open: false,
            snackbarOpen: false,
            fields: JSON.parse(JSON.stringify(this.formfields)),
            errors: JSON.parse(JSON.stringify(this.formfields)),
            message: '',
            edit: false
        };
    },
    removeErrors: function() {
        this.setState({errors: this.formfields})
    },
    handleOpen: function(chosen, edit = false) {
        if (edit) { //if editing, chosen is an id, need to pre-fill form with chosen customer's data
            for (var i = 0; i < cur_user.customer.length; i++) {
                if(cur_user.customer[i].id == chosen) {
                    var customer = cur_user.customer[i];
                    break;
                }
            }
            this.setState({
                open: true,
                fields: {
                    id: customer.id,
                    company: customer.company,
                    first: customer.first,
                    last: customer.last,
                    email: customer.email,
                    addr1: customer.cust_profile.addr1,
                    addr2: customer.cust_profile.addr2,
                    city: customer.cust_profile.city,
                    state: customer.cust_profile.state,
                    zip: customer.cust_profile.zip,
                    cell: customer.cust_profile.cell,
                    office: customer.cust_profile.office
                },
                edit: edit
            });
        } else {//else if creating, chosen is a string, company field gets default value of input
            var tmp = this.state.fields;
            tmp.company = chosen;
            this.setState({open: true, fields: tmp, edit: edit});
        }
    },
    handleClose: function() {
        this.removeErrors();
        this.setState({
            open: false,
            snackbarOpen: false,
            fields: JSON.parse(JSON.stringify(this.formfields)),
            errors: JSON.parse(JSON.stringify(this.formfields))
        });
    },
    handleSave: function(event) {
        this.removeErrors();
        var cust = new FormData();
        var fields = Object.keys(this.formfields);
        cust.set('id', this.state.fields.id);
        for(var i = 0; i < fields.length; i++)
            cust.set(fields[i], document.getElementById(fields[i]).value);
        fetch('save_customer?edit=' + this.state.edit , {
            method: 'post',
            body: cust,
            headers: {'X-CSRF-Token': _token, 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json'},
            credentials: 'same-origin'
        }).then(function(response) {
            if(response.ok) {   //if save went ok, show Snackbar, update global cur_user & update the cust. drop-down
                response.json().then(
                    function(json) {
                        cur_user = JSON.parse(json.cur_user);
                        this.setState({message: json.message, snackbarOpen: true});
                        this.props.updateCustomersDropDown();
                    }.bind(this)
                );
            } else {    //flash errors into view
                response.json().then(function(errors) {
                    var keys = Object.keys(errors);
                    var fields = {};
                    for(var i = 0; i < keys.length; i++)
                        fields[keys[i]] = errors[keys[i]];
                    this.setState({errors: fields});
                }.bind(this));
            }
        }.bind(this));
    },
    render: function() {
        const actions = [
            <FlatButton
                label="Save Customer"
                onTouchTap={this.handleSave}
                />,
            <FlatButton
                label="Cancel"
                onTouchTap={this.handleClose}
                />
        ];
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
                            floatingLabelFixed={true}
                            hintText="Company"
                            errorText={this.state.errors.company}
                            id="company"
                            style={{width: 'initial'}}
                            defaultValue={this.state.fields.company}
                            className="profile_field"
                            />
                        <TextField
                            floatingLabelText="First Name"
                            floatingLabelFixed={true}
                            hintText="First Name"
                            errorText={this.state.errors.first}
                            id="first"
                            style={{width: 'initial'}}
                            defaultValue={this.state.fields.first}
                            className="profile_field"
                            />
                        <TextField
                            floatingLabelText="Last Name"
                            hintText="Last Name"
                            floatingLabelFixed={true}
                            errorText={this.state.errors.last}
                            id="last"
                            style={{width: 'initial'}}
                            defaultValue={this.state.fields.last}
                            className="profile_field"
                            />
                        <TextField
                            floatingLabelText="Email"
                            hintText="Email"
                            floatingLabelFixed={true}
                            type="email"
                            errorText={this.state.errors.email}
                            id="email"
                            style={{width: 'initial'}}
                            defaultValue={this.state.fields.email}
                            className="profile_field"
                            />
                    </fieldset>
                    <fieldset>
                        <TextField
                            style={{ width: '300px'}}
                            hintText="Address1"
                            floatingLabelText="Address1"
                            hintText="Address1"
                            id="addr1"
                            style={{width: 'initial'}}
                            defaultValue={this.state.fields.addr1}
                            errorText={this.state.errors.addr1}
                            className="profile_field"
                            /><br />
                        <TextField
                            style={{ width: '300px'}}
                            hintText="Address2"
                            floatingLabelText="Address2"
                            hintText="Address2"
                            id="addr2"
                            style={{width: 'initial'}}
                            defaultValue={this.state.fields.addr2}
                            errorText={this.state.errors.addr2}
                            className="profile_field"
                            /><br />
                        <span style={{paddingTop: '30px', paddingBottom: '30px'}}>
                            <TextField
                                floatingLabelText="City"
                                hintText="City"
                                id="city"
                                style={{width: 'initial'}}
                                defaultValue={this.state.fields.city}
                                errorText={this.state.errors.city}
                                className="profile_field"
                                />
                            <States
                                defaultValue={this.state.fields.state}
                                error={this.state.errors.state}
                                className="profile_field"
                                style={{top: '31px', width: '50px', paddingRight: '10px'}}
                                />
                            <TextField
                                hintText="Zip"
                                floatingLabelText="Zip"
                                className="profile_field"
                                id="zip"
                                style={{width: 'initial'}}
                                defaultValue={this.state.fields.zip}
                                errorText={this.state.errors.zip}
                                className="profile_field"
                                />
                        </span><br />
                        <TextField
                            hintText="Cell"
                            floatingLabelText="Cell"
                            id="cell"
                            style={{width: 'initial'}}
                            defaultValue={this.state.fields.cell}
                            errorText={this.state.errors.cell}
                            className="profile_field"
                            />
                        <TextField
                            hintText="Office"
                            floatingLabelText="Office"
                            id="office"
                            style={{width: 'initial'}}
                            defaultValue={this.state.fields.office}
                            errorText={this.state.errors.office}
                            className="profile_field"
                            />
                    </fieldset>
                    <Snackbar open={this.state.snackbarOpen} message={this.state.message} onRequestClose={this.handleClose} autoHideDuration={3000} />
                </form>
            </Dialog>
        );
    }
});

var DeleteCustomerDialog = React.createClass({
    getInitialState: function() {
        return ({open: false});
    },
    handleOpen: function(id) {
        this.setState({open: true, id: id});
    },
    handleClose: function() {
        this.setState({open: false});
    },
    render: function() {
        const actions= [
            <FlatButton label="Cancel" primary={true} onTouchTap={this.handleClose} />,
            <FlatButton label="Continue" primary={true} className={this.state.id} onClick={this.props.deleteCustomer} />
        ];

        return (
            <Dialog
                title="Are you sure you want to do this?"
                actions={actions}
                modal={true}
                open={this.state.open}
                onRequest={this.handleClose}
                >
                Do you really want to permanently delete this customer and all of their transactions?
            </Dialog>
        );
    }
});

var TrxEntry = React.createClass({
    getInitialState: function() {
        return {customers: this.initCustomers(), snackbarOpen: false, message: '', showDelCustDialog: false};
    },
    initCustomers: function() {
        var customers = [];
        for(var i = 0; i < cur_user.customer.length; i++) {
            var customer = {
                custId: cur_user.customer[i].id,
                text: cur_user.customer[i].company,
                value: (
                    <MenuItem primaryText={cur_user.customer[i].company} innerDivStyle={{display: 'flex', marginBottom: '9px'}} >
                        <span className="cust_icons" >
                            <IconButton
                                className={cur_user.customer[i].id.toString()}
                                iconClassName="fa fa-pencil"
                                tooltip="Edit Customer"
                                href="#"
                                onClick={this.showCustEntry}
                                />
                            <IconButton
                                className={cur_user.customer[i].id.toString()}
                                iconClassName="fa fa-trash-o"
                                tooltip="Delete Customer"
                                href="#"
                                onClick={this.showDelCustDialog}
                                />
                        </span>
                    </MenuItem>
                )
            };
            customers.push(customer);
        }
        return customers;
    },
    updateCustomers: function() {
        this.setState({customers: this.initCustomers()});
    },
    handleClose: function() {
        this.setState({snackbarOpen: false});
    },
    deleteCustomer: function(event) {
        this.refs.del_cust_dialog.handleClose();
        var body = new FormData();
        body.append('cust_id', event.currentTarget.getAttribute('class'));
        fetch(
            'delete_customer',
            {method: 'POST', headers: {'X-CSRF-Token': _token, 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json'}, credentials: 'same-origin', body: body}
        ).then(function(response) {
                if(response.ok) //Remove deleted customer from drop-down and show snackbar
                    response.json().then(function(json) {
                        this.setState({snackbarOpen: true, message: json.message});
                        if(cur_user.customer.length)
                            for(var i = 0; i < cur_user.customer.length; i++) {
                                if(cur_user.customer[i].id == json.cust_id)
                                    cur_user.customer.splice(i, 1);
                            }
                        this.updateCustomers();
                    }.bind(this));
            }.bind(this));
    },
    showDelCustDialog: function(event) {
        this.refs.del_cust_dialog.handleOpen(event.currentTarget.getAttribute('class'));
    },
    showCustEntry: function(event) {
        this.refs.cust_entry.handleOpen(event.currentTarget.getAttribute('class'), true);
    },
    doesCustExist: function(chosen) {
        var exists = false;
        var input = '';
        //Autocomplete selection calls this function with cust object when seleting from drop-down,
        // need to return b/c customer obviously exists since customer was selected
        if(chosen.custId) return;
        //select, press enter or onBlur of cust field checks if cust exists
        if (chosen instanceof FocusEvent) {
            if (chosen.target.value.length == 0 || chosen.relatedTarget.nodeName == 'SPAN')
                return;
            input = chosen.target.value;
        } else
            input = chosen;

        // check if customer is in database and get billables, else open cust_entry
        for(var i = 0; i < this.state.customers.length; i++) {
            if(this.state.customers[i].text == input) {
                exists = true;
                break;
            }
        }
        if(!exists) this.refs.cust_entry.handleOpen(input);
    },
    // AutoComplete not emitting onBlur, see git,therefore setting listener after render, old school
    // https://github.com/callemall/material-ui/issues/2294 says onBlur is fixed, but it's not
    componentDidMount: function() {
        document.getElementById('customer').addEventListener('blur', this.doesCustExist);
    },
    render: function() {
        return (
            <section>
                <CustomerEntry ref="cust_entry" updateCustomersDropDown={this.updateCustomers} />
                <DeleteCustomerDialog ref="del_cust_dialog" showDelCustDialog={this.showDelCustDialog} deleteCustomer={this.deleteCustomer} />
                <form id="trx_form" className="trx_form" ref="trx_form" style={{flexWrap: 'wrap'}}>
                    <DatePicker
                        autoOk={true}
                        floatingLabelText="Date"
                        floatingLabelFixed={true}
                        floatingLabelStyle={{color: '#03A9F4'}}
                        className="trx_entry_field"
                        style={{width:'150px'}}
                        />
                    <Autocomplete
                        hintText="Customer"
                        dataSource= {this.state.customers}
                        floatingLabelText="Customer"
                        floatingLabelFixed={true}
                        floatingLabelStyle={{color: '#03A9F4'}}
                        className="trx_entry_field"
                        id="customer"
                        filter={function filter(searchText, key) { return key.toLowerCase().includes(searchText.toLowerCase()); }}
                        autoComplete="off"
                        listStyle={{width: 'auto', minWidth: '400px'}}
                        onNewRequest={this.doesCustExist}
                        />
                    <TextField
                        floatingLabelText="Qty"
                        floatingLabelFixed={true}
                        floatingLabelStyle={{color: '#03A9F4'}}
                        type="number"
                        id="qty"
                        min="0"
                        style={{width:'50px'}}
                        className="trx_entry_field"
                        />
                    <Autocomplete
                        hintText="Billable"
                        dataSource={['1', '2']}
                        floatingLabelText="Billable"
                        floatingLabelFixed={true}
                        floatingLabelStyle={{color: '#03A9F4'}}
                        className="trx_entry_field"
                        filter={function filter(searchText, key) { return key.toLowerCase().includes(searchText.toLowerCase()); }}
                        onNewRequest={
                            function(chosen, index) {
                                console.log(chosen);
                                console.log(index);
                            }
                        }
                        />
                    <TextField
                        floatingLabelText="Amount"
                        floatingLabelFixed={true}
                        floatingLabelStyle={{color: '#03A9F4'}}
                        underlineDisabledStyle={{color: '#03A9F4'}}
                        underlineStyle={{color: '#03A9F4'}}
                        id="amt"
                        style={{width:'100px'}}
                        value={"$ 0.00"}
                        disabled={true}
                        className="trx_entry_field"
                        />
                    <FlatButton label="Save Transaction" style={{color: 'green'}} />
                    <FlatButton label="Clear" onClick={function() {document.forms['trx_form'].reset()}} style={{color: 'red'}} />
                    <Snackbar open={this.state.snackbarOpen} message={this.state.message} onRequestClose={this.handleClose} autoHideDuration={3000} />
                </form>
            </section>
        );
    }
});

var Trx = React.createClass({
    render: function() {
        return (
            <Card className="cards" initiallyExpanded={true}>
                <CardHeader
                    title="Billables"
                    subtitle="Track Time & Expenses"
                    actAsExpander={true}
                    showExpandableButton={true}
                    avatar="https://www.dropbox.com/s/4hw9njfnlkgttmf/clock-1.png?dl=1"
                    />
                <CardText expandable={true} style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flexWrap: 'nowrap'
                    }}>
                    <TrxEntry />
                </CardText>
            </Card>
        );
    }
});

export {Trx as default};
