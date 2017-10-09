reset_docker:
	chmod +x ./scripts/reset_hydra_docker && ./scripts/reset_hydra_docker

reset_local:
	chmod +x ./scripts/reset_hydra_local && ./scripts/reset_hydra_local

docker_clear:
	docker stop ory-hydra ory-postgres hydra-consent-js && docker rm ory-hydra ory-postgres hydra-consent-js
