- user in all environments is always `admin` and password is `admin` or `Password@123`

- Run pnpm list -r to check workspace dependencies at root.

- Delete pnpm cache and reinstall with
  - `rm -rf node_modules`
  - `rm pnpm-lock.yaml`
  - `pnpm install`

- Add package in say ./api with `pnpm add express --filter api` from root or simply pnpm add express from api folder
- Always install from root with pnpm install

- Run custom docker file with `docker compose -f custom-docker-config.yml up -d`