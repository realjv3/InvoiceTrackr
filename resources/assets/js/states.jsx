/**
 * U.S. State autoselect field for forms
 */
import React from 'react';

import MenuItem from 'material-ui/lib/menus/menu-item.js';
import SelectField from 'material-ui/lib/SelectField';

var States = React.createClass({
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

export {States as default };