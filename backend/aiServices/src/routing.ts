import { createLogger } from "./utils/logger.js";
import type { PipelineStateType } from "./state.js";

const logger = createLogger("Router");

export const routeAfterAnalysis = (
    state : PipelineStateType
) : "emailContent" | "__end__" =>{
    const next = state.lossDetected ? "emailContent" : "__end__";
    logger.info("Routing decision made",{
        loss_detected : state.lossDetected,
        next_node : next
    });
    return next;
};