<?php
/**
 * Author: John
 * Date: 9/24/2016
 * Time: 5:37 PM
 */

namespace App\Util;

use Illuminate\Support\Facades\Facade;

class UtilFacade extends Facade
{
    protected static function getFacadeAccessor() {
        return 'App\Util';
    }
}