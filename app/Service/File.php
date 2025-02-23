<?php
namespace App\Service;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class File {
    public static function uploadFile(
        UploadedFile $file,
        $folder = null,
        $disk = 'local',
        $filename = null
    )
    {
        $fileName = !is_null($filename) ? $filename : Str::random(10);
        return $file->storeAs(
            $folder,
            $fileName . "." . $file->getClientOriginalExtension(),
            $disk
        );
    }
}
