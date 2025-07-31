build-prod:
	docker compose -f docker-compose.yml build --no-cache

upd:
	docker compose -f docker-compose.yml up -d

up:
	docker compose -f docker-compose.yml up

destroy:
	docker compose -f docker-compose.yml down --rmi all

build:
	docker build -t dprd-app -f dockerfile .

build-dev:
	docker build -t dprd-app -f dockerfile.dev .

run:
	docker run -it -p 3000:3000 dprd-app

run-dev:
	docker run -it -p 3000:3000 \
		-v $(PWD):/app \
		-v /app/node_modules \
		-e CHOKIDAR_USEPOLLING=true \
		dprd-app

	