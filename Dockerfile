# Deployment candidate. Verify the staff policies against this release before
# connecting the public website. The local fixture remains independently pinned.
FROM directus/directus:12.6.0
COPY --chown=node:node render-preflight.mjs /directus/render-preflight.mjs
CMD ["sh", "-c", "node /directus/render-preflight.mjs && node cli.js bootstrap && node cli.js start"]
