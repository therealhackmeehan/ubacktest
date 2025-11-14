import express from "express";
import { type MiddlewareConfigFn } from "wasp/server";

export const serverMiddlewareFn: MiddlewareConfigFn = (middlewareConfig) => {
  middlewareConfig.set("express.json", express.json({ limit: "200kb" }));
  middlewareConfig.set(
    "express.urlencoded",
    express.urlencoded({ limit: "200kb", extended: true })
  );
  return middlewareConfig;
};
