/**
 * Here are components for updating user and customer profiles
 */
window.States = React.createClass({
    getInitialState: function() {
        return ({value: this.props.defaultValue, style: this.props.style});
    },
    handleChange: function(event, index, value) {
        //the SelectField component renders wierdly compared to it's surrounding TextInput components, hence having to dynamically change css
        var bottom = (this.props.id == 'user_state') ? '0px' : '9px';
        this.setState({value, style: {bottom: bottom, width: '50px', paddingRight: '10px'}});
    },
    render: function() {
        return (
            <SelectField
                value={this.state.value}
                onChange={this.handleChange}
                floatingLabelText="State"
                floatingLabelStyle={{color: 'black'}}
                style={this.state.style}
                id="state"
                errorText={this.props.error}
            >
                <MenuItem value='AL' primaryText='AL' />
                <MenuItem value='AK' primaryText='AK' />
                <MenuItem value='AZ' primaryText="AZ" />
                <MenuItem value='AR' primaryText="AR" />
                <MenuItem value='CA' primaryText="CA" />
                <MenuItem value='CO' primaryText="CO" />
                <MenuItem value='CT' primaryText="CT" />
                <MenuItem value='DE' primaryText="DE" />
                <MenuItem value='FL' primaryText="FL" />
                <MenuItem value='GA' primaryText="GA" />
                <MenuItem value='HI' primaryText="HI" />
                <MenuItem value='ID' primaryText="ID" />
                <MenuItem value='IL' primaryText="IL" />
                <MenuItem value='IN' primaryText="IN" />
                <MenuItem value='IA' primaryText="IA" />
                <MenuItem value='KS' primaryText="KS" />
                <MenuItem value='KY' primaryText="KY" />
                <MenuItem value='LA' primaryText="LA" />
                <MenuItem value='ME' primaryText="ME" />
                <MenuItem value='MD' primaryText="MD" />
                <MenuItem value='MA' primaryText="MA" />
                <MenuItem value='MI' primaryText="MI" />
                <MenuItem value='MN' primaryText="MN" />
                <MenuItem value='MS' primaryText="MS" />
                <MenuItem value='MO' primaryText="MO" />
                <MenuItem value='MT' primaryText="MT" />
                <MenuItem value='NE' primaryText="NE" />
                <MenuItem value='NV' primaryText="NV" />
                <MenuItem value='NH' primaryText="NH" />
                <MenuItem value='NJ' primaryText="NJ" />
                <MenuItem value='NM' primaryText="NM" />
                <MenuItem value='NY' primaryText="NY" />
                <MenuItem value='NC' primaryText="NC" />
                <MenuItem value='ND' primaryText="ND" />
                <MenuItem value='OH' primaryText="OH" />
                <MenuItem value='OK' primaryText="OK" />
                <MenuItem value='OR' primaryText="OR" />
                <MenuItem value='PA' primaryText="PA" />
                <MenuItem value='RI' primaryText="RI" />
                <MenuItem value='SC' primaryText="SC" />
                <MenuItem value='SD' primaryText="SD" />
                <MenuItem value='TN' primaryText="TN" />
                <MenuItem value='TX' primaryText="TX" />
                <MenuItem value='UT' primaryText="UT" />
                <MenuItem value='VT' primaryText="VT" />
                <MenuItem value='VA' primaryText="VA" />
                <MenuItem value='WA' primaryText="WA" />
                <MenuItem value='WV' primaryText="WV" />
                <MenuItem value='WI' primaryText="WI" />
                <MenuItem value='WY' primaryText="WY" />
            </SelectField>
        );
    }
});

