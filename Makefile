COMPOSE_FILE = docker-compose.yaml

up:
	docker-compose -f $(COMPOSE_FILE) up --build

start:
	docker-compose -f $(COMPOSE_FILE) up -d

stop:
	docker-compose -f $(COMPOSE_FILE) down

clean:
	docker-compose -f $(COMPOSE_FILE) down --volumes --remove-orphans
	docker stop `docker ps -q`
	docker rm `docker ps -aq`
	docker rmi `docker image -aq`
	docker volume rm `docker volume ls -q`
	docker network rm `docker network ls -q`
	docker system prune -af

# clean-images:
# 	docker rm -f $$(docker ps -aq)
# 	docker rmi -f $$(docker images -q)

rebuild:
	docker-compose -f $(COMPOSE_FILE) up --build --force-recreate

.PHONY: up start stop clean prune clean-volumes clean-containers clean-images logs rebuild