// api/index.js
import app from '../dist/app.js'; // path from api/index.js to dist/app.js

export default async function handler(req, res) {
  // Just forward to express app
  // helloe buddy
  return app(req, res);
}