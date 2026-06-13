export default async function (req, res) {
  try {
    const { default: app } = await import('../server/server.js');
    return app(req, res);
  } catch (error) {
    console.error("Critical API Boot Error:", error);
    res.status(500).json({ 
      error: "API Boot Failed", 
      message: error.message, 
      stack: error.stack 
    });
  }
}
