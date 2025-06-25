import { getUserImages, registerUser, fillInfo, updateUser, confirmEmail, logUser, imageUpload, deleteUserImage, setProfilePicture, forgotPassword, resetPassword, logoutUser } from './authController.js';

import { recordProfileView, getAllUsers, getUser, blockUser, getBlockUser, unblockUser, signalUser } from './browseController.js';
import { likeUser, unlikeUser, dislikeUser, getLikes, getOtherLikes, getMatches, ConsultProfile, getViewlist, getConsultedUsers, getInteractedProfiles, getRelationshipStatus } from './matchController.js';
import { getMessages, sendMessage, getNotifications, sendNotification } from './socketController.js';


export {getUserImages, registerUser, fillInfo, confirmEmail, logUser, imageUpload, deleteUserImage, setProfilePicture, recordProfileView, likeUser,
    unlikeUser, getLikes, getAllUsers, getUser, updateUser, getOtherLikes, getMatches, getMessages,
    sendMessage, getNotifications, dislikeUser, sendNotification, blockUser , unblockUser, getBlockUser, signalUser , ConsultProfile, getViewlist , forgotPassword, resetPassword, getConsultedUsers, getInteractedProfiles, getRelationshipStatus, logoutUser };

export default {getUserImages, registerUser, fillInfo, confirmEmail, logUser, imageUpload, deleteUserImage, setProfilePicture, recordProfileView, likeUser,
    unlikeUser, getLikes, getAllUsers, getUser, updateUser, getOtherLikes, getMatches, getMessages, sendMessage,
    getNotifications, dislikeUser, sendNotification, blockUser, unblockUser, getBlockUser, signalUser , ConsultProfile, getViewlist, forgotPassword, resetPassword, getConsultedUsers, getInteractedProfiles, getRelationshipStatus, logoutUser };