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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->dateTime('game_start');
            $table->dateTime('game_end');

            $table->unsignedBigInteger('group_id');
            $table
                ->foreign('group_id', 'games_group_id')
                ->references('id')
                ->on('group_list');

            //TODO:потом можно будет добавить calculated поле total_points
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
