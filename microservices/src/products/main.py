import json
import time
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    Histogram,
    ProcessCollector,
    generate_latest,
)

SERVICE_NAME = "products"
DATA_PATH = Path(__file__).parent / "data" / "products.json"


class Product(BaseModel):
    id: str
    name: str
    description: str
    picture: str
    cost: float
    categories: list[str]


def load_products() -> list[Product]:
    with DATA_PATH.open("r", encoding="utf-8") as file:
        payload = json.load(file)

    normalized = []
    for item in payload.get("products", []):
        picture = str(item.get("picture", ""))
        if picture and not picture.startswith("/"):
            item["picture"] = f"/{picture}"
        normalized.append(Product(**item))

    return normalized


products = load_products()
products_by_id = {product.id: product for product in products}

# Keep the same histogram name used by existing dashboards.
http_request_duration = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["service", "method", "route", "status_code"],
    buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.3, 1, 3, 5),
)

# Export products_process_* metrics for Grafana compatibility.
ProcessCollector(namespace=SERVICE_NAME)

app = FastAPI(
    title="products-microservice",
    docs_url="/api/products/docs",
    openapi_url="/api/products/openapi.json",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def track_latency(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    elapsed = time.perf_counter() - start_time

    route_path = request.url.path
    matched_route = request.scope.get("route")
    route_value = getattr(matched_route, "path", route_path)

    http_request_duration.labels(
        service=SERVICE_NAME,
        method=request.method,
        route=route_value,
        status_code=str(response.status_code),
    ).observe(elapsed)

    return response


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.get("/api/products", response_model=list[Product])
async def get_products():
    return products


@app.get("/api/products/{product_id}", response_model=Product)
async def get_product_by_id(product_id: str):
    product = products_by_id.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
