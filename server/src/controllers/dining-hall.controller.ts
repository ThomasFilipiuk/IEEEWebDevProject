import { Request, Response } from "express";
import { find } from "../database/utils";

const getDiningHall = async(req: Request, res: Response) => {
  try {
    const diningHall = req.params.diningHallName
    
    const result = await find(diningHall, {"diningHall" : req.params.diningHallName});
    res.json(result);
  }
  catch (err: any) {
    res.status(500).json({error: err.message});
  }
}

export { getDiningHall };