import Conversation from "../models/Conversations.js";
import Message from "../models/Messages.js";
import {
  getIO,
  users
} from "../socket/socket.js";

import User from "../models/Users.js";
import {
  lastSeen
} from "../socket/socket.js";


// CREATE CONVERSATION

export const createConversation =
  async (req, res) => {

    try {

      const senderId =
        req.user;

      const receiverId =
        req.params.receiverId;

      let conversation =
        await Conversation.findOne({
          members: {
            $all: [
              senderId,
              receiverId,
            ],
          },
        });

      if (!conversation) {

        conversation =
          await Conversation.create({
            members: [
              senderId,
              receiverId,
            ],
          });

      }

      return res.status(200).json({
        success: true,
        conversation,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }

  };


// GET USER CONVERSATIONS

export const getUserConversations =
  async (req, res) => {

    try {

      const userId =
        req.user;

      const conversations =
        await Conversation.find({
          members: userId,
        })
          .populate(
            "members",
            "username profilePic"
          )
          .sort({
            updatedAt: -1,
          });

      const conversationsWithUnread =
        await Promise.all(
          conversations.map(
            async (conversation) => {

              const unreadCount =
                await Message.countDocuments({
                  conversationId:
                    conversation._id,
                  sender: {
                    $ne: userId
                  },
                  isSeen: false
                });

              return {
                ...conversation.toObject(),
                unreadCount
              };

            }
          )
        );

      return res.status(200).json({
        success: true,
        conversations: conversationsWithUnread,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }

  };


// SEND MESSAGE

export const sendMessage =
  async (req, res) => {

    try {

      const senderId =
        req.user;

      const {
        text,
        sharedPost,
      } = req.body;

      const {
        conversationId,
      } = req.params;

      const message =
        await Message.create({
          conversationId,
          sender: senderId,
          text,
          sharedPost:
            sharedPost || null,
        });

      const populatedMessage =
        await Message.findById(
          message._id
        )
          .populate(
            "sender",
            "username profilePic"
          )
          .populate({
            path: "sharedPost",
            populate: {
              path: "user",
              select:
                "username profilePic",
            },
          });

      await Conversation.findByIdAndUpdate(
        conversationId,
        {
          lastMessage:
            sharedPost
              ? "Shared a post"
              : text,
        }
      );

      const conversation =
        await Conversation.findById(
          conversationId
        );

      const receiverId =
        conversation.members.find(
          (id) =>
            id.toString() !==
            senderId.toString()
        );

      const io =
        getIO();

      const receiverSocketId =
        users[
        receiverId.toString()
        ];

      if (receiverSocketId) {

        // REAL-TIME MESSAGE
        io.to(
          receiverSocketId
        ).emit(
          "new_message",
          populatedMessage
        );

        // RED DOT BADGE
        io.to(
          receiverSocketId
        ).emit(
          "new_message_badge"
        );

      }

      return res.status(201).json({
        success: true,
        message:
          populatedMessage,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }

  };


// GET MESSAGES

export const getMessages =
  async (req, res) => {

    try {

      const {
        conversationId,
      } = req.params;

      const messages =
        await Message.find({
          conversationId,
        })
          .populate(
            "sender",
            "username profilePic"
          )
          .populate({
            path: "sharedPost",
            populate: {
              path: "user",
              select:
                "username profilePic",
            },
          })
          .sort({
            createdAt: 1,
          });

      return res.status(200).json({
        success: true,
        messages,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }

  };


// MARK MESSAGES AS SEEN

export const markMessagesSeen =
  async (req, res) => {

    try {

      const {
        conversationId
      } = req.params;

      const unseenMessages =
        await Message.find({
          conversationId,
          sender: {
            $ne: req.user
          },
          isSeen: false
        });

      await Message.updateMany(
        {
          conversationId,
          sender: {
            $ne: req.user
          },
          isSeen: false
        },
        {
          isSeen: true
        }
      );

      const io =
        getIO();

      unseenMessages.forEach(
        (message) => {

          const senderId =
            message.sender.toString();

          if (
            users[senderId]
          ) {

            io.to(
              users[senderId]
            ).emit(
              "message_seen",
              {
                messageId:
                  message._id
              }
            );

          }

        }
      );

      return res.status(200).json({
        success: true
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };


// GET UNREAD COUNT

export const getUnreadMessageCount =
  async (req, res) => {

    try {

      const conversations =
        await Conversation.find({
          members: req.user
        });

      const conversationIds =
        conversations.map(
          convo => convo._id
        );

      const count =
        await Message.countDocuments({
          conversationId: {
            $in: conversationIds
          },
          sender: {
            $ne: req.user
          },
          isSeen: false
        });

      return res.status(200).json({
        success: true,
        count
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };

export const getChatHeader =
  async (req, res) => {

    try {

      const {
        conversationId
      } = req.params;

      const conversation =
        await Conversation.findById(
          conversationId
        );

      const otherUserId =
        conversation.members.find(
          (id) =>
            id.toString() !==
            req.user.toString()
        );

      const user =
        await User.findById(
          otherUserId
        ).select(
          "username profilePic"
        );

      const isOnline =
        !!users[
        otherUserId.toString()
        ];

      const userLastSeen =
        lastSeen[
        otherUserId.toString()
        ] || null;

      return res.status(200).json({
        success: true,
        user,
        isOnline,
        lastSeen:
          userLastSeen
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };