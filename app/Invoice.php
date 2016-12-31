<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = array('trxdt', 'custid', 'item', 'descr', 'amt');

    public function customer() {
        return $this->belongsTo('App\Customer', 'custid');
    }

    public function cust_trx() {
        return $this->hasMany('App\CustTrx', 'inv');
    }
}
