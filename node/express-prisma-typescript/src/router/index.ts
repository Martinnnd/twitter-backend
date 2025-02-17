import { Router } from 'express'
import { withAuth } from '@utils'

import { userRouter } from '@domains/user'
import { postRouter } from '@domains/post'
import { authRouter } from '@domains/auth'
import { healthRouter } from '@domains/health'
import { followerRouter } from "@domains/follower";
import { commentRouter } from '@domains/comment'
import { reactionRouter } from '@domains/reaction'
import { messageRouter } from '@domains/message/controller'

export const router = Router()

router.use('/health', healthRouter)
router.use('/auth', authRouter)
router.use('/user', withAuth, userRouter)
router.use('/post', withAuth, postRouter)
router.use('/follower', withAuth, followerRouter)
router.use('/comment', withAuth, commentRouter)
router.use('/reaction', withAuth, reactionRouter)
router.use('/message', withAuth, messageRouter)


export default router;