import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { ValidationException } from './errors'
import { plainToInstance } from 'class-transformer'
import { ClassType } from '@types'
import { ReactionType } from '@prisma/client'

export function BodyValidation<T> (target: ClassType<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    req.body = plainToInstance(target, req.body)
    const errors = await validate(req.body, {
      whitelist: true,
      forbidNonWhitelisted: true
    })

    if (errors.length > 0) { throw new ValidationException(errors.map(error => ({ ...error, target: undefined, value: undefined }))) }

    next()
  }
}

export function isValidReactionType(req: Request, res: Response, next: NextFunction): void {
  const  type  = req.body.type
  if (type !== undefined && !['LIKE', 'RETWEET'].includes(type as string)) {
    throw new ValidationException([{ property: 'type', constraints: { isEnum: 'type must be a valid Reaction type' } }])
  }

  next()
}