window.Profile = React.createClass({
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
        return({
            formfields: this.formfields,
            message: '',
            open: false
        });
    },
    handleClose: function() {
        this.setState({open: false});
    },
    handleSave: function(e) {
        e.preventDefault();
        var form = new FormData(document.getElementById('profile-form'));
        var fields = Object.keys(this.formfields);
        for(var i = 1; i < fields.length; i++)
            form.set(fields[i], document.getElementById(fields[i]).value);
        fetch('/profile/save', {
            method: 'POST',
            body: form,
            headers: {'X-CSRF-Token': _token, 'X-Requested-With': 'XMLHttpRequest', "Accept": "application/json"},
            credentials: 'same-origin'
        }).then(function(response){
            if(!response.ok) {
                response.json().then(function(json) {
                    var newState = {};
                    for(var field in json) {
                        var key = field;
                        newState[key] = json[key];
                    }
                    this.setState({formfields: newState});
                }.bind(this));
            } else {
                response.text().then(function(text) {
                    this.setState({formfields: this.formfields, message: text, open: true});
                }.bind(this));
            }
        }.bind(this));
    },
    render: function() {
        return (
            <Paper id="profile" style={{position: 'relative', marginLeft: 'auto', marginRight: 'auto', maxWidth: '74vw', marginTop: '50px', padding: '50px', backgroundColor: '#F7FAF5'}}>
                <form id="profile-form" onSubmit={this.handleSave}>
                    <fieldset style={{ margin: '5px', padding: '20px', border: 'solid 1px #E0DEDE', backgroundColor: '#F7FAF5'}}>
                        <TextField
                            hintText="Company"
                            floatingLabelText="Company"
                            floatingLabelStyle={{color:'black'}}
                            className="profile_field"
                            name="company"
                            id="company"
                            errorText={this.state.formfields.company}
                            defaultValue={cur_user.profile.company}
                        /><br />
                        <TextField
                            hintText="First"
                            floatingLabelText="First"
                            floatingLabelStyle={{color:'black'}}
                            className="profile_field"
                            name="first"
                            id="first"
                            errorText={this.state.formfields.first}
                            defaultValue={cur_user.profile.first}
                        />
                        <TextField
                            hintText="Last"
                            floatingLabelText="Last"
                            floatingLabelStyle={{color:'black'}}
                            className="profile_field"
                            name="last"
                            id="last"
                            errorText={this.state.formfields.last}
                            defaultValue={cur_user.profile.last}
                        /><br />
                        <TextField
                            hintText="Email"
                            floatingLabelText="Email"
                            floatingLabelStyle={{color:'black'}}
                            className="profile_field"
                            defaultdefaultValue={cur_user.email}
                            name="email"
                            id="email"
                            errorText={this.state.formfields.email}
                            defaultValue={cur_user.email}
                        />
                    </fieldset>
                    <fieldset style={{ margin: '5px', padding: '20px', border: 'solid 1px #E0DEDE', backgroundColor: '#F7FAF5'}}>
                        <TextField
                            style={{ width: '300px'}}
                            hintText="Address1"
                            floatingLabelText="Address1"
                            floatingLabelStyle={{color:'black'}}
                            className="profile_field"
                            name="addr1"
                            id="addr1"
                            errorText={this.state.formfields.address1}
                            defaultValue={cur_user.profile.address1}
                        /><br />
                        <TextField
                            style={{ width: '300px'}}
                            hintText="Address2"
                            floatingLabelText="Address2"
                            floatingLabelStyle={{color:'black'}}
                            className="profile_field"
                            name="addr2"
                            id="addr2"
                            errorText={this.state.formfields.address2}
                            defaultValue={cur_user.profile.address2}
                        /><br />
                    <span style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}} >
                        <TextField
                            hintText="City"
                            floatingLabelText="City"
                            floatingLabelStyle={{color:'black'}}
                            className="profile_field"
                            name="city"
                            id="city"
                            errorText={this.state.formfields.city}
                            defaultValue={cur_user.profile.city}
                        />
                        <States error={this.state.formfields.state} id="user_state" style={{width: '50px', paddingRight: '10px'}} />
                        <TextField
                            hintText="Zip"
                            style={{width: '100px'}}
                            floatingLabelText="Zip"
                            floatingLabelStyle={{color:'black'}}
                            className="profile_field"
                            name="zip"
                            id="zip"
                            errorText={this.state.formfields.zip}
                            defaultValue={cur_user.profile.zip}
                        /><br />
                    </span>
                        <TextField
                            hintText="Cell"
                            floatingLabelText="Cell"
                            floatingLabelStyle={{color:'black'}}
                            className="profile_field"
                            name="cell"
                            id="cell"
                            errorText={this.state.formfields.cell}
                            defaultValue={cur_user.profile.cell}
                        />
                        <TextField
                            hintText="Office"
                            floatingLabelText="Office"
                            floatingLabelStyle={{color:'black'}}
                            className="profile_field"
                            name="office"
                            id="office"
                            errorText={this.state.formfields.office}
                            defaultValue={cur_user.profile.office}
                        />
                    </fieldset>
                    <FlatButton secondary={true} label="Save" icon={<SaveIcon />} type="submit" />
                    <FlatButton primary={true} label="Cancel" icon={<CancelIcon />} linkButton={true} href="/" />
                </form>
                <Snackbar open={this.state.open} message={this.state.message} onRequestClose={this.handleClose} autoHideDuration={3000} />
            </Paper>
        );
    }
});