## App de Tarefas

### Running
1. Start docker database
   ```bash
   sudo docker compose up
   ```
2. API access on [localhost:3000](http://localhost:3000)
3. Prisma Studio
   ```bash
   npx prisma studio
   ```
4. Run tests
   ```bash
   npm run test
   ```
5. Stop docker
   ```bash
   sudo docker compose down
   ```

## Endpoints
- users
   - get "/users"
   - get "/users/:id"
   - post "/register"
   - post "/login"
   - put "/users/:id"
   - patch "/users/:id"
   - delete "/users/:id"
- tasks
   - get "/tasks"
   - get "/tasks/:id"
   - get "/tasks/user/:id"
   - post "/tasks/user/:id"
   - put "/tasks/:id"
   - patch "/tasks/:id"
   - delete "/tasks/:id"

### Techstack
- NodeJS
- Typescript
- Fastify
- Prisma
- Docker
- PostgreSQL
- Jest
- SuperTest

### Checklist
- [x] env vars
- [x] database reset util
- [ ] password encryption
- [x] tests
   - [x] user routes
   - [x] task routes
   - [x] e2e test
- [x] user routes
   - [x] get users
   - [x] get user by id
   - [x] post user
   - [x] put user
   - [x] patch user
   - [x] delete user
   - [x] tokens
   - [x] auth
- [x] task routes
   - [x] get tasks
   - [x] get tasks by user
   - [x] get task by id
   - [x] post task
   - [x] put task
   - [x] patch task
   - [x] delete task
- [x] docker
   - [x] image
   - [x] compose
   - [x] database
   - [x] sqlite
   - [x] msql
   - [x] postgresql
- [ ] ci/cd
   - [ ] github actions
   - [ ] deploy
