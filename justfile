set dotenv-load

[parallel]
dev:ssr phpdev vite pulse
ssr:
    php artisan inertia:start-ssr
phpdev:
    composer run dev
vite:
    npm run dev
pulse:
    php artisan pulse:check

#url := "localhost:8069"
#open:
#    xdg-open {{url}}

