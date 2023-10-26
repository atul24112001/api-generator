import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  res.status(404).send(`
        <div style="display: flex; align-items: center; flex-direction: column;">
            <h1>This is todo app api v1.0.0</h1>
            <h2>No route found at ${req.path}</h2>
        </div>
    `);
};
