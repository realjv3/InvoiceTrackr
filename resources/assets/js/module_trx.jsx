/**
 * Created by John on 8/22/2016.
 * React components for Trx tracking module
 */

import React from 'react';

import 'whatwg-fetch';
import ES6Promise from 'es6-promise';
ES6Promise.polyfill();

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import Card from 'material-ui/Card/Card.js';
import CardActions from 'material-ui/Card/CardActions.js';
import CardHeader from 'material-ui/Card/CardHeader.js';
import CardText from 'material-ui/Card/CardText.js';

import States from 'states.jsx';

class CustomerEntry extends React.Component
{
    constructor(props) {
        super(props);
        this.updateCustomersDropDown = React.PropTypes.func.isRequired;
        this.formfields = {
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
        }
        this.state = {
            open: false,
            snackbarOpen: false,
            fields: JSON.parse(JSON.stringify(this.formfields)),
            errors: JSON.parse(JSON.stringify(this.formfields)),
            message: '',
            edit: false
        };
    }

    removeErrors = () => {
        this.setState({errors: JSON.parse(JSON.stringify(this.formfields))});
    };

    handleOpen = (chosen, edit = false) => {
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
        }).then((response) => {
            if(response.ok) {   //if save went ok, show Snackbar, update global cur_user & update the cust. drop-down
                response.json().then(
                    (json) => {
                        cur_user = JSON.parse(json.cur_user);
                        for(var i = 0; i < cur_user.customer.length; i++) {
                            if(cur_user.customer[i].company == this.state.fields.company) {
                                cur_user.customer[i].selected = true;
                                break;
                            }
                        }
                        this.setState({message: json.message, snackbarOpen: true});
                        this.props.updateCustomersDropDown();
                    }
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
        });
    };

    render() {
        const actions = [
            <FlatButton
                label="Save Customer"
                onTouchTap={this.handleSave}
                style={{color: 'green'}}
            />,
            <FlatButton
                label="Cancel"
                onTouchTap={this.handleClose}
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
                            errorText={this.state.errors.company}
                            id="company"
                            className="profile_field"
                            style={style}
                            defaultValue={this.state.fields.company}
                        />
                        <TextField
                            floatingLabelText="First Name"
                            errorText={this.state.errors.first}
                            id="first"
                            className="profile_field"
                            style={style}
                            defaultValue={this.state.fields.first}
                        />
                        <TextField
                            floatingLabelText="Last Name"
                            errorText={this.state.errors.last}
                            id="last"
                            className="profile_field"
                            style={style}
                            defaultValue={this.state.fields.last}
                        />
                        <TextField
                            floatingLabelText="Email"
                            type="email"
                            errorText={this.state.errors.email}
                            id="email"
                            className="profile_field"
                            style={style}
                            defaultValue={this.state.fields.email}
                        />
                    </fieldset>
                    <fieldset>
                        <TextField
                            style={{ width: '300px'}}
                            floatingLabelText="Address1"
                            hintText="Address1"
                            id="addr1"
                            style={style}
                            defaultValue={this.state.fields.addr1}
                            errorText={this.state.errors.addr1}
                            /><br />
                        <TextField
                            style={{ width: '300px'}}
                            floatingLabelText="Address2"
                            hintText="Address2"
                            id="addr2"
                            style={style}
                            defaultValue={this.state.fields.addr2}
                            errorText={this.state.errors.addr2}
                            /><br />
                        <span style={{paddingTop: '30px', paddingBottom: '30px'}}>
                            <TextField
                                floatingLabelText="City"
                                id="city"
                                className="profile_field"
                                style={style}
                                defaultValue={this.state.fields.city}
                                errorText={this.state.errors.city}
                            />
                            <States
                                defaultValue={this.state.fields.state}
                                error={this.state.errors.state}
                                className="profile_field"
                                style={{top: '17px', width: '50px', paddingRight: '10px'}}
                            />
                            <TextField
                                floatingLabelText="Zip"
                                className="profile_field"
                                id="zip"
                                style={style}
                                defaultValue={this.state.fields.zip}
                                errorText={this.state.errors.zip}
                                />
                        </span><br />
                        <TextField
                            floatingLabelText="Cell"
                            id="cell"
                            style={style}
                            defaultValue={this.state.fields.cell}
                            errorText={this.state.errors.cell}
                            />
                        <TextField
                            floatingLabelText="Office"
                            id="office"
                            style={style}
                            defaultValue={this.state.fields.office}
                            errorText={this.state.errors.office}
                            />
                    </fieldset>
                    <Snackbar open={this.state.snackbarOpen} message={this.state.message} onRequestClose={this.handleClose} autoHideDuration={3000} />
                </form>
            </Dialog>
        );
    }
}

