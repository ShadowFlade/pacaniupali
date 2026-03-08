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
            'games', function (Blueprint $table) {
            DB::statement(
                'ALTER TABLE games ADD CONSTRAINT games_player_id_foreign
                        FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE;'
            );
        }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
