import { Request, Response } from "express";
import dbError from "../utils/db-error";
import { z } from "zod";
import {
  genToken,
  getPrisma,
  hashString,
  sendResponse,
  verifyHash,
  verifyToken,
} from "../utils/functions";
import { User } from "../types";

const loginType = z.object({
  email: z.string().min(10).max(50),
  password: z.string().max(20),
});

const signType = z.object({
  name: z.string().min(4).max(50),
  email: z.string().min(10).max(50),
  password: z.string().max(20),
});

export async function signup(req: Request, res: Response) {
  try {
    const parsedBody = signType.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(411).json({
        message: "Invalid input.",
      });
      return;
    }
    const prisma = getPrisma();
    if (parsedBody.data.password.length < 6) {
      return dbError(res, "Password length should be 6 or more.");
    }
    const hashedPassword = await hashString(parsedBody.data.password);
    const newUser = await prisma.user.create({
      data: {
        email: parsedBody.data.email,
        password: hashedPassword,
        name: parsedBody.data.name,
      },
    });
    const payload = JSON.parse(JSON.stringify(newUser));
    delete payload["password"];
    delete payload["token"];
    delete payload["secretKey"];
    const token = genToken(payload);

    res.cookie("token", token, {
      httpOnly: true,
      domain: ".atulmorchhlay.com",
      sameSite: "lax",
      secure: true,
    });

    await prisma.user.update({
      where: {
        id: newUser.id,
      },
      data: {
        token: token,
        isLogin: true,
      },
    });
    sendResponse(res, [payload], "Signup Successfully!", 201, null);
    return;
  } catch (error) {
    dbError(res, error);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsedBody = loginType.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(411).json({
        message: parsedBody.error.message,
      });
      return;
    }
    const prisma = getPrisma();
    const userExist = await prisma.user.findFirst({
      where: {
        email: parsedBody.data.email,
      },
    });
    if (!userExist) {
      dbError(res, "User doesn't exist, please signup");
      return;
    }

    const validPassword = await verifyHash(
      parsedBody.data.password,
      userExist.password
    );
    if (!validPassword) {
      dbError(res, "Incorrect Password");
      return;
    }
    const payload = JSON.parse(JSON.stringify(userExist));
    delete payload["password"];
    delete payload["token"];
    delete payload["secretKey"];
    const token = genToken(payload);

    res.cookie("token", token, {
      httpOnly: true,
      domain: ".atulmorchhlay.com",
      sameSite: "lax",
      secure: true,
    });

    await prisma.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        isLogin: true,
        token,
      },
    });
    sendResponse(res, [payload], "Login Successfully!", 200, null);
    return;
  } catch (error) {
    dbError(res, error);
  }
}

export async function verifyUserToken(req: Request, res: Response) {
  try {
    const authorization = req.header("authorization");
    const token = authorization?.split(" ")[1];
    const prisma = getPrisma();

    if (!token) {
      res.cookie("token", null);
      dbError(res, "Token is not provided.", 400);
      return;
    }

    const payload = verifyToken(token) as User;
    if (!payload) {
      res.cookie("token", null);
      dbError(res, "Token is not Valid.", 400);
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      res.cookie("token", null);
      dbError(res, "User not found!", 404);
      return;
    }

    if (user.token !== token || !user.isLogin) {
      res.cookie("token", null);
      dbError(res, "Unauthorized token!", 401);
      return;
    }
    res.status(200).json({
      message: "Login successfully!",
    });
    return;
  } catch (error) {
    dbError(res, error);
  }
}
