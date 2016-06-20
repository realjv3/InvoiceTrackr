<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{

    protected $fillable = ['email', 'name', 'password'];

    public function customer() {
        return $this->hasMany('App\Customer', 'id');
    }

    public function profile() {
        return $this->hasOne('App\Profile');
    }
}
