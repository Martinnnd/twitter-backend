import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db, BodyValidation } from '@utils'
import { PostRepositoryImpl } from '../repository'
import { PostService, PostServiceImpl } from '../service'
import { CreatePostInputDTO } from '../dto'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { UserRepositoryImpl } from '@domains/user/repository'

export const postRouter = Router()

// Use dependency injection
const service: PostService = new PostServiceImpl(new PostRepositoryImpl(db), new FollowerRepositoryImpl(db), new UserRepositoryImpl(db))

/**
 * @swagger
 * /api/post:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get latest posts
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: The number of posts to return
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *         required: false
 *         description: The cursor to the previous page
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *         required: false
 *         description: The cursor to the next page
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedPostDTO'
 */
postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, before, after } = req.query as Record<string, string>

  const posts = await service.getLatestPosts(userId, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(posts)
})

/**
 * @swagger
 * /api/post/{postId}:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get a specific post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found or private account
 */
postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  const post = await service.getPost(userId, postId)
  const author = await db.user.findUnique({
    where: { id : post.authorId },
    select: { isPrivate: true, followers: { where: { followerId: userId } } },
  })

  if (author?.isPrivate && author.followers.length === 0) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'Post not found or private account' })
  }

  return res.status(HttpStatus.OK).json(post)
})

/**
 * @swagger
 * /api/post/by_user/{userId}:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get posts by a specific user
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID whose posts to retrieve
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedPostDTO'
 *       404:
 *         description: Posts not found or private account
 */
postRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: authorId } = req.params

  const posts = await service.getPostsByAuthor(userId, authorId)
  const author = await db.user.findUnique({
    where: { id: authorId },
    select: { isPrivate: true, followers: { where: { followerId: userId } } },
  })

  if(author?.isPrivate && author.followers.length === 0) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'Post not found or private account' })
  }

  return res.status(HttpStatus.OK).json(posts)
})

/**
 * @swagger
 * /api/post:
 *   post:
 *     security:
 *       - bearer: []
 *     summary: Create a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
postRouter.post('/', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  const post = await service.createPost(userId, data)

  return res.status(HttpStatus.CREATED).json(post)
})

/**
 * @swagger
 * /api/post/image/presignedUrl:
 *   get:
 *     security:
 *       - bearer: []
 *     summary: Get a pre-signed URL for uploading an image
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: filetype
 *         schema:
 *           type: string
 *         required: true
 *         description: The MIME type of the image to be uploaded (e.g., "image/png", "image/jpeg")
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 presignedUrl:
 *                   type: string
 *                   description: The pre-signed URL for uploading the image
 *                 filename:
 *                   type: string
 *                   description: The generated filename for the uploaded image
 *       400:
 *         description: Bad request, missing or invalid filetype
 */
postRouter.get('/image/presignedUrl', async (req: Request, res: Response) => {
  const filetype = req.query.filetype as string;

  const data = await service.setPostImage(filetype)

  if (!filetype) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: "Missing filetype query parameter" });
  }
  
  if(data !== null) {
    return res.status(HttpStatus.OK).json(data)
  }
})

/**
 * @swagger
 * /api/post/{postId}:
 *   delete:
 *     security:
 *       - bearer: []
 *     summary: Delete a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  await service.deletePost(userId, postId)

  return res.status(HttpStatus.OK).send(`Deleted post ${postId}`)
})
