<?php
// config/datetime.php
return [
    'formats' => [
        'display' => 'd-m-Y H:i:s',    // 31-12-2023 23:59:59
        'database' => 'Y-m-d H:i:s',   // 2023-12-31 23:59:59
        'api' => 'Y-m-d\TH:i:s\Z',   // ISO 8601 format
        'date_only' => 'd-m-Y',
        'time_only' => 'H:i:s',
    ],
    'timezone' => config('app.timezone'),
];
