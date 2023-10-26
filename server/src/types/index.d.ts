export interface User {
  id: number;
  email: string;
  token: string | null;
  freeRequests: number;
  secretKey?: boolean;
  subscriptionType: "free" | "standard" | "premium";
}

export interface Api {
  id: number;
  title: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: number;
  title: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      currentUser: User;
      targetApi?: Api | null;
      targetProject?: Project | null;
    }
  }
}
