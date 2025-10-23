import { useEffect, useRef } from "react";

export interface ExtensionMessage {
  direction: "FROM_EXTENSION";
  type: string;
  payload?: any;
}

export function useExtensionMessages(callback: (message: ExtensionMessage) => void) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      const data = event.data;
      if (data?.direction === "FROM_EXTENSION") {
        savedCallback.current(data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
}