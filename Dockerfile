FROM python:3.12-slim

WORKDIR /app

# Install curl for Docker healthcheck and uv for dependency management
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir uv

# Copy dependency spec first (Docker cache layer)
COPY backend/pyproject.toml backend/
RUN cd backend && uv pip install --system -r pyproject.toml

# Copy application code
COPY backend/ backend/
COPY www/ www/
COPY research/area_to_polygon.json research/area_to_polygon.json
COPY research/area_translations.json research/area_translations.json
COPY research/area_regions.json research/area_regions.json

EXPOSE 8765

CMD ["uvicorn", "backend.server:app", "--host", "0.0.0.0", "--port", "8765"]
