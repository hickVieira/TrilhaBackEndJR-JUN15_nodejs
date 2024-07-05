## App de Tarefas

### Techstack
- NodeJS
- Typescript
- Fastify
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