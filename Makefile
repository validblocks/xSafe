include .env
export

CONTAINER_NGINX=docker compose exec -T nginx sh -c

.PHONY: start
start:
	docker compose up -d

.PHONY: stop
stop:
	docker compose -f docker-compose.yml down

.PHONY: setup
setup:
	make permissions
	docker network create proxy || true
	docker compose up --build -d

.PHONY: dev
dev:
	docker-compose -f docker-compose.dev.yml up

.PHONY: staging
staging:
	make production

.PHONY: production
production:
	make permissions
	docker compose up -d
	$(CONTAINER_NGINX) 'npm install'
	$(CONTAINER_NGINX) 'npm rebuild node-sass --force'
	$(CONTAINER_NGINX) 'npm run build'


.PHONY: permissions
permissions:
	mkdir -p .docker/logs/nginx/
	chmod -R 777 .docker/logs/
	mkdir node_modules/.cache 
	chmod -R 777 node_modules/.cache


.PHONY: reset
reset:
	make stop
	docker system prune --force
	rm -rf ./.docker/logs/nginx/*
	rm -rf ./node_modules/
	rm -rf ./.cache/
	rm -rf ./dist/
	make setup

.PHONY: clean
clean:
	make stop
	docker system prune --all --volumes --force
	rm -rf ./.docker/logs/nginx/*
	rm -rf ./node_modules/
	rm -rf ./.cache/
	rm -rf ./dist/

.PHONY: clean-force
clean-force:
	sudo make clean

.PHONY: ssh-nginx
ssh-nginx:
	docker exec -it ${COMPOSE_PROJECT_NAME}-nginx /bin/sh

.PHONY: rebuild-nginx
rebuild-nginx:
	docker compose up -d --no-deps --force-recreate --build nginx
