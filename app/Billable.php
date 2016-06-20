<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Billable extends Model
{
    protected $primaryKey = 'custid';

    public function customer() {
        return $this->belongsTo('App\Customer', 'custid');
    }
}
