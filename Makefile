COMPOSE_FILE = docker-compose.yaml

up:
	docker-compose -f $(COMPOSE_FILE) up --build

start:
	docker-compose -f $(COMPOSE_FILE) up -d

stop:
	docker-compose -f $(COMPOSE_FILE) down

clean:
	docker-compose -f $(COMPOSE_FILE) down --volumes --remove-orphans
	docker system prune -a -f
	docker volume prune -f


# clean-images:
# 	docker rm -f $$(docker ps -aq)
# 	docker rmi -f $$(docker images -q)

rebuild:
	docker-compose -f $(COMPOSE_FILE) up --build --force-recreate

.PHONY: up start stop clean prune clean-volumes clean-containers clean-images logs rebuild