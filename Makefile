include .env
export

CONTAINER_NGINX=docker compose exec -T nginx sh -c
CONTAINER_DEV=docker compose exec -T multisig_dev sh -c

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

.PHONY: setup-wallet
setup-wallet:
	rm -f ./src/multisigExtrasConfig.ts ; touch ./src/multisigExtrasConfig.ts
	cp -p ./src/config.devnet.ts ./src/config.ts
	rm -f ./src/multisigConfig.ts ; touch ./src/multisigConfig.ts
	echo "export const storageApi = '$(EXTRAS_API_DEVNET)';" >> ./src/multisigExtrasConfig.ts

ifeq "$(SINGLE_WALLET)" "true"
	echo "export const uniqueContractAddress = '$(UNIQUE_CONTRACT_ADDRESS)';" >> ./src/multisigConfig.ts
	echo "export const uniqueContractName = '$(UNIQUE_CONTRACT_NAME)';" >> ./src/multisigConfig.ts
endif

.PHONY: setup-single-wallet
setup-single-wallet:
	make setup-dev

	rm ./src/multisigExtrasConfig.ts ; touch ./src/multisigExtrasConfig.ts
	echo "export const storageApi = '$(EXTRAS_API_DEVNET)';" >> ./src/multisigExtrasConfig.ts
	echo "export const maiarIdApi = '$(MAIAR_ID_API_DEVNET)';" >> ./src/multisigExtrasConfig.ts

	cp -p ./src/config.devnet.ts ./src/config.ts

	rm ./src/multisigConfig.ts ; touch ./src/multisigConfig.ts
	echo "export const uniqueContractAddress = '$(UNIQUE_CONTRACT_ADDRESS)';" >> ./src/multisigConfig.ts
	echo "export const uniqueContractName = '$(UNIQUE_CONTRACT_NAME)';" >> ./src/multisigConfig.ts

	$(CONTAINER_DEV) 'npx prettier --write ./src/multisigConfig.ts'
	$(CONTAINER_DEV) 'npm install'

.PHONY: setup-multi-wallet
setup-multi-wallet:
	make setup-dev

	rm ./src/multisigExtrasConfig.ts ; touch ./src/multisigExtrasConfig.ts
	echo "export const storageApi = '$(EXTRAS_API_DEVNET)';" >> ./src/multisigExtrasConfig.ts
	echo "export const maiarIdApi = '$(MAIAR_ID_API_DEVNET)';" >> ./src/multisigExtrasConfig.ts

	cp -p ./src/config.devnet.ts ./src/config.ts

	rm ./src/multisigConfig.ts ; touch ./src/multisigConfig.ts

	$(CONTAINER_DEV) 'npm install'

.PHONY: setup-dev
setup-dev:
	docker-compose -f docker-compose.dev.yml up -d

.PHONY: dev
dev:
	$(CONTAINER_DEV) 'npm start'



# TODO: staging and production single / multiwallet
.PHONY: staging
staging:
	make production

.PHONY: production
production:
	make permissions
	docker compose up -d
	$(CONTAINER_NGINX) 'npm install'
	$(CONTAINER_NGINX) 'npm rebuild node-sass --force'
	$(CONTAINER_NGINX) './node_modules/prettier/bin-prettier.js -w src/multisigConfig.ts'
	$(CONTAINER_NGINX) 'mkdir -p node_modules/.cache'
	$(CONTAINER_NGINX) 'chmod -R 777 node_modules/.cache'
	$(CONTAINER_NGINX) 'touch node_modules/.cache/.eslintcache'
	$(CONTAINER_NGINX) 'chmod -R 777 node_modules/.cache/.eslintcache'
	$(CONTAINER_NGINX) 'npm run build'


.PHONY: permissions
permissions:
	mkdir -p .docker/logs/nginx/
	chmod -R 777 .docker/logs/


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
