COMPOSE_FILE = docker-compose.yaml

default:
	@echo "Please specify a target: up, start, stop, clean, rebuild, or logs"

up:
	docker-compose -f $(COMPOSE_FILE) up --build

start:
	docker-compose -f $(COMPOSE_FILE) up -d

stop:
	docker-compose -f $(COMPOSE_FILE) down

clean:
	docker-compose -f $(COMPOSE_FILE) down --volumes --remove-orphans
	-$$(docker ps -q | xargs -r docker stop)
	-$$(docker ps -aq | xargs -r docker rm)
	-$$(docker images -aq | xargs -r docker rmi)
	-$$(docker volume ls -q | xargs -r docker volume rm)
	-$$(docker network ls -q | xargs -r docker network rm)
	docker system prune -af

rebuild:
	docker-compose -f $(COMPOSE_FILE) up --build --force-recreate

logs:
	docker-compose -f $(COMPOSE_FILE) logs

.PHONY: default up start stop clean rebuild logs
