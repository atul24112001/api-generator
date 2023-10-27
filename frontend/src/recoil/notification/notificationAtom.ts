import { atom } from "recoil";

type Message = {
  text: string;
  type: "error" | "success";
};

type NotificationType = {
  notifications: Message[];
};

const NotificationState = atom<NotificationType>({
  key: "NOTIFICATION_STATE",
  default: {
    notifications: [],
  },
});

export default NotificationState;
