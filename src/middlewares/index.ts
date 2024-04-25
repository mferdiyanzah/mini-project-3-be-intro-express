import { Request, Response, NextFunction } from 'express';

const generateStatusCode = (statusCode: number): string => {
  if (statusCode >= 200 && statusCode < 300) {
    const status = "\x1b[32m" + statusCode + "\x1b[0m";
    return status;
  }

  if (statusCode >= 300 && statusCode < 400) {
    const status = "\x1b[33m" + statusCode + "\x1b[0m";
    return status;
  }

  if (statusCode >= 400) {
    const status = "\x1b[31m" + statusCode + "\x1b[0m";
    return status;
  }

  return statusCode.toString();
}

const logger = (req: Request, res: Response, next: NextFunction) => {
  const defaultWrite = res.write;
  const defaultEnd = res.end;
  const chunks: any[] = [];

  // @ts-ignore
  res.write = (...restArgs: any[]) => {
    chunks.push(Buffer.from(restArgs[0]));
    // @ts-ignore
    defaultWrite.apply(res, restArgs);
  }

  // @ts-ignore
  res.end = (...restArgs: any[]) => {
    if (restArgs[0]) {
      chunks.push(Buffer.from(restArgs[0]));
    }

    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.url} ${generateStatusCode(res.statusCode)}`);
    // @ts-ignore
    defaultEnd.apply(res, restArgs);
  }
  next();
}

export default logger;