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
            'invites',
            function (Blueprint $table) {
                $table->unsignedBigInteger('inviter_user_id');
                $table->foreign('inviter_user_id')->references('id')->on('users');
                $table->datetime('expires_at');
                $table->unsignedInteger('max_successful_attempts');
                $table->unsignedInteger('current_successful_attempts');
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(
            'invites',
            function (Blueprint $table) {
                $table->dropColumn('inviter_user_id');
                $table->dropColumn('expires_at');
                $table->dropColumn('max_successful_attempts');
                $table->dropColumn('current_successful_attempts');
            }
        );
    }
};
