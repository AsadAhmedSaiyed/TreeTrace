import { tool, generateText } from "ai";
import { z } from "zod";
import sendEmail from "./sendEmail.js";
import generateEmailContent from "./generateEmailContent.js";

const emailAgentTool = tool({
  description:
    "Orchestrates drafting and sending professional NGO email alerts.",
  // Inside your getSummaryTool definition:
  inputSchema: z.object({
    summary:z.string().describe("Report summary."),     
    ngoEmail: z.string().describe("The recipient NGO email address."),
    action: z.enum(["DRAFT_ONLY", "SEND_ALERT"]).describe("Whether to just draft or draft and send.")
  }),
  execute: async ({summary,ngoEmail,action})=>{
    const emailContent = await generateEmailContent({summary});
    if (action === "DRAFT_ONLY") {
      return { status: "DRAFTED", ...emailContent };
    }
    try{
       await sendEmail({
        email:ngoEmail,
        subject :emailContent.subject,
        body:emailContent.body 
       });
       return { status: "SENT", message: `Alert successfully sent to ${ngoEmail}` };
    }catch(e){
      return {status : "Error" , message:e.message};
    }
  },
});

export default emailAgentTool;
