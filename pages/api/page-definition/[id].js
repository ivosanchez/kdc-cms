export default async (req, res) => {
  res.status(200).json({ name: "pages definition info", id: req.query.id });
};