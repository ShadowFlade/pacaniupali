<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class Controller
{
    /**
     * Успешный ответ на запрос
     * @param AnonymousResourceCollection|array $data
     * @param int $status
     * @return JsonResponse
     */
    public function successResponse(ResourceCollection|LengthAwarePaginator|array $data = [], int $status = 200): JsonResponse
    {
        $meta = [];
        if (
            !empty($data[0])
            && !empty($data[0]->resource)
            && method_exists($data[0]->resource, 'lastPage')
            && !empty($data[0]->resource->lastPage())
        ) {
            $resource = $data[0]->resource;
            $meta['total'] = $resource->total();
            $meta['currentPage'] = $resource->currentPage();
            $meta['lastPage'] = $resource->lastPage();
        } else {
            if (
                !empty($data->resource)
                && method_exists($data->resource, 'lastPage')
                && !empty($data->resource->lastPage())
            ) {
                $resource = $data->resource;
                $meta['total'] = $resource->total();
                $meta['currentPage'] = $resource->currentPage();
                $meta['lastPage'] = $resource->lastPage();
            }
        }

        return response()->json(
            [
                'success' => true,
                'data'    => $data,
                'meta'    => $meta,
            ], $status
        );
    }

    /**
     * Безуспешный ответ на запрос
     * @param string $message
     * @param int $status
     * @return JsonResponse
     */
    public function errorResponse(
        string $message,
        array  $errors = [],
               $data = [],
        int    $status = 422,
        ?array $messageLanguageVariants = []
    ): JsonResponse
    {
        return response()->json(
            [
                'success' => false,
                'message' => $message,
                'message_variants' => $messageLanguageVariants,
                'errors'  => $errors,
                'data'    => $data
            ], $status
        );
    }
}
