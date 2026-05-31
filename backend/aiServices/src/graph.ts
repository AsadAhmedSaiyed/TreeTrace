import { StateGraph, END } from "@langchain/langgraph";
import { PipelineState } from "./state.js";
import { emailContentNode } from "./nodes/emailContentNode.js";
import { dispatchNode } from "./nodes/dispatchNode.js";
import { analystNode } from "./nodes/analystNode.js";
import { routeAfterAnalysis } from "./routing.js";

const workflow = new StateGraph(PipelineState)
  .addNode("analyst", analystNode)
  .addNode("emailContent", emailContentNode)
  .addNode("dispatch", dispatchNode)
  .addEdge("__start__","analyst")
  .addConditionalEdges("analyst",routeAfterAnalysis,{
    emailContent : "emailContent",
    __end__ : END
  })
  .addEdge("emailContent","dispatch")
  .addEdge("dispatch","__end__");

export const graph = workflow.compile();

export type CompiledGraph = typeof graph;