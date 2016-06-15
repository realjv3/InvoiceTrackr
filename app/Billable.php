<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Billable extends Model
{
    public function customer() {
        return $this->belongsTo('App\Customer', 'custid');
    }
}