class BillableEntry extends React.Component
{
    constructor(props) {
        super(props);
        this.formfields = {id: '', custid: '', customer: '', descr: '', type: '', unit: '', price: ''};
        this.updateBillablesDropDown = React.PropTypes.func.isRequired;
        this.state = {
            open: false,
            snackbarOpen: false,
            fields: JSON.parse(JSON.stringify(this.formfields)),
            errors: JSON.parse(JSON.stringify(this.formfields)),
            message: '',
            edit: false
        };
    }

    removeErrors = () => {
        this.setState({errors: JSON.parse(JSON.stringify(this.formfields))})
    }

    handleOpen = (chosen, edit = false) => {
        //find out which customer is selected
        for(var i = 0; i < cur_user.customer.length; i++)
            if(cur_user.customer[i].selected) break;
        var customer = cur_user.customer[i];

        if (edit) { //if editing, chosen is an id, need to pre-fill form with chosen customer's data
            for(i = 0; i < customer.billable.length; i++)
                if(customer.billable[i].id == chosen) {
                    let billbl = customer.billable[i], tmp = {};
                    tmp.customer= customer.company;
                    tmp.id = billbl.id;
                    tmp.custid = customer.id;
                    tmp.descr = billbl.descr;
                    tmp.type = billbl.type;
                    tmp.unit = billbl.unit;
                    tmp.price = billbl.price;
                    this.setState({open: true, fields: tmp, edit: edit, snackbarOpen: false});
                    break;
                }

        } else {//else if creating, chosen is a string, customer & descr get default value
            let tmp = JSON.parse(JSON.stringify(this.state.fields));
            tmp.custid= customer.id;
            tmp.customer= customer.company;
            tmp.descr = chosen;
            this.setState({open: true, fields: tmp, edit: edit, snackbarOpen: false});
        }
    }

