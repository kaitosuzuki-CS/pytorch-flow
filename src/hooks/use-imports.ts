"use client";
import { ImportsContext, ImportsContextType } from "@/components/provider/importsProvider";
import { useContext } from "react";


export const useImports = (): ImportsContextType => {
  const context = useContext(ImportsContext);
  if (context === undefined) {
    throw new Error("useImports must be used within an AuthProvider");
  }
  return context;
};
