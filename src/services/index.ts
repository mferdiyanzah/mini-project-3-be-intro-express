import dns from "dns";

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

export { validateDomain, validateUrl };
