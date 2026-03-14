<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table(
            'players', function (Blueprint $table) {
            $table->integer('points_earned')->nullable();
            $table->integer('points_lost')->nullable();
            $table->integer('right_answers')->nullable();
            $table->integer('wrong_answers')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(
            'players', function (Blueprint $table) {
            $table->dropColumn('points_earned');
            $table->dropColumn('points_lost');
            $table->dropColumn('right_answers');
            $table->dropColumn('wrong_answers');
        });
    }
};
