import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { db, BodyValidation } from '@utils'
import { PostRepositoryImpl } from '../repository'
import { PostService, PostServiceImpl } from '../service'
import { CreatePostInputDTO } from '../dto'

export const postRouter = Router()

// Use dependency injection
const service: PostService = new PostServiceImpl(new PostRepositoryImpl(db))

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
 *               $ref: '#/components/schemas/Post'
 */
postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, before, after } = req.query as Record<string, string>

  const posts = await service.getLatestPosts(userId, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(posts)
})

/**
 * @swagger
 * /api/postId:
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
 *               $ref: '#/components/schemas/Post'
 */
postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  const post = await service.getPost(userId, postId)
  const author = await db.user.findUnique({
    where: { id : post.authorId },
    select: { is_private: true, followers: true },
  })

  if (author?.is_private) {
    // Check if the user is following the author
    const isFollowing = await db.follow.findFirst({
      where: {
        followerId: userId,
        followedId: post.authorId,
     },
    })

    if(!isFollowing) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Post not found or private account' })
    }
  }

  return res.status(HttpStatus.OK).json(post)
})

postRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: authorId } = req.params

  const posts = await service.getPostsByAuthor(userId, authorId)
  const author = await db.user.findUnique({
    where: { id: authorId },
    select: { is_private: true, followers: true },
  })

  if(author?.is_private) {
    // Check if the user is following the author
    const isFollowing = await db.follow.findFirst({
      where: {
        followerId: userId,
        followedId: authorId,
      },
    })

    if(!isFollowing) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Post not found or private account' })

    }
  }


  return res.status(HttpStatus.OK).json(posts)
})

postRouter.post('/', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  const post = await service.createPost(userId, data)

  return res.status(HttpStatus.CREATED).json(post)
})

postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  await service.deletePost(userId, postId)

  return res.status(HttpStatus.OK).send(`Deleted post ${postId}`)
})
