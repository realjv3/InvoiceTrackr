<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cust_profile extends Model
{
    protected $fillable = array('addr1', 'addr2', 'city', 'state', 'zip', 'cell', 'office');

    protected $primaryKey = 'cust_id';

    public function customer() {
        return $this->belongsTo('customer', 'id', 'cust_id');
    }
}
