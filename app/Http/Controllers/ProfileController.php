<?php
/**
 * Author: John
 * Date: 7/15/2016
 * Time: 2:19 PM
 */

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;

class ProfileController extends Controller
{
    public function save(Request $request) {
        $user_id = Auth::user()->id;
        $user = User::find($user_id);

        //Validate
        $this->validate($request, [
            'company' => 'max:255|alpha',
            'first' => 'max:255|alpha',
            'last' => 'max:255|alpha',
            'email' => 'required|max:255|email|unique:users,email,'.$user->email.',email',
            'address1' => 'max:255',
            'address2' => 'max:255',
            'city' => 'max:255',
            'zip' => 'max:12|alpha_dash',
            'cell' => 'max:20',
            'office' => 'max:20',
            'state' => 'max:30|alpha',
        ]);

        //Sanitize
        $formdata = array();
        foreach($_POST as $key => $value) {
            $formdata[$key] = filter_var($value, FILTER_SANITIZE_SPECIAL_CHARS);
        }

        //Arrange data and save profile to database
        $email = $formdata['email'];
        if(!$user->update(['email' => $email]))
            die('Error updating profile');

        unset($formdata['email']);
        if($user->profile()->update($formdata))
            die('Profile updated');
        else
            die('Error updating profile');
    }
}