// src/context/auth/AuthContext.ts
import { createContext } from "react";
import { AuthContextType } from "@/types/auth/auth.types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
