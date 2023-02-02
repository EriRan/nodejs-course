export function getPosts(req, res, next) {
  // No more rendering at REST API
  // Status is more important now when the client does the rendering and it needs to react to the data received
  res.status(200).json({
    posts: [{ title: "First post", content: "This is a first post" }],
  });
}

export function createPost(req, res, next) {
  console.log(req.body);
  const title = req.body.title;
  const content = req.body.content;
  // 201 Resource was created
  res.status(201).json({
    message: "Post created successfully",
    post: {
      id: Math.round(Math.random() * 1000000000),
      title: title,
      content: content,
    },
  });
}
