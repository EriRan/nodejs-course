export function getPosts(req, res, next) {
  // No more rendering at REST API
  // Status is more important now when the client does the rendering and it needs to react to the data received
  res.status(200).json({
    posts: [{ title: "First post", content: "This is a first post" }],
  });
}
