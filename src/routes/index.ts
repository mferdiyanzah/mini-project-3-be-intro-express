import { Router } from "express";
import { redirectUrl, shortenUrl } from "../controllers";

const router = Router();

router.post('/shorten', shortenUrl);
router.get('/shorten/:shortId', redirectUrl);

export default router;