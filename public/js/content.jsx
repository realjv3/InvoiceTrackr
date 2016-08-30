/**
 * Created by John on 6/17/2016.
 * This is the main area component which contains Billables, Invoices and Reporting components
 */

var Main_area = React.createClass({
    render: function() {
        return (
            <Paper className="main_area">
                <Trx />
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