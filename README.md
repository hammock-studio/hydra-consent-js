## Hydra Consent App

## TODO

1. automate the startup script (change names to clients) with Makefile, halt, stop reset env. (docker-compose)
2. create admin section (read node articles).
3. extend the hydra API (for creation of clients)
4. add roles management(read ladon.go), understand private and public clients privateClient has_many PublicClients
5. fix the UGLY HACK for privileged token.
6. add integration test, get inspiration from other projects
7. add continuous integration circle/travis to kubernetes/heroku.
8. apps - [ analytics ], [ users, clients, roles(policies) & tokens management(hydra-consent-js)],
9. test go API with ZeroMQ, Kafka, RabbitMQ.
10. add email verification to the flow.
11. forgot my password.
12. improve UX of authenticating (save scopes use refresh_token).
13. analytics with ZeroMQ
14. build CLI in go for the auth_center/hammock-studio (with banner) ecosystem.

### Quick start using docker:

```
$ git clone https://github.com/hammock-studio/hydra-consent-js.git
```
```
$ cd hydra-consent-js
```
```
$ docker build -t hydra-consent-js .
```
```
$ docker network create hydra-network
```

```
$ docker run \
--name hydra-postgres \
--network hydra-network \
-e POSTGRES_USER=hydra \
-e POSTGRES_PASSWORD=secret \
-e POSTGRES_DB=hydra \
-p 5431:5432 \
-d postgres:9.6
```

```
$ docker run \
--name hydra-consent-js \
--network hydra-network \
-e PG_URL=postgres://hydra:secret@hydra-postgres:5432/hydra \
-p 9020:3000 \
-d hydra-consent-js
```

visit: http://localhost:9020/

### Local Development:

```
$ git clone https://github.com/hammock-studio/hydra-consent-js.git
```
```
$ cd hydra-consent-js
```
```
$ npm install
```

create a `.env` file with the environment variables:

```
PG_URL='postgres://hydra:secret@localhost:5431/hydra'
PG_TEST_URL='postgres://hydra:secret@localhost:5431/hydra-test'
```

```
$ docker run \
--name hydra-postgres \
--network hydra-network \
-e POSTGRES_USER=hydra \
-e POSTGRES_PASSWORD=secret \
-e POSTGRES_DB=hydra \
-p 5431:5432 \
-d postgres:9.6
```

```
$ npm run dev
```

visit: http://localhost:3000/
