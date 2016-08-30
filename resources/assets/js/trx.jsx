/**
 * Created by John on 8/22/2016.
 * React componenets for Trx tracking module
 */

window.CustomerEntry = React.createClass({
    getInitialState: function() {
        return {
            open: false,
            snackbarOpen: false,
            companyErr: '',
            firstErr: '',
            lastErr: '',
            emailErr: '',
            message: ''
        };
    },
    removeErrors: function() {
        this.setState({
            companyErr: '',
            firstErr: '',
            lastErr: '',
            emailErr: '',
        })
    },
    handleOpen: function(chosen) {
        this.setState({open: true, company: chosen});
    },
    handleClose: function() {
        this.removeErrors();
        this.setState({open: false, snackbarOpen: false});
    },
    handleSave: function(event) {
        this.removeErrors();
        event.preventDefault;
        var cust = new FormData;
        cust.append('company', document.forms['cust_entry'].elements[0].value);
        cust.append('first', document.forms['cust_entry'].elements[1].value);
        cust.append('last', document.forms['cust_entry'].elements[2].value);
        cust.append('email', document.forms['cust_entry'].elements[3].value);
        fetch('save_customer', {
            method: 'post',
            body: cust,
            headers: {'X-CSRF-Token': _token, 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json'},
            credentials: 'same-origin'
        }).then(function(response) {
            if(response.ok) {
                response.json().then(
                    function(json) {
                        cur_user.customer.push({
                            id: json.cust_id,
                            company: cust.get('company'),
                            first: cust.get('first'),
                            last: cust.get('last')
                        });
                        this.setState({message: json.message, snackbarOpen: true});
                        this.props.updateCustomersDropDown();
                    }.bind(this)
                );
            } else {
                response.json().then(function(errors) {
                    var keys = Object.keys(errors);
                    for(var i = 0; i < keys.length; i++) {
                        switch(keys[i]) {
                            case 'company':
                                this.setState({companyErr: errors.company});
                                break;
                            case 'first':
                                this.setState({firstErr: errors.first});
                                break;
                            case 'last':
                                this.setState({lastErr: errors.last});
                                break;
                            case 'email':
                                this.setState({emailErr: errors.email});
                                break;
                        }
                    }
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
        return (
            <Dialog
                title="So this is a new customer. Nice."
                actions={actions}
                modal={true}
                open={this.state.open}
                >
                <form id="cust_entry">
                    <TextField
                        floatingLabelText="Company"
                        floatingLabelFixed={true}
                        errorText={this.state.companyErr}
                        defaultValue={this.state.company}
                        />
                    <TextField
                        floatingLabelText="First Name"
                        floatingLabelFixed={true}
                        errorText={this.state.firstErr}
                        />
                    <TextField
                        floatingLabelText="Last Name"
                        floatingLabelFixed={true}
                        errorText={this.state.lastErr}
                        />
                    <TextField
                        floatingLabelText="Email"
                        floatingLabelFixed={true}
                        type="email"
                        errorText={this.state.emailErr}
                        />
                </form>
                <Snackbar open={this.state.snackbarOpen} message={this.state.message} onRequestClose={this.handleClose} autoHideDuration={3000} />
            </Dialog>
        );
    }
});

window.DeleteCustomerDialog = React.createClass({
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
            <FlatButton label="Continue" primary={true} id={this.state.id} onClick={this.props.deleteCustomer} />
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

window.TrxEntry = React.createClass({
    getInitialState: function() {
        return {customers: this.initCustomers(), snackbarOpen: false, message: '', showDelCustDialog: false}
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
                            <IconButton linkButton={true} className="edit_cust" id={cur_user.customer[i].id} iconClassName="fa fa-pencil" tooltip="Edit Customer" href="#" />
                            <IconButton linkButton={true} className="del_cust" id={cur_user.customer[i].id} iconClassName="fa fa-trash-o" tooltip="Delete Customer" href="#" onClick={this.showDelCustDialog} />
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
        var route = 'delete_customer';
        var body = new FormData();
        body.append('cust_id', event.currentTarget.id);
        fetch(
            route,
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
        this.refs.del_cust_dialog.handleOpen(event.currentTarget.id);
    },
    render: function() {
        return (
            <div>
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
                        filter={function filter(searchText, key) { return key.toLowerCase().includes(searchText.toLowerCase()); }}
                        autoComplete="off"
                        listStyle={{width: 'auto', minWidth: '400px'}}
                        onNewRequest={
                            function(chosen, index) {
                                // check if customer is in database and get billables, else open cust_entry
                                var exists = false;
                                for(var i = 0; i < this.state.customers.length; i++) {
                                    if(this.state.customers[i].text == chosen) {
                                        exists = true;
                                        break;
                                    }
                                }
                                if(!exists) this.refs.cust_entry.handleOpen(chosen);
                            }.bind(this)
                        }
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
            </div>
        );
    }
});

window.Trx = React.createClass({
    render: function() {
        return (
            <Card className="cards" initiallyExpanded={true}>
                <CardHeader
                    title="Billables"
                    subtitle="Track Time & Expenses"
                    actAsExpander={true}
                    showExpandableButton={true}
                    avatar="http://googledrive.com/host/0B1f8PNGaySaRS1JKektwMjBjRW8"
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