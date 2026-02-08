.PHONY: help build up down logs restart clean test migrate

help:
	@echo "NeuroQuery - RAG Pipeline Platform"
	@echo ""
	@echo "Available commands:"
	@echo "  make build        Build all Docker containers"
	@echo "  make up          Start all services"
	@echo "  make down        Stop all services"
	@echo "  make logs        View logs from all services"
	@echo "  make restart     Restart all services"
	@echo "  make clean       Remove all containers and volumes"
	@echo "  make test        Run backend tests"
	@echo "  make migrate     Run database migrations"
	@echo "  make shell       Open shell in backend container"
	@echo "  make ps          Show running containers"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

clean:
	docker-compose down -v
	docker system prune -f

test:
	docker-compose exec backend python -m pytest

migrate:
	docker-compose exec backend flask db upgrade

shell:
	docker-compose exec backend bash

ps:
	docker-compose ps

init-db:
	docker-compose exec db psql -U neuroquery -d neuroquery -c "CREATE EXTENSION IF NOT EXISTS vector;"

sample-data:
	docker cp ./data/sample_documents/ai_research.txt neuroquery_backend_1:/app/data/sample_documents/
	docker cp ./data/sample_documents/neuroquery_overview.txt neuroquery_backend_1:/app/data/sample_documents/

dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

prod:
	docker-compose -f docker-compose.prod.yml up -d