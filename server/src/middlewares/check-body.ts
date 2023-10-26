// import { NextFunction, Request, Response } from "express";
// import {ZodObject, z } from "zod";

// const authenticationType = z.object({
//     email: z.string().min(10).max(20),
//     password: z.string().min(6).max(15),
// })

// const schemas = {
//     "authenticationType": authenticationType,
// }

// export default function (type: string){
//     return async function (req: Request, res: Response, next: NextFunction) {
//         const targetObject: null | ZodObject = schemas[type];
//         if(!targetObject){

//         }

//     }
// }
