ERR_TOO_MANY_REDIRECTS — debug checklist

Symptoms: "This page isn’t working ... redirected you too many times" (ERR_TOO_MANY_REDIRECTS)

Common causes & quick checks
- Conflicting redirects between your hosting (Vercel) and DNS/CDN (Cloudflare) or an extra redirect rule in `vercel.json`.
- Cookie or auth redirect loops (clear cookies to test).

Steps to diagnose
1) Clear cookies for the domain in your browser and try again.
2) Use curl to inspect redirect chain:

```bash
curl -I -L -v https://getcvcraft.com/
curl -I -L -v https://www.getcvcraft.com/
```

Look for repeated 301/302 between `getcvcraft.com` and `www.getcvcraft.com`.

3) Check `vercel.json` (this repo has a redirect from `www.getcvcraft.com` -> `https://getcvcraft.com/$1`).
   - If your DNS provider or Cloudflare is also redirecting non-www -> www (or vice-versa) you'll get a loop. Ensure only one redirect exists.

4) Vercel dashboard
- Under Project → Domains: set `getcvcraft.com` as the primary domain, and add `www.getcvcraft.com` as an alias (not primary). Vercel will provision SSL and honor redirects.
- If you previously set `www` as primary or added custom redirects in DNS, adjust accordingly.

5) Cloudflare or DNS provider
- If using Cloudflare, disable any Page Rules that redirect between `www` and apex domain.
- Prefer CNAME (or ALIAS/ANAME) records pointed to Vercel as documented by Vercel.

6) Quick fix options
- Temporarily remove the redirect rule in `vercel.json` and redeploy to test which side causes the redirect.
- Or remove the alias in Vercel so DNS provider handles redirects (not recommended long-term).

If you'd like, I can:
- Inspect your live redirect chain (you can paste curl -I output) and recommend the minimal change.
- Adjust `vercel.json` to avoid overlapping redirects if you tell me which domain you intend as primary.
