## App de Tarefas

### Checklist
- [x] env vars
- [x] database reset util
- [ ] password encryption
- [x] tests
- [ ] user routes
   - [x] get users
   - [x] get user by id
   - [ ] get user by email
   - [x] post user
   - [x] put user
   - [x] patch user
   - [x] delete user
   - [x] tokens
   - [x] auth
- [ ] task routes
   - [ ] get tasks
   - [ ] get tasks by user
   - [ ] get task by id
   - [ ] post task
   - [ ] put task
   - [ ] patch task
   - [ ] delete task
- [x] docker
   - [x] image
   - [x] compose
   - [x] database
- [ ] ci/cd
   - [ ] github actions
   - [ ] deploy

### Techstack
- NodeJS
- Typescript
- Fastify
- Jest
- SuperTest
- MySQL
- Docker

### Running

1. Start by running containers/services
   ```bash
   sudo docker compose up --build
   ```
2. API access on [localhost:3000](http://localhost:3000)
3. Adminer access on [localhost:8080](http://localhost:8080)
   - username: root
   - password: admin
4. Stop container/services
   ```bash
   sudo docker compose down -v
   ```
