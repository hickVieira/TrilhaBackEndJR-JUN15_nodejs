## App de Tarefas
https://trilhabackendjr-jun15-nodejs.onrender.com

### quick-run script
```bash
rm -rf tasks-app &&
mkdir tasks-app &&
git clone https://github.com/hickVieira/TrilhaBackEndJR-JUN15_nodejs.git ./tasks-app &&
cd ./tasks-app &&
git checkout dev &&
npm ci &&
npm run test &&
cd ..
```

### notes, rants, takeaways
- typescript to javascript transpilation and workarounds suck
- node ecosystem sucks big
- typescript env vars setup is a complete joke
- tests MUST be sequential due to calls to /reset-db constraints
   - this was my mistake, never gonna do this again, results in slow test process
- docker setup is hell
- should have had a working deployed mvp on render sooner
   - the whole docker compose stuff was total waste of time and useless
- sql databases suck to setup

### endpoints
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

### techstack
- NodeJS
- Typescript
- Fastify
- Prisma
- Docker
- PostgreSQL
- Jest
- SuperTest

### checklist
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
- [x] deploy
- [ ] ci/cd
   - [ ] github actions
   - [ ] deploy
