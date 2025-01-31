import { Router } from 'express'
import { withAuth } from '@utils'

import { userRouter } from '@domains/user'
import { postRouter } from '@domains/post'
import { authRouter } from '@domains/auth'
import { healthRouter } from '@domains/health'
import { FollowerController } from "../domains/follower/controller/follower.controller";

export const router = Router()

router.use('/health', healthRouter)
router.use('/auth', authRouter)
router.use('/user', withAuth, userRouter)
router.use('/post', withAuth, postRouter)

const followerController = new FollowerController();

router.post("/api/follower/follow/:user_id", (req, res) => followerController.followUser(req, res));
router.post("/api/follower/unfollow/:user_id", (req, res) => followerController.unfollowUser(req, res));

export default router;