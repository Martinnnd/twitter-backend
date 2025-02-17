export class MessageDto {
  constructor ( message: MessageDto) {
    this.id = message.id
    this.content = message.content
    this.to = message.to
    this.from = message.from
    this.createdAt = message.createdAt
  }
  id: string
  content: string
  to: string
  from: string
  createdAt: Date
}

export class MessageInputDto {
  constructor ( message: MessageInputDto) {
    this.content = message.content
    this.to = message.to
    this.from = message.from
  }
  content: string
  to: string
  from: string
}