const express = require("express");
const path = require("path");
const client = require("prom-client");
const app = express();
const port = process.env.PORT || 8080;
const serviceName = "frontend";

client.collectDefaultMetrics({ prefix: `${serviceName}_` });

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request latency in seconds",
  labelNames: ["service", "method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.3, 1, 3, 5],
});

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

app.get("/healthz", (req, res) => res.status(200).json({ status: "ok" }));

//Serve website
app.use(express.static(path.join(__dirname, "public")));

// Client-side routing fallback for Express 5 wildcard syntax.
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

//Start the server
app.listen(port, () =>
  console.log(`Frontend microservice listening on port ${port}!`),
);
