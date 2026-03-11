const express = require("express");
const cors = require("cors");
const client = require("prom-client");
const app = express();
const port = process.env.PORT || 8082;
const serviceName = "products";

client.collectDefaultMetrics({ prefix: `${serviceName}_` });

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request latency in seconds",
  labelNames: ["service", "method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.3, 1, 3, 5],
});

//Load product for pseudo database
const products = require("./data/products.json").products;

//Enable cors
app.use(cors());

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({
    service: serviceName,
    method: req.method,
    route: req.path,
  });

  res.on("finish", () => {
    end({ status_code: String(res.statusCode) });
  });

  next();
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Health check endpoint used by Kubernetes/GKE probes.
app.get("/healthz", (req, res) => res.status(200).json({ status: "ok" }));

//Get all products
app.get("/api/products", (req, res) => res.json(products));

//Get products by ID
app.get("/api/products/:id", (req, res) =>
  res.json(products.find((product) => product.id === req.params.id)),
);

app.listen(port, () =>
  console.log(`Products microservice listening on port ${port}!`),
);
