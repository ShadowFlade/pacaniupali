
## Startup
* php artisan inertia:start-ssr
* npm run dev
* composer run dev
* php artisan pulse:check

### Fresh startup
* composer install
* npm install
* create database and update `.env` accordingly
* php artisan storage:link
* php artisan migrate:install
* php artisan key:generate
* php artisan migrate
* php artisan inertia:start-ssr
* npm run dev
* composer run dev
* php artisan db:seed --class=GameSeeder
  (GameSeeder is the main seeder where all entities are created)


# TODO
* profile page - update all available fields
* player profile page - game history, statistics
* group detail page - all games of the groups (thats all for now looks like)
* player - your last games, total points, best games and so on
* replace string table names with smth like Model\User::table_name if it exists (across whole project)
* in some places IPlayer is actually a user, not a player - refactor - frontend
* ~~add player column - point earned total, points lost total , right answsers, wrong answers~~  


# Архитектурные решения
* почему я не ставлю winner_id в players?
