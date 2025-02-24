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
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('user_id');
            $table
                ->foreign('user_id', 'users_user_id')
                ->references('id')
                ->on('users');

            $table->unsignedBigInteger('game_id');
            $table
                ->foreign('game_id', 'games_game_id')
                ->references('id')
                ->on('games')
                ->onDelete('cascade');

            $table->boolean('is_host')->default(false);
            $table->integer('points');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
