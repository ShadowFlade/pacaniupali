
## Startup
* php artisan inertia:start-ssr
* npm run dev
* composer run dev

### Fresh startup
* create database and update `.env` accordingly
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

# LEFT OFF ON
419 when tyring to create a game
