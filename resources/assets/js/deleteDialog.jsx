/**
 * Created by John on 4/9/2017.
 * A generic delete 'are you sure?' dialog
 */
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class DeleteDialog extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {open: false, id: null};
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
            <FlatButton label="Continue" primary={true} className={this.state.id} onClick={(id = this.state.id) => {this.props.handleDelete(this.state.id);}} style={{color: 'green'}}/>
        ];

        return (
            <Dialog
                title="Are you sure you want to do this?"
                actions={actions}
                modal={true}
                open={this.state.open}
                onRequest={this.handleClose}
            >
                {this.props.text}
            </Dialog>
        );
    }
}
DeleteDialog.propTypes = {
    handleDelete: React.PropTypes.func.isRequired,
    text: React.PropTypes.string.isRequired
}

export {DeleteDialog as default};