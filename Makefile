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
	@echo "🧹 Nettoyage en cours..."
	
	# Arrêter et supprimer tous les conteneurs
	@echo "📦 Arrêt des conteneurs..."
	docker-compose -f $(COMPOSE_FILE) down --volumes --remove-orphans
	@docker ps -q 2>/dev/null | xargs -r docker stop
	@docker ps -aq 2>/dev/null | xargs -r docker rm
	
	# Supprimer toutes les images
	@echo "🖼️  Suppression des images..."
	@docker images -aq 2>/dev/null | xargs -r docker rmi -f
	
	# Supprimer tous les volumes
	@echo "💾 Suppression des volumes..."
	@docker volume ls -q 2>/dev/null | xargs -r docker volume rm
	
	# Supprimer tous les réseaux personnalisés
	@echo "🌐 Suppression des réseaux personnalisés..."
	@docker network ls --filter type=custom -q 2>/dev/null | xargs -r docker network rm
	
	# Nettoyer le système Docker
	@echo "🧼 Nettoyage du système Docker..."
	docker system prune -af --volumes
	
	# Supprimer les fichiers de build
	@echo "🗑️  Suppression des fichiers de build..."
	@rm -rf backend/node_modules 2>/dev/null || true
	@rm -rf frontend/node_modules 2>/dev/null || true
	@rm -rf backend/dist 2>/dev/null || true
	@rm -rf frontend/dist 2>/dev/null || true
	
	# Supprimer les fichiers de cache npm
	@echo "🧹 Nettoyage des caches npm..."
	@rm -rf backend/.npm 2>/dev/null || true
	@rm -rf frontend/.npm 2>/dev/null || true
	
	# Supprimer les fichiers de cache Docker
	@echo "🧹 Nettoyage du cache Docker..."
	@rm -rf ~/.docker/cache 2>/dev/null || true
	
	@echo "✨ Nettoyage terminé !"

rebuild:
	docker-compose -f $(COMPOSE_FILE) up --build --force-recreate --no-cache

logs:
	docker-compose -f $(COMPOSE_FILE) logs

.PHONY: default up start stop clean rebuild logs