    handleSave = () => {
        this.removeErrors();
        var billable = new FormData();
        var fields = Object.keys(this.formfields);
        for(var i = 3; i < fields.length; i++)  //starting at 1 b/c don't want to include 'customer' field in FormData
            billable.set(fields[i], document.getElementById(fields[i]).value);
        billable.set('id', this.state.fields.id);
        billable.set('custid', this.state.fields.custid);
        fetch('save_billable?edit=' + this.state.edit , {
            method: 'post',
            body: billable,
            headers: {'X-CSRF-Token': _token, 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json'},
            credentials: 'same-origin'
        }).then((response) => {
            if(response.ok) {   //if save went ok, show Snackbar, update global cur_user & update the cust. drop-down
                response.json().then(
                    (json) => {
                        for(var i = 0; i < cur_user.customer.length; i++) {
                            if(cur_user.customer[i].selected) break;
                        }
                        cur_user = JSON.parse(json.cur_user);
                        cur_user.customer[i].selected = true;
                        this.setState({message: json.message, snackbarOpen: true});
                        this.props.updateBillablesDropDown();
                    }
                );
            } else {    //flash errors into view
                response.json().then((errors) => {
                    var keys = Object.keys(errors);
                    var fields = {};
                    for(var i = 0; i < keys.length; i++)
                        fields[keys[i]] = errors[keys[i]];
                    this.setState({errors: fields});
                });
            }
        });
    }

    handleClose = () => {
        this.removeErrors();
        this.setState({
            open: false,
            snackbarOpen: false,
            fields: JSON.parse(JSON.stringify(this.formfields))
        });
    }

    render() {
        let title = (this.state.edit) ? "Edit this customer's billable item." : "New billable item. Love it.";
        var style = {width: '115px', marginRight: '30px', display: 'inline-block'};
        const actions = [
            <FlatButton
                label="Save Billable"
                onTouchTap={this.handleSave}
                style={{color: 'green'}}
            />,
            <FlatButton
                label="Cancel"
                onTouchTap={this.handleClose}
                style={{color: 'red'}}
            />
        ];
        return (
            <Dialog
                title={title}
                actions={actions}
                modal={true}
                open={this.state.open}
                bodyStyle={{overflow: 'auto'}}
            >
                <form id="billable_entry">
                    <fieldset>
                        <TextField
                            floatingLabelText="Customer"
                            errorText={this.state.errors.customer}
                            id="customer"
                            style={{marginRight: '30px', display: 'inline-block'}}
                            defaultValue={this.state.fields.customer}
                            disabled={true}
                        />
                        <TextField
                            floatingLabelText="Description"
                            hintText="What are you selling them?"
                            floatingLabelFixed={true}
                            type="text"
                            errorText={this.state.errors.descr}
                            id="descr"
                            defaultValue={this.state.fields.descr}
                            errorText={this.state.errors.descr}
                            style={{display: 'inline-block'}}
                        />
                        <div style={{display: 'flex'}}>
                            <AutoComplete
                                dataSource= {[{text: 'Service', value: 'service'}, {text: 'Product', value: 'product'}]}
                                floatingLabelText="Type"
                                hintText="product or service"
                                id="type"
                                searchText={this.state.fields.type}
                                filter={(searchText, key) => { return (key.toLowerCase().indexOf(searchText.toLowerCase()) >= 0); }}
                                textFieldStyle={style}
                                listStyle={style}
                                style={style}
                                openOnFocus={true}
                                errorText={this.state.errors.type}
                            />
                            <TextField
                                floatingLabelText="Unit"
                                hintText="hourly, pieces, etc."
                                type="text"
                                errorText={this.state.errors.unit}
                                id="unit"
                                defaultValue={this.state.fields.unit}
                                style={style}
                            />
                            <TextField
                                floatingLabelText="Price"
                                hintText="Price per unit"
                                type="number"
                                min="0"
                                step="any"
                                errorText={this.state.errors.price}
                                id="price"
                                defaultValue={this.state.fields.price}
                                style={style}

                            />
                        </div>
                    </fieldset>
                    <Snackbar open={this.state.snackbarOpen} message={this.state.message} onRequestClose={this.handleClose} autoHideDuration={3000} />
                </form>
            </Dialog>
        );
    }
}

class DeleteCustomerDialog extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {open: false};
    }
    handleOpen = (id) => {
        this.setState({open: true, id: id});
    }
    handleClose = () => {
        this.setState({open: false});
    }
    render() {
        const actions= [
            <FlatButton label="Cancel" primary={true} onTouchTap={this.handleClose} style={{color: 'red'}}/>,
            <FlatButton label="Continue" primary={true} className={this.state.id} onClick={this.props.deleteCustomer} style={{color: 'green'}}/>
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
}

class DeleteBillablesDialog extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {open: false};
    }
    handleOpen = (id) => {
        this.setState({open: true, id: id});
    }
    handleClose = () => {
        this.setState({open: false});
    }
    render() {
        const actions= [
            <FlatButton label="Cancel" primary={true} onTouchTap={this.handleClose} style={{color: 'red'}}/>,
            <FlatButton label="Continue" primary={true} className={this.state.id} onClick={this.props.deleteBillable} style={{color: 'green'}}/>
        ];

        return (
            <Dialog
                title="Are you sure you want to do this?"
                actions={actions}
                modal={true}
                open={this.state.open}
                onRequest={this.handleClose}
                >
                Do you really want to permanently delete this billable item and all of the related transactions?
            </Dialog>
        );
    }
}

