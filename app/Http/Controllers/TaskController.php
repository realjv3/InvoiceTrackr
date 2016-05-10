<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Task;

class TaskController extends Controller
{
    public function index(Request $request) {
        $tasks = Task::where('user_id', $request->user()->id)->get();
    }
}
