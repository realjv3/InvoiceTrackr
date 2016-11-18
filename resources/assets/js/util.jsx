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

export const getTrx = (id) => {
    for(var i = 0; i < cur_user.customer.length; i++)
        for(var j = 0; j < cur_user.customer[i].custtrx.length; j++)
            if(cur_user.customer[i].custtrx[j].id == id)
                return cur_user.customer[i].custtrx[j];
    return false;
}

export const getBillable = (id) => {
    for(var i = 0; i < cur_user.customer.length; i++)
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
    if(cust)
        for (var i = 0; i < cust.billable.length; i++)
            if (cust.billable[i].selected)
                return cust.billable[i];
    return false;
}