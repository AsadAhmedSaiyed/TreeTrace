type LogMeta = Record<string, unknown>

interface Logger {
   debug: (message: string, meta?: LogMeta) => void;
   info: (message: string, meta?: LogMeta) => void;
   warn: (message: string, meta?: LogMeta) => void;
   error: (message: string, meta?: LogMeta) => void;
}

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS : Record<LogLevel, number> = {
    debug: 0,
    info:1,
    warn:2,
    error:3
};

const CURRENT_LEVEL: number =
  LOG_LEVELS[(process.env.LOG_LEVEL as LogLevel) ?? "info"];


const format = (level : LogLevel, context : string, message : string, meta : LogMeta = {}) : string =>{
   const entry = {
    timestamp : new Date().toISOString(),
    level,
    context,
    message,
    ...(Object.keys(meta).length > 0 && {meta}),
   };
   return JSON.stringify(entry);
};

export const createLogger = (context : string) : Logger=>({
    debug: (message, meta)=>{
        if(CURRENT_LEVEL <= LOG_LEVELS.debug){
            console.debug(format("debug",context,message,meta));
        }
    },
    info: (message, meta)=>{
        if(CURRENT_LEVEL <= LOG_LEVELS.info){
            console.info(format("info",context,message,meta));
        }
    },
    warn: (message, meta)=>{
        if(CURRENT_LEVEL <= LOG_LEVELS.warn){
            console.warn(format("warn",context,message,meta));
        }
    },
    error: (message, meta)=>{
        if(CURRENT_LEVEL <= LOG_LEVELS.error){
            console.error(format("error",context,message,meta));
        }
    },
});