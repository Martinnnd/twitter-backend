import { Request, Response } from "express";
import { FollowerService } from "../service/follower.service";

export class FollowerController {
  private followerService: FollowerService;

  constructor() {
    this.followerService = new FollowerService();
  }

  async followUser(req: Request, res: Response) {
    try {
      const { user_id } = req.params;
      const { userId } = req.body; // ID del usuario autenticado
      await this.followerService.followUser(userId, user_id);
      res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error following user" });
    }
  }

  async unfollowUser(req: Request, res: Response) {
    try {
      const { user_id } = req.params;
      const { userId } = req.body;
      await this.followerService.unfollowUser(userId, user_id);
      res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error unfollowing user" });
    }
  }
}