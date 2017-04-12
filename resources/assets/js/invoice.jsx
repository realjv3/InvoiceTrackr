/**
 * Invoice
 */
import React from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

import {getSelectedCustomer} from  'util.jsx';

class Invoice extends React.Component {
    constructor(props) {
        super(props);
    }
    openInv = () => {
        let trx_keys = this.props.trx.map(
            (e) => { return e.key; }
            ),
            duedtInput = document.getElementById('duedt'),
            duedtOutput = document.createElement('h3'),
            invnoInput = document.getElementById('invno'),
            invnoOutput = document.createElement('h3');
        duedtOutput.id = "duedt";
        invnoOutput.id = "invno";
        duedtInput.parentNode.replaceChild(duedtOutput, duedtInput);
        invnoInput.parentNode.replaceChild(invnoOutput, invnoInput);
        duedtOutput.innerText = duedtInput.value;
        invnoOutput.innerText = invnoInput.value;
        let inv = window.open('/create_inv?duedt=' + duedtInput.value + '&invno=' + invnoInput.value + '&trx_keys=' + trx_keys + '&total=' + this.props.total + '&content=' + document.getElementById('invoice').outerHTML);
            inv.addEventListener('load', () => {
                this.props.updateTrx();
                this.props.updateInvoices();
                document.getElementById('duedt').parentNode.replaceChild(duedtInput, document.getElementById('duedt'));
                document.getElementById('invno').parentNode.replaceChild(invnoInput, document.getElementById('invno'));
                this.setState({trx: [
                    <tr key={'trx_th'}>
                        <th style={{width: '200px', textAlign: 'center', margin: '7px'}}>Trx Date</th>
                        <th>Billable</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                    </tr>
                ], total: ''});
            }, true);
    }
    render() {
        let cust = getSelectedCustomer(),
            custinfo = '';
        if(cust) {
            custinfo = (
                <div id="customer">
                    <div>{cust.company}</div>
                    <div>{cust.cust_profile.addr1}</div>
                    <div>{cust.cust_profile.addr2}</div>
                    <div>{cust.cust_profile.city + ', ' + cust.cust_profile.state + ' ' + cust.cust_profile.zip}</div>
                    <div><a href={'mailto:'+cust.email} style={{textDecoration: 'underline'}}>{cust.email}</a></div>
                </div>
            );
        } else
            custinfo = 'Select a customer.';
        return (
            <Card>
                <CardText id="invoice">
                    <CardHeader>
                        <input type="text" id="invno" name="invno" ref="invno" placeholder="Invoice number" style={{width: '150px', marginBottom: '12px', display: 'block'}} />
                        <h3>{'Invoice Date:  ' + new Date().toJSON().slice(0,10)}</h3>
                        <h3>
                            <label style={{display: 'inline'}}>Due Date</label>
                            <input type="date" ref="duedt" id="duedt" name="duedt" />
                        </h3>
                        <h1>{(cur_user.profile.company) ? cur_user.profile.company : cur_user.profile.first + ' ' + cur_user.profile.last}</h1>
                        <div id="company">
                            <div>{(cur_user.profile.company) ? cur_user.profile.company : cur_user.profile.first + ' ' + cur_user.profile.last}</div>
                            <div>{cur_user.profile.addr1}</div>
                            <div>{cur_user.profile.addr2}</div>
                            <div>{cur_user.profile.city + ', ' + cur_user.profile.state + ' ' + cur_user.profile.zip}</div>
                            <div>{cur_user.profile.cell}</div>
                            <div><a href={'mailto:'+cur_user.email} style={{textDecoration: 'underline'}}>{cur_user.email}</a></div>
                        </div>
                        <h2>Bill to:</h2>{custinfo}
                    </CardHeader>
                    <main>
                        <table id="inv_trx" style={{marginLeft: 'auto', marginRight: 'auto'}}>
                            <tbody>
                                {this.props.trx}
                            </tbody>
                        </table>
                        <span>Total: $</span>{this.props.total}
                        <div style={{margin: '15px'}}>Thank you for your business!</div>
                    </main>
                </CardText>
                <CardActions>
                    <FlatButton
                        label="Create Invoice"
                        target="_blank"
                        onClick={this.openInv}
                    />
                </CardActions>
            </Card>
        );
    }
}
Invoice.PropTypes = {
    trx: React.PropTypes.array,
    total: React.PropTypes.number,
    updateTrx: React.PropTypes.func,
    updateInvoices: React.PropTypes.func
}
export default Invoice;