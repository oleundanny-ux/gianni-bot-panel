import { Router, type IRouter } from "express";
import healthRouter from "./health";
import commandsRouter from "./commands";
import embedsRouter from "./embeds";
import settingsRouter from "./settings";
import discordRouter from "./discord";
import channelConfigsRouter from "./channel-configs";
import protectionRouter from "./protection";

const router: IRouter = Router();

router.use(healthRouter);
router.use(commandsRouter);
router.use(embedsRouter);
router.use(settingsRouter);
router.use(discordRouter);
router.use(channelConfigsRouter);
router.use(protectionRouter);

export default router;
