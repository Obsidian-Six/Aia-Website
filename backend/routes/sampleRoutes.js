import express from "express";
import {
  downloadCampusConnectSample,
} from "../controllers/sampleController.js";

const sampleRouter = express.Router();

sampleRouter.get(
  "/campus-connect/download",
  downloadCampusConnectSample
);

export default sampleRouter;