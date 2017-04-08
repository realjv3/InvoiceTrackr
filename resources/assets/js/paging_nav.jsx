/**
 * A React component for paging navigation that works with Laravel's LenthAwarePaginator
 * @prop refresh function - method of parent component that refreshes page
 * @prop page object - json output of Laravel's LengthAwarePaginator
 * Created by John on 4/2/2017.
 */

import React from 'react';
import IconButton from 'material-ui/IconButton';

class Paging_nav extends React.Component
{
    constructor(props) {
        super(props);
        this.refresh = React.PropTypes.func.isRequired;
        this.page = React.PropTypes.object.isRequired;
    }

    render() {
        return (
        <tr>
            <td>
                {(this.props.page.prev_page_url != null) ?
                <IconButton
                    iconClassName="fa fa-fast-backward"
                    onClick={() => {this.props.refresh(1)}}
                /> : '' }
            </td>
            <td>
                {(this.props.page.prev_page_url != null) ?
                    <IconButton
                        iconClassName="fa fa-backward"
                        onClick={() => {this.props.refresh(this.props.page.current_page - 1)}}
                    /> : '' }
            </td>
            <td>
                {(this.props.page.next_page_url != null) ?
                    <IconButton
                        iconClassName="fa fa-forward"
                        onClick={() => {this.props.refresh(this.props.page.current_page + 1)}}
                    /> : ''}
            </td>
            <td>
                {(this.props.page.next_page_url != null) ?
                    <IconButton
                        iconClassName="fa fa-fast-forward"
                        onClick={() => {this.props.refresh(this.props.page.last_page)}}
                    /> : ''}
            </td>
        </tr>);
    }
}

export {Paging_nav as default};