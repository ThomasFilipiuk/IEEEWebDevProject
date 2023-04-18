import { Request, Response } from "express";
import { find } from "../database/utils";
import { ObjectId } from "mongodb";

const getDiningHall = async(req: Request, res: Response) => {
  try {
    const diningHall = req.params.diningHallName;

    const query = {};
    
    if (req.query._id) {
      query._id = new ObjectId(req.query._id as string);
    }

    const result = await find(diningHall, query);
    res.json(result);
  }
  catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

export { getDiningHall };