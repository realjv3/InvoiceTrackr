/**
 * Created by John on 6/17/2016.
 */
var Main_area = React.createClass({
    render: function() {
        return (
            <Paper className="main_area">
                <Card className="cards" initiallyExpanded={true} >
                    <CardHeader
                        title="Billables"
                        subtitle="Track Time & Expenses"
                        actAsExpander={true}
                        showExpandableButton={true}
                        avatar="http://googledrive.com/host/0B1f8PNGaySaRS1JKektwMjBjRW8"
                        />
                    <form id="trx_form" className="trx_form" expandable={true}>
                        <CardText style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap'
                        }}>
                            <DatePicker
                                autoOk={true}
                                floatingLabelText="Date"
                                floatingLabelFixed={true}
                                floatingLabelStyle={{color: '#03A9F4'}}
                                className="trx_entry_field"
                            />
                            <Autocomplete
                                hintText="Customer"
                                dataSource={['foo', 'bar']}
                                floatingLabelText="Customer"
                                floatingLabelFixed={true}
                                floatingLabelStyle={{color: '#03A9F4'}}
                                className="trx_entry_field"
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
                        </CardText>
                    </form>
                    <CardActions expandable={true}>
                        <FlatButton label="Enter Transaction" />
                        <FlatButton label="Clear" onClick={function() {document.forms['trx_form'].reset()}}/>
                    </CardActions>
                </Card>
                <Card className="cards">
                    <CardHeader
                        title="Invoices"
                        subtitle="Cash rules everything around me"
                        actAsExpander={true}
                        showExpandableButton={true}
                        avatar="http://googledrive.com/host/0B1f8PNGaySaReXhIeW5mUnpRdk0"
                        />
                    <CardText expandable={true}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                    <CardActions expandable={true}>
                        <FlatButton label="Action1" />
                        <FlatButton label="Action2" />
                    </CardActions>
                </Card>
                <Card className="cards">
                    <CardHeader
                        title="Reports"
                        actAsExpander={true}
                        showExpandableButton={true}
                        avatar="http://googledrive.com/host/0B1f8PNGaySaRanYtTldaYzExTzg"
                        />
                    <CardText expandable={true}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                    <CardActions expandable={true}>
                        <FlatButton label="Action1" />
                        <FlatButton label="Action2" />
                    </CardActions>
                </Card>
            </Paper>
        );
    }
});

ReactDOM.render(<Main_area />, document.getElementById('content'));