reset:
	chmod +x ./scripts/reset_hydra && ./scripts/reset_hydra
docker_clear:
	docker stop ory-hydra ory-postgres hydra-consent-js && docker rm ory-hydra ory-postgres hydra-consent-js
compose:
	docker-compose up -d
	sleep 5
	chmod +x ./scripts/reset_hydra && ./scripts/reset_hydra
