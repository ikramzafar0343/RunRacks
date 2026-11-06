import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import type { AppContext } from "./context.js";
import { assertTrustedOrigin } from "../platform/csrf.js";
import { registerRequestContext } from "../platform/requestContext.js";
import { configureTracing } from "../platform/tracing.js";
import { registerHealthRoutes } from "./healthRoutes.js";
import { registerCatalogRoutes } from "../features/catalog/catalogRoutes.js";
import { registerContentRoutes } from "../features/content/contentRoutes.js";
import { registerContactRoutes } from "../features/contact/contactRoutes.js";
import { registerIdentityRoutes } from "../features/identity/identityRoutes.js";
import { registerCustomerRoutes } from "../features/customers/customerRoutes.js";
import { registerServiceRoutes } from "../features/services/serviceRoutes.js";
import { registerCartRoutes } from "../features/cart/cartRoutes.js";
import { registerPaymentRoutes } from "../features/payments/paymentRoutes.js";
import { registerAiRoutes } from "../features/ai/aiRoutes.js";

export async function buildApp(ctx: AppContext) {
  configureTracing(ctx.config.otelExporterOtlpEndpoint);

  const app = Fastify({
    logger: false,
    trustProxy: ctx.config.trustProxy,
    bodyLimit: 64 * 1024,
  });

  await app.register(helmet, {
    global: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", ...ctx.config.corsOrigins],
      },
    },
  });
  await app.register(cors, {
    origin: ctx.config.corsOrigins,
    credentials: true,
  });
  await app.register(rateLimit, {
    max: 120,
    timeWindow: "1 minute",
  });

  registerRequestContext(app);

  app.addHook("preHandler", async (req, reply) => {
    if (!assertTrustedOrigin(req, reply, ctx.config)) {
      return reply;
    }
  });

  await registerHealthRoutes(app, ctx);
  await registerCatalogRoutes(app, ctx);
  await registerContentRoutes(app, ctx);
  await registerContactRoutes(app, ctx);
  await registerIdentityRoutes(app, ctx);
  await registerCustomerRoutes(app, ctx);
  await registerServiceRoutes(app, ctx);
  await registerCartRoutes(app, ctx);
  await registerPaymentRoutes(app, ctx);
  await registerAiRoutes(app, ctx);

  return app;
}
