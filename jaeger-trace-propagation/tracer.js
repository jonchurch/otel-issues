'use strict';

const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { Resource } = require('@opentelemetry/resources');
const { ResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

const EXPORTER = process.env.EXPORTER || '';

module.exports = (serviceName) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [ResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  const exporter = new JaegerExporter();

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  registerInstrumentations({
    // // when boostraping with lerna for testing purposes
    instrumentations: [
      new HttpInstrumentation(),
    ],
  });

  return opentelemetry.trace.getTracer('http-example');
};
