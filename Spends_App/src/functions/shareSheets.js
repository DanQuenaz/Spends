import { Share } from "react-native";

export const onShare = async (codigoPlanilha) => {
    try {
      const result = await Share.share({
        message:codigoPlanilha
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
};