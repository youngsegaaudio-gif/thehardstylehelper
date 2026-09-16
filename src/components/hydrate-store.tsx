import { useEffect } from "react";
import { useTrack } from "@/lib/store";

export function HydrateStore() {
  useEffect(() => {
    void useTrack.persist.rehydrate();
  }, []);
  return null;
}
