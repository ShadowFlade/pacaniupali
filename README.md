
## Startup
* php artisan inertia:start-ssr
* npm run dev
* composer run dev

### Fresh startup
* composer install
* npm install
* create database and update `.env` accordingly
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
* group detail page - all games of the groups (thats all for now looks like)
* player - your last games, total points, best games and so on
* replace string table names with smth like Model\User::table_name if it exists (across whole project)

# BUGS
* показывает неправильное количество игр у групп на /group (показывает количество у первой группы для всех групп)

