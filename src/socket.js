import { logger } from "./utils";
import { io } from "socket.io-client";
import { SOCKET_RECONNECT_DELAY_MS } from "@/features/shared/constants";

import ENV from "@/features/shared/config/env";

const SOCKET_URL = ENV.SOCKET_URL;

let socket = null;
let connecting = false;
export const getSocket = () => {
  if (socket && socket.connected) {
    return socket;
  }

  if (connecting) {
    logger.debug("Socket connection already in progress...");
    return socket;
  }

  connecting = true;

  socket = io(SOCKET_URL, {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: SOCKET_RECONNECT_DELAY_MS,
  });

  socket.on("connect", () => {
    logger.debug("Successfully connected to the server");
    socket.emit("listen");
    connecting = false;
  });

  socket.on("disconnect", () => {
    logger.debug("Disconnected from server");
    connecting = false;
  });

  socket.on("connect_error", (error) => {
    logger.error("Socket connection error:", error);
    connecting = false;
  });

  return socket;
};
