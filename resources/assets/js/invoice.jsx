/**
 * Invoice
 */
import React from 'react';
import Proptypes from 'prop-types';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import {getSelectedCustomer} from  'util.jsx';

class Invoice extends React.Component {
    constructor(props) {
        super(props);
    }
    openInv = () => {
        let
            trx_keys = this.props.trx.map((e) => { return e.key; }),
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
        let inv = window.open('/create_inv?duedt=' + duedtInput.value + '&invno=' + invnoInput.value + '&trx_keys=' + trx_keys + '&total=' + this.props.total);
        inv.addEventListener('load', () => {
            this.props.updateTrx();
            this.props.updateInvoices();
            document.getElementById('duedt').parentNode.replaceChild(duedtInput, document.getElementById('duedt'));
            document.getElementById('invno').parentNode.replaceChild(invnoInput, document.getElementById('invno'));
            this.props.clearSelTrx();
        }, true);
    }
    render() {
        let
            cust = getSelectedCustomer(),
            custinfo = '';
        if(cust) {
            custinfo = (
                <div id="customer">
                    <div>{cust.company ? cust.company : ''}</div>
                    <div>{cust.cust_profile.addr1 ? cust.cust_profile.addr1 : ''}</div>
                    <div>{cust.cust_profile.addr2 ? cust.cust_profile.addr2 : ''}</div>
                    <div>
                        {
                            (cust.cust_profile.city ? cust.cust_profile.city : '') +
                            (cust.cust_profile.city ? ', ' : '') +
                            (cust.cust_profile.state ? cust.cust_profile.state : '') +
                            ' ' + (cust.cust_profile.zip ? cust.cust_profile.zip : '')
                        }
                    </div>
                    <div><a href={'mailto:'+cust.email} style={{textDecoration: 'underline'}}>{cust.email}</a></div>
                </div>
            );
        } else
            custinfo = 'Select a customer.';

        let name = '';
        if (cur_user.profile.company) {
        	name = cur_user.profile.company;
		} else if (cur_user.profile.first && cur_user.profile.last) {
			name = cur_user.profile.first + ' ' + cur_user.profile.last;
		} else if (cur_user.profile.first && !cur_user.profile.last) {
        	name = cur_user.profile.first;
		} else if (!cur_user.profile.first && cur_user.profile.last) {
        	name = cur_user.profile.last;
		}

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
                        <h1>{name}</h1>
                        <div id="company">
                            <div>{name}</div>
                            <div>{cur_user.profile.addr1}</div>
                            <div>{cur_user.profile.addr2}</div>
                            <div>
                                {
                                    (cur_user.profile.city ? cur_user.profile.city : '') +
                                    (cur_user.profile.city ? ', ' : '') +
                                    (cur_user.profile.state ? cur_user.profile.state : '') +
                                    ' ' + (cur_user.profile.zip ? cur_user.profile.zip : '')
                                }
                            </div>
                            <div>{cur_user.profile.cell ? cur_user.profile.cell : ''}</div>
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
Invoice.propTypes = {
    trx: Proptypes.array,
    total: Proptypes.number,
    updateTrx: Proptypes.func,
    updateInvoices: Proptypes.func,
    clearSelTrx: Proptypes.func
}
export default Invoice;