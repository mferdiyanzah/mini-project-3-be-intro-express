import express, { Express, Request, Response, NextFunction } from 'express';
import shortid from 'shortid';
import dns from 'dns';

const server: Express = express();

interface UrlListInterface {
  [key: string]: string;
}

const urlList: UrlListInterface = {};

const validateUrl = (url: string): boolean => {
  const urlRegex = new RegExp('^(http|https)://', 'i');
  return urlRegex.test(url);
}

const validateDomain = async (url: string): Promise<boolean> => {
  const domain = new URL(url).hostname;
  return new Promise((resolve, reject) => {
    dns.lookup(domain, (err) => {
      if (err) {
        reject(false);
      }
      resolve(true);
    });
  });
}

const urlShortener = async (url: string): Promise<string> => {
  if (!validateUrl(url)) {
    throw new Error('Invalid URL');
  }

  try {
    await validateDomain(url);
  } catch (error) {
    throw new Error('Invalid domain');
  }

  const shortId = shortid.generate();
  urlList[shortId] = url;
  return shortId;
}

const shortenUrl = async (req: Request, res: Response, next: NextFunction) => {
  const { url } = req.body;
  if (!url) {
    return next(new Error('URL is required'));
  }

  try {
    const shortId = await urlShortener(url);
    res.status(200).json({
      status: 'success',
      shortId,
    });
    next();
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) {
      if (error.message === 'Invalid URL') {
        errorMessage = 'Invalid URL';
      }
      if (error.message === 'Invalid domain') {
        errorMessage = 'Invalid domain';
      }
    }
    res.status(400).json({
      status: 'error',
      error: errorMessage,
    });
  }
};

const redirectUrl = (req: Request, res: Response, next: NextFunction) => {
  const { shortId } = req.params;
  const url = urlList[shortId];
  if (!url) {
    res.status(404).json({
      status: 'error',
      error: 'URL not found',
    });
  }
  res.redirect(301, url);
};

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

server.use(logger);
server.use(express.json());
server.post('/shorten', shortenUrl);
server.get('/shorten/:shortId', redirectUrl);

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});