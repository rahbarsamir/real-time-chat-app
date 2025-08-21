import { io } from "socket.io-client";


export const socket = io(`ws://10.1.4.21:3001`, {
  transports: ["websocket"],
});
