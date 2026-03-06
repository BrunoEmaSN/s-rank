# Seeders de base de datos

Ejecuta datos de prueba en la base de datos. Requiere `DATABASE_URL` en el entorno (o en `.env` / `.env.local`; si tienes `dotenv` instalado se cargará automáticamente).

## Comandos

```bash
# Ejecutar todos los seeders
npm run db:seed

# Ejecutar solo algunos seeders (orden recomendado si no corres todos)
npm run db:seed -- --only=users
npm run db:seed -- --only=users,channels
npm run db:seed -- --only=users,channels,trophies,follows-and-stats
```

Nombres de seeders: `users`, `channels`, `trophies`, `follows-and-stats`.

## Contenido de cada seeder

| Seeder | Tablas | Descripción |
|--------|--------|-------------|
| `users` | `user`, `profiles` | 2 streamers y 2 suscriptores de prueba |
| `channels` | `channel` | 2 canales (Twitch, Kick) asociados a los streamers |
| `trophies` | `trophies`, `trophy_rules` | 5 trofeos de ejemplo |
| `follows-and-stats` | `favorite_streamers`, `user_stats`, `user_trophies` | Seguidores, horas vistas y trofeos desbloqueados |

Los inserts usan `onConflictDoNothing()`, así que puedes ejecutar el seed varias veces sin duplicar filas (por claves primarias/únicas).
