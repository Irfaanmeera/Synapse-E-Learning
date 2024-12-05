import { io, Socket } from "socket.io-client";


export const socket: Socket  = io('http://localhost:4000', {
    withCredentials: true, // This is important if you're dealing with cookies or credentials
  });