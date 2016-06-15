<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CustTrx extends Model
{
    public function customer() {
        return $this->belongsTo('App\Customer', 'custid');
    }
}
