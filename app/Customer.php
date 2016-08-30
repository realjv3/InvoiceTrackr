<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = ['company', 'first', 'last', 'email'];

    public function user() {
        return $this->belongsTo('App\User', 'id');
    }

    public function billable() {
        return $this->hasMany('App\Billable', 'custid');
    }

    public function custtrx() {
        return $this->hasMany('App\CustTrx', 'custid');
    }
}
