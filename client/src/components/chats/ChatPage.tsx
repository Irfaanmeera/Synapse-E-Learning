import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Socket } from "socket.io-client";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { EnrolledCourse } from "../../interfaces/enrolledCourse";
import { Message } from "../../interfaces/Chat";
import { Send } from "@mui/icons-material";

interface SocketProps {
  course: EnrolledCourse;
  socket: Socket;
}

const ChatPage: React.FC<SocketProps> = ({ socket, course }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const user = useSelector((state: RootState) => state.user.user);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const courseId = course?.courseId?.id;

    if (courseId) {
      socket.emit("join-room", { courseId });
      console.log(`Joined room: ${courseId}`);
    }

    socket.emit("get-all-messages", { courseId });

    socket.on("get-course-response", (data) => {
      if (data?.courseId === courseId) {
        setMessages(data.messages || []);
      }
    });

    socket.on("messageResponse", (data) => {
      if (data?.courseId === course?.courseId?.id) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    });

    return () => {
      socket.off("get-course-response");
      socket.off("messageResponse");
    };
  }, [socket, course?.courseId?.id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    const courseId = course?.courseId?.id;

    if (newMessage.trim() && user?.name && courseId) {
      const messageData: Message = {
        name: user.name,
        message: newMessage,
        sender: user.id,
      };

      // Emit the message to the server
      socket.emit("message", {
        courseId: courseId,
        message: {
          name: user.name,
          message: newMessage,
          sender: user.id,
        },
      });

      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box className="w-full h-full flex flex-col rounded-sm">
      <Box className="flex flex-col flex-grow w-full bg-grey500 shadow-xl rounded-lg overflow-hidden">
        {/* Chat Body */}
        <Box
          ref={chatContainerRef}
          display="flex"
          flexDirection="column"
          flexGrow={1}
          padding={2}
          overflow="auto"
          style={{ maxHeight: "350px" }}
        >
          {messages.length > 0 ? (
            messages.map((message, index) =>
              message.name !== user?.name ? (
                <Stack
                  key={index}
                  direction="row"
                  spacing={2}
                  alignItems="flex-start"
                  sx={{ mt: 2, maxWidth: "85%" }}
                >
                  <Avatar sx={{ bgcolor: "gray" }} />
                  <Box>
                    <Paper
                      elevation={1}
                      sx={{
                        bgcolor: "whitesmoke",
                        padding: 2,
                        borderRadius: 2,
                        borderBottomLeftRadius: 0,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        fontStyle="italic"
                        pb={1}
                      >
                        {message.name}
                      </Typography>
                      <Typography variant="body2">{message.message}</Typography>
                    </Paper>
                  </Box>
                </Stack>
              ) : (
                <Stack
                  key={index}
                  direction="row"
                  spacing={2}
                  justifyContent="flex-end"
                  sx={{ mt: 1, maxWidth: "85%", ml: "auto" }}
                >
                  <Box>
                    <Paper
                      elevation={1}
                      sx={{
                        bgcolor: "#E1FFC7",
                        color: "black",
                        padding: 2,
                        borderRadius: 2,
                        borderBottomRightRadius: 0,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        fontStyle="italic"
                        pb={1}
                      ></Typography>
                      <Typography variant="body2">{message.message}</Typography>
                    </Paper>
                  </Box>
                  <Avatar sx={{ bgcolor: "gray" }} src={user?.image} />
                </Stack>
              )
            )
          ) : (
            <Typography variant="body2" color="textSecondary" align="center">
              No messages yet. Start the conversation!
            </Typography>
          )}
        </Box>

        {/* Chat Footer */}
        <Box
          component="form"
          display="flex"
          padding={2}
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <TextField
            fullWidth
            style={{ backgroundColor: "#ffff" }}
            size="medium"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ ml: 3, pl: 4, backgroundColor: "#594FDE" }}
          >
            <Send sx={{ mr: 1 }} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
