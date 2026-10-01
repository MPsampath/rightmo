"use client";

import { useEffect, useRef } from "react";
import { getEcho } from "@/lib/echo";

// Subscribes to `.eventName` on a public channel for the lifetime of the component.
export function useEcho<TPayload>(
  channelName: string,
  eventName: string,
  callback: (payload: TPayload) => void
): void {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const echo = getEcho();
    const channel = echo.channel(channelName);

    const handler = (payload: TPayload) => callbackRef.current(payload);
    channel.listen(`.${eventName}`, handler);

    return () => {
      channel.stopListening(`.${eventName}`, handler);
    };
  }, [channelName, eventName]);
}
