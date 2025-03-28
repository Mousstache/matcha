import { registerUser, fillInfo, updateUser, confirmEmail, logUser, imageUpload, } from './authController.js';
import {  recordProfileView, getAllUsers, getUser, blockUser, getBlockUser, unblockUser } from './browseController.js';
import { likeUser, unlikeUser, dislikeUser, getLikes, getOtherLikes, getMatches, } from './matchController.js';
import { getMessages, sendMessage, getNotifications, sendNotification } from './socketController.js';


export { registerUser, fillInfo, confirmEmail, logUser, imageUpload, recordProfileView, likeUser,
    unlikeUser, getLikes, getAllUsers, getUser, updateUser, getOtherLikes, getMatches, getMessages,
    sendMessage, getNotifications, dislikeUser, sendNotification, blockUser , unblockUser, getBlockUser };

export default { registerUser, fillInfo, confirmEmail, logUser, imageUpload, recordProfileView, likeUser,
    unlikeUser, getLikes, getAllUsers, getUser, updateUser, getOtherLikes, getMatches, getMessages, sendMessage,
    getNotifications, dislikeUser, sendNotification, blockUser, unblockUser, getBlockUser  };

