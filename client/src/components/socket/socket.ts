import { io, Socket } from "socket.io-client";


export const socket: Socket  = io('https://www.synapselms.online', {
    withCredentials: true, // This is important if you're dealing with cookies or credentials
  });