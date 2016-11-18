<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CustTrx extends Model
{
    protected $table = 'cust_trx';

    protected $fillable = array('trxdt', 'custid', 'item', 'descr', 'amt');

    public function customer() {
        return $this->belongsTo('App\Customer', 'custid');
    }
}
