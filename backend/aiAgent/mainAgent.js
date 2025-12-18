import summaryAgentTool from "./summaryAgentTool";
import emailAgentTool from "./emailAgentTool";
import { generateText } from "ai";

const mainAgentSystemPrompt = `
You are the **Lead Operations Commander** for TreeTrace.
Your goal is to analyze report data and coordinate NGO alerts.

**PROTOCOL:**
1. **ANALYZE**: Always start by calling 'summaryAgent' with the provided report data.
2. **EVALUATE**: Read the summary. 
   - IF 'loss_detected' is TRUE: You MUST initiate the alert protocol.
   - IF 'loss_detected' is FALSE: Do not send an email. Just report "No significant loss detected."
3. **ACT**: If loss is confirmed, call 'emailAgent' with:
   - 'action': "SEND_ALERT"
   - 'ngoEmail': The provided contact email.
   - 'reportData': The original data object.

**Constraint**: Do not ask the user for permission. If loss is found, execute the email alert immediately.
`;

const runMainAgent = async (reportData,ngoEmail) =>{
   console.log("Main Agent started...");
   const response = await generateText({
    model:"google/gemini-2.5-flash",
    system: mainAgentSystemPrompt,
    tools:{
        summaryAgent:summaryAgentTool,
        emailAgent: emailAgentTool,
    },
    maxSteps:5,
    prompt: `Process this report for NGO contact ${ngoEmail}: ${JSON.stringify(reportData)}`,
   });
   return response.text;
};

export default runMainAgent;