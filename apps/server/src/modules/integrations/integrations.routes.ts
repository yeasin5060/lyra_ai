import { Router, type Router as ExpressRouter } from "express";
import { integrationsController } from "./integrations.controller.js";

const router: ExpressRouter = Router();

router.get("/profile", (req, res) => {
  integrationsController.getProfile(req, res);
});

router.get("/accounts", (req, res) => {
  integrationsController.getAccounts(req, res);
});

router.post("/accounts/:id", (req, res) => {
  integrationsController.updateAccount(req, res);
});

export default router;
