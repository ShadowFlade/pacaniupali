<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('winners', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('game_id'); // Внешний ключ для games
            $table->unsignedBigInteger('player_id'); // Внешний ключ для players

            // Добавляем внешние ключи
            $table->foreign('game_id')
                ->references('id')
                ->on('games')
                ->onDelete('cascade'); // Удаление записей при удалении игры

            $table->foreign('player_id')
                ->references('id')
                ->on('players')
                ->onDelete('cascade'); // Удаление записей при удалении игрока

            // Уникальный индекс для комбинации game_id и player_id
            $table->unique(['game_id', 'player_id']);

            $table->timestamps(); // created_at и updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('winners');
    }
};
