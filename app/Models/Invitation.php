<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    protected $dateFormat = 'd-m-Y H:i:s';
    protected $attributes = [
        'link' => '',
        'team_id' => 0,
        'user_role' => '',
        ''
    ]
}
