<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContactRec extends Model
{
    public function customer() {
        return $this->belongsTo('App\Customer', 'custid');
    }
}
