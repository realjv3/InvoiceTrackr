/**
 * This file is the webpack source, will bundle all of these classes and assets into public/js/bundle.js
 * This section is grabbing necessary Material-UI React components
 */

window.React = require('react');
window.ReactDOM = require('react-dom');

window.AppBar  = require('material-ui/lib/app-bar');
window.FlatButton = require('material-ui/lib/flat-button');
window.IconButton = require('material-ui/lib/icon-button');

window.Popover = require('material-ui/lib/popover/popover');
window.List = require('material-ui/lib/lists/list');
window.ListItem = require('material-ui/lib/lists/list-item');
window.TextField = require('material-ui/lib/TextField');
window.SelectField = require('material-ui/lib/SelectField');
window.MenuItem = require('material-ui/lib/menus/menu-item.js');
window.Autocomplete = require('material-ui/lib/auto-complete');
window.DatePicker = require('material-ui/lib/date-picker').DatePicker;
window.Divider = require('material-ui/lib/divider');
window.Dialog = require('material-ui/lib/dialog');

window.Toolbar = require('material-ui/lib/toolbar/toolbar');
window.ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
window.ToolbarSeparator = require('material-ui/lib/toolbar/toolbar-separator');

window.Paper = require('material-ui/lib/paper');
window.SaveIcon = require('material-ui/lib/svg-icons/content/save');
window.CancelIcon = require('material-ui/lib/svg-icons/navigation/cancel');
window.Snackbar = require('material-ui/lib/snackbar');

window.Card = require('material-ui/lib/card/card');
window.CardActions = require('material-ui/lib/card/card-actions');
window.CardHeader = require('material-ui/lib/card/card-header');
window.CardText = require('material-ui/lib/card/card-text');

window.Table = require('material-ui/lib/table');
window.TableBody = require('material-ui/lib/table');
window.TableHeader = require('material-ui/lib/table');
window.TableHeaderColumn = require('material-ui/lib/table');
window.TableHeaderRow = require('material-ui/lib/table');
window.TableRow = require('material-ui/lib/table');
window.TableRowColumn = require('material-ui/lib/table');

window.injectTapEventPlugin = require('react-tap-event-plugin');
window.injectTapEventPlugin();

require('../css/styles.css');

/**
 * site nav and it's children, site footer
 */
require('./header_footer_comps.jsx');

/**
 * User and customer profile components Cust_entry
 */
require('./user_profile_comps.jsx');

/**
 * Transaction tracking module
 */
require('./trx_module_comps.jsx');

