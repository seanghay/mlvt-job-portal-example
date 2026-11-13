// Vercel function. The real code is in server/vercel-entry.ts; `npm run build`
// bundles it to build-api/app.mjs before Vercel packages this function.
export { default } from '../build-api/app.mjs'
