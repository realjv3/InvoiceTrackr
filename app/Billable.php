<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Billable extends Model
{
    protected $fillable = ['custid', 'type', 'descr', 'type', 'unit', 'price'];

    public function customer() {
        return $this->belongsTo('App\Customer', 'custid');
    }
}
