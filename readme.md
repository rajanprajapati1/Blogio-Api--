**blog API endpoints along with brief descriptions:**

1. **GET http://localhost:3000/api/v1/blogs**: Retrieves all blogs.
2. **GET http://localhost:3000/api/v1/blogs/:id**: Retrieves a single blog by ID.
3. **POST http://localhost:3000/api/v1/create/blog**: Creates a new blog.
4. **PUT http://localhost:3000/api/v1/update/:id/blog**: Updates an existing blog by ID.
5. **DELETE http://localhost:3000/api/v1/delete/:id/blog**: Deletes a blog by ID.
6. **GET http://localhost:3000/api/v1/category**: Retrieves all categories.
7. **POST http://localhost:3000/api/v1/create/category**: Creates a new category.
8. **POST http://localhost:3000/api/v1/blogs/:blogId/comments**: Creates a new comment on a blog.
9. **GET http://localhost:3000/api/v1/blogs/:blogId/comments**: Retrieves all comments for a blog.
10. **DELETE http://localhost:3000/api/v1/blogs/:blogId/comments/:commentId**: Deletes a comment on a blog.
11. **POST http://localhost:3000/api/v1/prompt/ai/gemini**: Generates an AI prompt.
12. **POST http://localhost:3000/api/v1/auth/register**: Registers a new user.
