import { NotiConstants } from '../constants/noti.constants.js';

const NotiActions = {
  updateNotification,
  markAllNotificationsAsRead,
  newUnreadNotification,
};

function updateNotification() {
  return dispatch => {
    dispatch(_updateNotification());
  };
}

const _updateNotification = () => {
  return {
    type: NotiConstants.UPDATENOTIFICATION,
  };
};

function markAllNotificationsAsRead() {
  return dispatch => {
    dispatch(_markAllNotificationsAsRead());
  };
}

const _markAllNotificationsAsRead = () => {
  return {
    type: NotiConstants.READALLNOTIFICATION,
  };
};

function newUnreadNotification(count) {
  return dispatch => {
    dispatch(_newUnreadNotificatioon(count));
  };
}

const _newUnreadNotificatioon = count => {
  return {
    type: NotiConstants.UNREADNOTIFICATION,
    count: count,
  };
};

export default NotiActions;
