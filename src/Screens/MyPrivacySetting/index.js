import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useHelper } from "../../hooks/useHelper";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import colors from "../../utility/colors";
import SettingHeader from "../../components/containers/settingHeader";
import BasicPrivacySetting from "../../components/containers/BasicPrivacySetting";
import PrivacySettingContainer from "../../components/containers/PrivacySettingContainer";
import analytics from '@react-native-firebase/analytics';
import ProfileServices from '../../services/ProfileServices';

const MyPrivacySetting = (props) => {
  const dispatch = useDispatch();
  const { token, userData, settings } = useSelector(
    (store) => store.userReducer
  );

  const proMember = userData?.UserSetting?.isSubscribed;

  const { handleDisablePremium, handleStatusCode } = useHelper();
  const [premiumPrivacySetting, setPremiumPrivacySetting] = useState(proMember);

  const logAnalyticsEvent = async (eventName, params = {}) => {
    await analytics().logEvent(eventName, params);
  };

  const onToggleSwitch = (type, val) => {
    logAnalyticsEvent("privacy_setting_toggled", {
      setting_type: type,
      value: val,
    });

    switch (type) {
      case "Discovery Mode":
        dispatch({
          type: "USER_DISCOVERY_MODE",
          payload: val,
        });
        break;

      case "Hide my Age":
        dispatch({
          type: "USER_HIDE_AGE",
          payload: val,
        });
        break;

      case "Chupke Chupke":
        dispatch({
          type: "USER_CHUPKE_CHUPKE",
          payload: val,
        });
        break;

      case "Hide Live Status":
        dispatch({
          type: "USER_HIDE_LIVE_STATUS",
          payload: val,
        });
        break;

      case "Show message preview":
        dispatch({
          type: "USER_SHOW_MSG_PREV",
          payload: val,
        });
        break;

      default:
        return null;
    }
  };

  useEffect(() => {
    updateSetting();
  }, [settings]);

  const updateSetting = () => {
    let urlencoded = new URLSearchParams();

    urlencoded.append("isNotificationEnabled", settings.isNotificationEnabled);
    urlencoded.append("isDarkMode", settings.isDarkMode);
    urlencoded.append("discoveryMode", settings.discoveryMode);
    urlencoded.append("hideAge", settings.hideAge);
    urlencoded.append("chupkeChupke", settings.chupkeChupke);
    urlencoded.append("hideLiveStatus", settings.hideLiveStatus);
    urlencoded.append("showMessagePreview", settings.showMessagePreview);

    if (token != null) {
      ProfileServices.updateUserSettings(urlencoded, token)
        .then((res) => {
          handleStatusCode(res);
          if (res.data.status >= 200 && res.data.status <= 299) {
            logAnalyticsEvent("user_settings_updated", {
              success: true,
            });
          }
        })
        .catch((err) => {
          console.log("updateUserSettings err", err);
          logAnalyticsEvent("user_settings_update_failed", {
            error: err.message,
          });
        });
    }
  };

  const handleUpgrade = () => {
    logAnalyticsEvent("upgrade_clicked", {
      current_subscription: proMember,
    });

    if (!premiumPrivacySetting) {
      props.navigation.navigate("Paywall");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: "#ffffff" }}>
      <SettingHeader
        backPress={() => {
          logAnalyticsEvent("back_button_pressed", { screen: "MyPrivacySetting" });
          props.navigation.goBack();
        }}
        screenTitle={"My privacy settings"}
      />
      <ScrollView>
        <Text style={styles.basicPreferenceType}>Basic privacy settings</Text>
        <View style={styles.actionItemsView}>
          <BasicPrivacySetting
            toggleSwitch
            onToggleSwitch={onToggleSwitch}
            isOn={settings.discoveryMode}
            toggleViewStyle={{ marginTop: "4%" }}
            contStyle={styles.privacySettingStyle}
            toggleOptionTextStyle={{
              color: colors.mediumGrey,
            }}
            toggleOptionText={"Discovery Mode"}
            toggleOptionTaglineText={"Make your profile live"}
          />

          <View style={styles.horizontalLine}></View>

          <BasicPrivacySetting
            toggleSwitch
            onToggleSwitch={onToggleSwitch}
            isOn={settings.hideAge}
            contStyle={styles.privacySettingStyle}
            toggleOptionTextStyle={{
              color: colors.mediumGrey,
            }}
            toggleOptionText={"Hide my Age"}
            toggleOptionTaglineText={"Show or Hide Age"}
          />
        </View>

        <Text style={styles.basicPreferenceType}>Gold privacy settings</Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter-Regular",
            color: "#374151",
          }}
        >
          Gold member exclusive: Elevate your privacy experience.
        </Text>
        {
          premiumPrivacySetting == false ? (
            <TouchableOpacity
              onPress={handleUpgrade}
              style={{
                paddingHorizontal: "3%",
                backgroundColor: colors.primaryPink,
                elevation: 3,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: "2%",
                marginVertical: "1%",
                alignSelf: "center",
                borderRadius: 10,
                width: "100%",
                marginVertical: "3%",
              }}
            >
              <Text style={{ fontSize: 17, color: colors.white }}>
                Upgrade now to unlock
              </Text>
            </TouchableOpacity>
          ) : null
        }

        <View style={[styles.actionItemsView, { marginTop: "3%" }]}>
          <PrivacySettingContainer
            disabled={premiumPrivacySetting ? false : true}
            toggleSwitch
            onToggleSwitch={onToggleSwitch}
            toggleViewStyle={{ marginTop: "4%" }}
            contStyle={
              premiumPrivacySetting
                ? styles.privacySettingStyle
                : { color: colors.mediumGrey }
            }
            toggleOptionTextStyle={{
              color: premiumPrivacySetting ? "#374151" : colors.mediumGrey,
            }}
            isOn={settings.chupkeChupke}
            toggleOptionText={"Chupke Chupke"}
            toggleOptionTaglineText={
              "Only be shown to people you interacted to"
            }
          />
          <View style={styles.horizontalLine}></View>
          <PrivacySettingContainer
            contStyle={{
              color: premiumPrivacySetting
                ? colors.primaryBlue
                : colors.mediumGrey,
            }}
            disabled={premiumPrivacySetting ? false : true}
            toggleSwitch
            onToggleSwitch={onToggleSwitch}
            toggleOptionTextStyle={{
              color: premiumPrivacySetting ? "#374151" : colors.mediumGrey,
            }}
            isOn={settings.hideLiveStatus}
            toggleOptionText={"Hide Live Status"}
            toggleOptionTaglineText={
              "Enabling this will hide your online status"
            }
          />
          <View style={styles.horizontalLine}></View>

          <PrivacySettingContainer
            disabled={premiumPrivacySetting ? false : true}
            toggleSwitch
            onToggleSwitch={onToggleSwitch}
            toggleOptionTextStyle={{
              color: premiumPrivacySetting ? "#374151" : colors.mediumGrey,
            }}
            isOn={settings.showMessagePreview}
            toggleOptionText={"Show message preview"}
            toggleOptionTaglineText={
              "Show message preview on push notification"
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPrivacySetting;
