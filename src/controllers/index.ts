import { NextFunction, Request, Response } from 'express';
import shortid from 'shortid';
import { validateDomain, validateUrl } from '../services';
const urlList = new Map<string, string>();

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
  urlList.set(shortId, url);
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
  const url = urlList.get(shortId) as string;
  if (!url) {
    res.status(404).json({
      status: 'error',
      error: 'URL not found',
    });
  }
  res.redirect(301, url);
};

export { redirectUrl, shortenUrl };
