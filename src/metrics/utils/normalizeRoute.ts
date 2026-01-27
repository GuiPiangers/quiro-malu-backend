import { Request } from "express";

export const normalizeRoute = (req: Request): string => {
  let route = req.route?.path || req.baseUrl + req.path || req.path;
  
  // Remove UUIDs
  route = route.replace(
    /\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
    "/:id"
  );
  
  // Remove números (IDs)
  route = route.replace(/\/\d+/g, "/:id");
  
  // Remove tokens/hashes longos
  route = route.replace(/\/[a-zA-Z0-9_-]{20,}/g, "/:token");
  
  return route || "unknown";
};