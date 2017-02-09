/**
 * Invoice
 */
import React from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import {getSelectedCustomer} from  'util.jsx';

class Invoice extends React.Component {
    constructor(props) {
        super(props);
    }
    openInv = () => {
        let trx_keys = this.props.trx.map(
            (e) => { return e.key; }
        );
        this.props.updateTrx();
        window.open('/create_inv?trx_keys=' + trx_keys + '&total=' + this.props.total + '&content=' + document.getElementById('invoice').outerHTML);
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
                        <h3>{'Invoice Date:  ' + new Date().toJSON().slice(0,10)}</h3>
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
Invoice.PropTypes = {trx: React.PropTypes.array}
export default Invoice;