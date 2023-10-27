import prismaClient from "@prisma/client";
import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Razorpay from "razorpay";

export const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
  });
};

let prisma: null | prismaClient.PrismaClient = null;

export function getPrisma() {
  if (!prisma) {
    prisma = new prismaClient.PrismaClient();
  }
  return prisma;
}

export function sendResponse(
  res: Response,
  data: any[],
  message: string | null = null,
  status: number = 200,
  total: number | null = null,
  token: null | string = null
) {
  const jsonObject: { [ket: string]: any } = {
    data,
    message: "Success!",
  };
  if (message) {
    jsonObject["message"] = message;
  }
  if (total) {
    jsonObject["total"] = total;
  }
  if (token) {
    jsonObject["token"] = token;
  }
  res.status(status).json(jsonObject);
}

export async function hashString(data: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data, salt);
  return hash;
}

export async function verifyHash(data: string, hash: string) {
  const isValid = await bcrypt.compare(data, hash);
  return isValid;
}

export function genToken(payload: any, expiresIn?: string) {
  const token = jwt.sign(payload, process.env.SECRET as string, {
    expiresIn: expiresIn ?? "30d",
  });
  return token;
}

export function verifyToken(token: string) {
  const secret = process.env.SECRET as string;
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}
export const struct = (str: string) => {
  return str
    .toLowerCase()
    .replace("-", " ")
    .split(" ")
    .map((st) => st.replace(/[^a-z0-9]/g, ""))
    .join("-");
};

export const sanitizePostData = (
  data: any = {},
  schema: any = {},
  value: any = {},
  errors: string[] = [],
  path?: string
) => {
  console.log(schema);
  for (let key in schema) {
    if (!data[key]) {
      if (schema[key].optional) {
        continue;
      }
      if (path) {
        errors.push(`${path}${key} is required.`);
      } else {
        errors.push(`${key} is required.`);
      }
    }
    if (schema[key].type == "object") {
      if (typeof data[key] == "object" && !Array.isArray(data[key])) {
        value[key] = sanitizePostData(
          data[key],
          schema[key].properties,
          {},
          errors,
          path ? `${path}${key}.` : `${key}.`
        ).value;
      } else {
        if (path) {
          errors.push(`${path}${key} should be a object.`);
        } else {
          errors.push(`${key} should be a object.`);
        }
      }
    } else if (schema[key].type == "array") {
      if (Array.isArray(data[key])) {
        if (
          schema[key].items.type == "object" ||
          schema[key].items.type == "array"
        ) {
          for (let index in data[key]) {
            if (!value[key]) {
              value[key] = [];
            }
            value[key][index] = sanitizePostData(
              data[key][index],
              schema[key].items.properties,
              {},
              errors,
              path ? `${path}${key}.${index}.` : `${key}.${index}.`
            ).value;
          }
        } else {
          if (
            data[key].length == 0 ||
            typeof data[key][0] == schema[key].items.type
          ) {
            value[key] = data[key] ?? [];
          } else {
            if (path) {
              errors.push(
                `${path}${key}'s child should be a ${schema[key].items.type}.`
              );
            } else {
              errors.push(
                `${key}'s child should be a ${schema[key].items.type}.`
              );
            }
          }
        }
      } else {
        if (path) {
          errors.push(`${path}${key} should be a array.`);
        } else {
          errors.push(`${key} should be a array.`);
        }
      }
    } else if (typeof data[key] === schema[key].type) {
      value[key] = data[key];
    } else {
      if (path) {
        errors.push(`${path}${key} should be a ${schema[key].type}.`);
      } else {
        errors.push(`${key} should be a ${schema[key].type}.`);
      }
    }
  }
  return { value, errors };
};

export const sanitizePatchData = (
  data: any = {},
  schema: any = {},
  value: any = {},
  errors: string[] = [],
  path?: string
) => {
  for (let key in data) {
    if (schema[key]) {
      if (schema[key].type == "object") {
        if (typeof data[key] == "object" && !Array.isArray(data[key])) {
          value[key] = sanitizePostData(
            data[key],
            schema[key].properties,
            {},
            errors,
            path ? `${path}${key}.` : `${key}.`
          ).value;
        } else {
          if (path) {
            errors.push(`${path}${key} should be a object.`);
          } else {
            errors.push(`${key} should be a object.`);
          }
        }
      } else if (schema[key].type == "array") {
        if (Array.isArray(data[key])) {
          if (
            schema[key].items.type == "object" ||
            schema[key].items.type == "array"
          ) {
            for (let index in data[key]) {
              if (!value[key]) {
                value[key] = [];
              }
              value[key][index] = sanitizePostData(
                data[key][index],
                schema[key].items.properties,
                {},
                errors,
                path ? `${path}${key}.${index}.` : `${key}.${index}.`
              ).value;
            }
          } else {
            if (
              data[key].length == 0 ||
              typeof data[key][0] == schema[key].items.type
            ) {
              value[key] = data[key] ?? [];
            } else {
              if (path) {
                errors.push(
                  `${path}${key}'s child should be a ${schema[key].items.type}.`
                );
              } else {
                errors.push(
                  `${key}'s child should be a ${schema[key].items.type}.`
                );
              }
            }
          }
        } else {
          if (path) {
            errors.push(`${path}${key} should be a array.`);
          } else {
            errors.push(`${key} should be a array.`);
          }
        }
      } else if (typeof data[key] === schema[key].type) {
        value[key] = data[key];
      } else {
        if (path) {
          errors.push(`${path}${key} should be a ${schema[key].type}.`);
        } else {
          errors.push(`${key} should be a ${schema[key].type}.`);
        }
      }
    } else {
      if (path) {
        errors.push(`${path}${key} is not needed.`);
      } else {
        errors.push(`${key} is not needed.`);
      }
    }
  }
  return { value, errors };
};

export const patchData = (
  data: any = {},
  update: any = {},
  updatedData: any = {}
) => {
  for (const key in update) {
    if (Array.isArray(update[key])) {
      if (update[key].length == 0) {
        updatedData[key] = [];
      } else if (typeof update[key][0] === "object") {
        const arr =
          data[key].length > update[key].length ? data[key] : update[key];
        for (let index in arr) {
          updatedData[key][index] = {
            ...(updatedData[key][index] ?? {}),
            ...patchData(
              data[key][index],
              update[key][index],
              data[key][index]
            ),
          };
        }
      } else {
        updatedData[key] = update[key];
      }
    } else if (typeof update[key] == "object") {
      updatedData[key] = {
        ...(updatedData[key] ?? {}),
        ...patchData(data[key], update[key], data[key]),
      };
    } else {
      updatedData[key] = update[key];
    }
  }
  return updatedData;
};