class TrxEntry extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            customers: this.initCustomers(),
            billables: [],
            snackbarOpen: false, message: '',
            showDelCustDialog: false,
            disableBillables: true
        };
    }
    initCustomers = () => {
        var customers = [];
        for(var i = 0; i < cur_user.customer.length; i++) {
            var customer = {
                text: cur_user.customer[i].company,
                value: (
                    <MenuItem primaryText={cur_user.customer[i].company} innerDivStyle={{display: 'flex', marginBottom: '9px'}} >
                        <span className="cust_icons" >
                            <IconButton
                                className={cur_user.customer[i].id.toString()}
                                iconClassName="fa fa-pencil"
                                tooltip="Edit Customer"
                                href="#"
                                onClick={this.editCust}
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
    }
    updateCustomers = () => {
        this.setState({customers: this.initCustomers()});
    }
    updateBillables = () => {
        var billables = [];
        for(var i = 0; i < cur_user.customer.length; i++) {
            if(cur_user.customer[i].selected) {
                if(!cur_user.customer[i].billable)
                    return;
                billables = cur_user.customer[i].billable.map((billable) => {
                    return {
                        text: billable.descr,
                        value: (
                            <MenuItem primaryText={billable.descr} innerDivStyle={{display: 'flex', marginBottom: '9px'}} >
                                <span className="cust_icons" >
                                    <IconButton
                                        className={billable.id.toString()}
                                        iconClassName="fa fa-pencil"
                                        tooltip="Edit Billable"
                                        href="#"
                                        onClick={this.editBillable}
                                    />
                                    <IconButton
                                        className={billable.id.toString()}
                                        iconClassName="fa fa-trash-o"
                                        tooltip="Delete Billable"
                                        href="#"
                                        onClick={this.showDelBillableDialog}
                                    />
                                </span>
                            </MenuItem>
                        )
                    };
                });
            break;
            }
        }
        this.setState({billables: billables});
    }
    handleClose = () => {
        this.setState({snackbarOpen: false});
    }
    deleteCustomer = (event) => {
        this.refs.del_cust_dialog.handleClose();
        var body = new FormData();
        body.append('cust_id', event.currentTarget.getAttribute('class'));
        fetch(
            'delete_customer',
            {method: 'POST', headers: {'X-CSRF-Token': _token, 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json'}, credentials: 'same-origin', body: body}
        ).then((response) => {
                if(response.ok) //Remove deleted customer from drop-down and show snackbar
                    response.json().then((json) => {
                        cur_user = JSON.parse(json.cur_user);
                        this.setState({snackbarOpen: true, message: json.message});
                        this.updateCustomers();
                    });
            });
    }
    deleteBillable = (event) => {
        this.refs.del_billables_dialog.handleClose();
        var body = new FormData();
        body.append('id', parseInt(event.currentTarget.getAttribute('class')));
        fetch(
            'delete_billable',
            {method: 'POST', headers: {'X-CSRF-Token': _token, 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json'}, credentials: 'same-origin', body: body}
        ).then((response) => {
            if(response.ok) //Remove deleted customer from drop-down and show snackbar
                response.json().then((json) => {
                    for(var i = 0; i < cur_user.customer.length; i++) {
                        if(cur_user.customer[i].selected) break;
                    }
                    cur_user = JSON.parse(json.cur_user);
                    cur_user.customer[i].selected = true;
                    this.setState({snackbarOpen: true, message: json.message});
                    this.updateBillables();
                });
        });
    }
    showDelCustDialog = (event) => {
        this.refs.del_cust_dialog.handleOpen(event.currentTarget.getAttribute('class'));
    }
    showDelBillableDialog = (event) => {
        this.refs.del_billables_dialog.handleOpen(event.currentTarget.getAttribute('class'));
    }
    editCust = (event) => {
        this.refs.cust_entry.handleOpen(event.currentTarget.getAttribute('class'), true);
    }
    editBillable = (event) => {
        this.refs.billables_entry.handleOpen(event.currentTarget.getAttribute('class'), true);
    }
    /**
     * Auto-complete selection/onBlur calls this function with cust object when selecting from drop-down
     * @param object/string chosen - can be a FocusEvent or MenuItem object, or a string, on blur or select
     * @return boolean true if customer exists
     * @return boolean false if customer doesn't exist & opens CustomerEntry dialog
     */
    doesCustExist = (chosen) => {
        let exists = false;
        let input = '';
        this.setState({disableBillables: true});

        // Get input customer
        if (typeof chosen == 'string') { // pressing enter in customer
            if (chosen == '') return false;
            input = chosen;
        } else if(chosen.value) //selecting from customer drop-down - onNewRequest makes 2nd call
            input = chosen.text;
        else if (chosen instanceof FocusEvent) { // onBlur of customer/billables field (during select & tab & or click out)
            if (chosen.target.value.length == 0 || !chosen.relatedTarget) return false;
            if (chosen.relatedTarget.nodeName == 'SPAN') //selecting from customer drop-down - onBLur makes 1st call
                return true;
            input = chosen.target.value;
        }

        // check if customer exists and get their billables for drop-down store, else open CustomerEntry/BillableEntry dialog
        for (var i = 0; i < cur_user.customer.length; i++) {
            cur_user.customer[i].selected = false;
            if (cur_user.customer[i].company.toLowerCase().trim() == input.toLowerCase().trim()) {
                cur_user.customer[i].selected = true;
                exists = true;
                break;
            }
        }
        if (exists) {
            this.setState({disableBillables: false});
            this.updateBillables();
            return true;
        } else {
            this.refs.cust_entry.handleOpen(input);
            return false;
        }
    }
    doesBillableExist = (chosen) => {
        let exists = false;
        let input = '';

        // Get input billalbe
        if (typeof chosen == 'string') { // pressing enter in billables
            if (chosen == '') return false;
            input = chosen;
        } else if(chosen.value) //selecting from billables drop-down - onNewRequest makes 2nd call
            input = chosen.text;
        else if (chosen instanceof FocusEvent) { // onBlur of billables field (during select & tab & or click out)
            if (chosen.target.value.length == 0 || !chosen.relatedTarget) return false;
            if (chosen.relatedTarget.nodeName == 'SPAN') //selecting from billables drop-down - onBLur makes 1st call
                return true;
            input = chosen.target.value;
        }

        // check if customer exists and get their billables for drop-down store, else open CustomerEntry/BillableEntry dialog
        for (var i = 0; i < cur_user.customer.length; i++) {
            if (cur_user.customer[i].selected) {
                let cust = cur_user.customer[i];
                if(!cust.billable)
                    exists = false;
                else
                    for (var j = 0; j < cust.billable.length; j++)
                        if (cust.billable[j].descr.toLowerCase().trim() == input.toLowerCase().trim())
                            exists = true;
            }
        }
        if (exists) {
            return true;
        } else {
            this.refs.billables_entry.handleOpen(input);
            return false;
        }
    }
    // AutoComplete not emitting onBlur, see git,therefore setting listener after render, old school
    // https://github.com/callemall/material-ui/issues/2294 says onBlur is fixed, but it's not
    componentDidMount = () => {
        document.getElementById('customer').addEventListener('blur', this.doesCustExist);
        document.getElementById('billable').addEventListener('blur', this.doesBillableExist);
    }
    render() {
        return (
            <section>
                <CustomerEntry ref="cust_entry" updateCustomersDropDown={this.updateCustomers} />
                <BillableEntry ref="billables_entry" updateBillablesDropDown={this.updateBillables} />
                <DeleteCustomerDialog ref="del_cust_dialog" showDelCustDialog={this.showDelCustDialog} deleteCustomer={this.deleteCustomer} />
                <DeleteBillablesDialog ref="del_billables_dialog" showDelCustDialog={this.showDelBillableDialog} deleteBillable={this.deleteBillable} />
                <form id="trx_form" className="trx_form" ref="trx_form" >
                    <DatePicker
                        autoOk={true}
                        floatingLabelText="Date"
                        className="trx_entry_field"
                        style={{marginRight: '25px'}}
                        textFieldStyle={{width:'90px'}}
                    />
                    <AutoComplete
                        dataSource= {this.state.customers}
                        floatingLabelText="Customer"
                        className="trx_entry_field"
                        id="customer"
                        style={{marginRight: '25px'}}
                        filter={(searchText, key) => { return (key.toLowerCase().indexOf(searchText.toLowerCase()) >= 0); }}
                        listStyle={{width: 'auto', minWidth: '400px'}}
                        onNewRequest={this.doesCustExist}
                    />
                    <TextField
                        floatingLabelText="Qty"
                        className="trx_entry_field"
                        type="number"
                        id="qty"
                        min="0"
                        style={{width:'50px', marginRight: '25px'}}
                    />
                    <AutoComplete
                        dataSource={this.state.billables}
                        floatingLabelText="Billable"
                        id="billable"
                        style={{marginRight: '25px'}}
                        filter={(searchText, key) => { return (key.toLowerCase().indexOf(searchText.toLowerCase()) >= 0); }}
                        onNewRequest={this.doesBillableExist}
                        disabled={this.state.disableBillables}
                    />
                    <TextField
                        floatingLabelText="Amount"
                        underlineDisabledStyle={{color: '#03A9F4'}}
                        underlineStyle={{color: '#03A9F4'}}
                        id="amt"
                        style={{marginRight: '25px', width:'100px'}}
                        value={"$ 0.00"}
                        disabled={true}
                    />
                    <FlatButton label="Save Transaction" style={{color: 'green'}} />
                    <FlatButton label="Clear" onClick={() => {document.forms['trx_form'].reset()}} style={{color: 'red'}} />
                    <Snackbar open={this.state.snackbarOpen} message={this.state.message} onRequestClose={this.handleClose} autoHideDuration={3000} />
                </form>
            </section>
        );
    }
}

class Trx extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card className="cards" initiallyExpanded={true}>
                <CardHeader
                    title="Billables"
                    subtitle="Track Time & Expenses"
                    actAsExpander={true}
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
}

export {Trx as default};
