import { tool } from "ai";
import { z } from "zod";
import sendEmail from "./sendEmail.js";
import generateEmailContent from "./generateEmailContent.js";

const emailAgentTool = tool({
  description:
    "Orchestrates drafting and sending professional NGO email alerts.",
  // Inside your getSummaryTool definition:
  inputSchema: z.object({
    summary:z.string().describe("Report summary."),   
    locationName:z.string().describe("Name of area."),
    ngoEmail: z.string().describe("The recipient NGO email address."),
  }),
  execute: async ({summary,locationName,ngoEmail,action})=>{
    const emailContent = await generateEmailContent({summary,locationName});
    
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
