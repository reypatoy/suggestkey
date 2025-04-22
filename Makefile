build-local:
	docker-compose build --no-cache --build-arg MODE=local
	docker-compose up

build-dev:
	docker-compose build --build-arg MODE=development
	docker-compose up

build-prod:
	docker-compose build --build-arg MODE=production
	docker-compose up
