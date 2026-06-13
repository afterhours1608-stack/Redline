export default async (req, res) => {
  try {
    const { default: app } = await import('../server/server.js');
    return app(req, res);
  } catch (err) {
    console.error("VERCEL INIT ERROR:", err);
    res.status(500).json({ error: "Init Error", message: err.message, stack: err.stack });
  }
}
