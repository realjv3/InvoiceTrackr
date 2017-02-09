/**
 * Some helper functions
 */


export const showOverlay = () => {
    document.getElementById('loader').style.display = 'initial';
    document.getElementById('overlay').style.display = 'initial';
}

export const hideOverlay = () => {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

/**
 * Gets selected customer's paged & sorted transactions
 * and updates cur_user global
 * @param page int - page of trxs (page size 10)
 * @param sort string - column name to sort by
 * @param desc bool - sort dir
 */
export const getSelCustTrxs = (page = 1, sort = '', desc = true) => {
    let cust = getSelectedCustomer(),
        ajaxReq = new XMLHttpRequest(),
        descr = (desc) ? '&desc' : '';
    ajaxReq.open("GET", 'get_trx/' + cust.id + '?page=' + page + '&sort=' + sort + descr, false);
    ajaxReq.setRequestHeader('X-CSRF-Token', _token);
    ajaxReq.onload = () => {
        if(ajaxReq.responseText && ajaxReq.responseText != "") {
            cust.custtrx = ajaxReq.responseText;
            cust.custtrx = JSON.parse(cust.custtrx);
            //Update cur_user global with the fetched transactions
            for(let i = 0; i < cur_user.customer.length; i++) {
                if(cur_user.customer[i].id == cust.id) {
                    cur_user.customer[i] = cust;
                    break;
                }
            }
        }
    };
    ajaxReq.send();
}

export const getTrx = (id) => {
    for(var i = 0; i < cur_user.customer.length; i++)
        if(cur_user.customer[i].custtrx != null)
            for(var j = 0; j < cur_user.customer[i].custtrx.data.length; j++)
                if(cur_user.customer[i].custtrx.data[j].id == id)
                    return cur_user.customer[i].custtrx.data[j];
    return false;
}

export const getBillable = (id) => {
    for(var i = 0; i < cur_user.customer.length; i++)
        if(cur_user.customer[i].billable != null)
            for(var j = 0; j < cur_user.customer[i].billable.length; j++)
                if(cur_user.customer[i].billable[j].id == id)
                    return cur_user.customer[i].billable[j];
    return false;
}

export const getSelectedCustomer = () => {
    for (var i = 0; i < cur_user.customer.length; i++)
        if (cur_user.customer[i].selected)
            return cur_user.customer[i];
    return false;
}

export const getSelectedBillable = () => {
    let cust = getSelectedCustomer();
    if(cust && cust.billable != null)
        for (var i = 0; i < cust.billable.length; i++)
            if (cust.billable[i].selected)
                return cust.billable[i];
    return false;
}