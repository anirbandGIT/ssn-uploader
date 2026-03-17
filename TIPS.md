# Tips
- user in all environments is always `admin` and password is `Password@123`

- Run pnpm list -r to check workspace dependencies at root.

- Delete pnpm cache and reinstall with
  - `rm -rf node_modules`
  - `rm pnpm-lock.yaml`
  - `pnpm install`

- Add package in say ./api with `pnpm add express --filter api` from root or simply pnpm add express from api folder
- Always install from root with pnpm install

- Run custom docker file with `docker compose -f custom-docker-config.yml up -d`

- For docker-compose.yml changes remember to
  - `docker compose down`
  - Remove volume with `docker volume ls`
  - Say you changed creds for postgres so `docker volume rm ssn-uploader_postgres_data` to remove data
  - Start fresh with `docker-compose up -d`

- Example curl test for /persons
```
curl -X POST http://localhost:4000/api/v1/persons \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890",
    "ssn": "1234"
  }'
```