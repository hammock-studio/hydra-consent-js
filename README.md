## Hydra Consent App

## TODO

1. clean the code of the PR √
2. add Policy . √

4. purge the cookies session and find solution for the JWTs maybe local storage WIP
5. redirect to the dashboard

9. add admin and roles option, roles management. (connect to the ory-postgres).
   fix the UGLY HACK for privileged token.
6. add integration test, get inspiration from other projects

3. use docker-compose and add the full flow to the README.md with Makefile
7. add continuous integration circle/travis to kubernetes/heroku.

8. add email verification to the flow.

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
