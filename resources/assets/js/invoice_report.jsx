/**
 * Modal that displays an existing invoice
 */
 import React from 'react';
 import ES6Promise from 'es6-promise';
 ES6Promise.polyfill();

 import Dialog from 'material-ui/Dialog';
 import FlatButton from 'material-ui/FlatButton';

 import {getBillable} from 'util.jsx';

 class InvoiceReport extends React.Component
 {
     constructor(props) {
         super(props);
         this.state = {
             open: false,
             invoice: {},
             trxs: [],
             total: 0
         };
     }

     handleOpen = (inv_id) => {
         let invoice, trxs = [], total = 0;
         fetch('invoice/' + inv_id, {headers: {'X-CSRF-Token': _token}, credentials: 'same-origin'})
             .then((response) => {
                 if (response.ok) {
                     response.json()
                     .then((json) => {
                         invoice = json[0];
                         for (let i = 0; i < Object.keys(invoice.cust_trx).length; i++) {
                             if (invoice.cust_trx[i].inv == inv_id) {
                                 let billable = getBillable(invoice.cust_trx[i].item),
                                     qty = (invoice.cust_trx[i].amt / billable.price).toFixed(2) + ' x $' + billable.price + '/' + billable.unit,
                                     tmp =
                                         <tr key={'trx_id_' + invoice.cust_trx[i].id}>
                                             <td>{invoice.cust_trx[i].trxdt}</td>
                                             <td>{billable.descr}</td>
                                             <td>{invoice.cust_trx[i].descr}</td>
                                             <td>{qty}</td>
                                             <td>$ {invoice.cust_trx[i].amt}</td>
                                         </tr>;
                                 total = (parseFloat(total) + parseFloat(invoice.cust_trx[i].amt)).toFixed(2);
                                 trxs.push(tmp);
                             }
                         }
                         this.setState({
                             open: true,
                             invoice: invoice,
                             trxs: trxs,
                             total: total
                         });
                     });
                 }
             });
     }

     handleClose = () => {
         this.setState({open: false});
     }

     render() {
         const closeButton = <FlatButton label="Close" onTouchTap={this.handleClose}/>;
         return (
             <Dialog
                actions={closeButton}
                open={this.state.open}
                modal={false}
                onRequestClose={this.handleClose}
                autoScrollBodyContent={true}
             >
                 <p>Invoice No. {this.state.invoice.invno}</p>
                 <p>Invoice Date: {this.state.invoice.invdt}</p>
                 <p>Due Date: {this.state.invoice.duedt}</p>
                 <main>
                     <table style={{marginLeft: 'auto', marginRight: 'auto'}}>
                         <tbody>
                         {this.state.trxs}
                         </tbody>
                     </table>
                     <span>Total: $</span>{this.state.total}
                 </main>
             </Dialog>
         );
     }
 }
 export {InvoiceReport as default};