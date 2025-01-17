import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  Alert,
  Modal,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Auth } from "aws-amplify";
import { useDispatch, useSelector } from "react-redux";
import { CommonActions } from "@react-navigation/native";
import { SocketContext } from "../../context/SocketContext";
import { useHelper } from "../../hooks/useHelper";
import { version } from "../../../package.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserService } from "../../services";

import styles from "./styles";
import colors from "../../utility/colors";
import awsmobile from "../../aws-exports";
import ConnectyCube from "react-native-connectycube";
import HeaderContainer from "../../components/containers/headerContainer";
import BasicPrivacySetting from "../../components/containers/BasicPrivacySetting";
import LoginMethodModalOptions from "../../components/Modal/LoginMethodModalOptions";
import ProfileServices from "../../services/ProfileServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icons from "../../utility/icons";
import SettingHeader from "../../components/containers/settingHeader";
import FastImage from "react-native-fast-image";
import ActionBottomModal from "../../components/Modal/ActionBottomModal";
import InAppBrowser from "react-native-inappbrowser-reborn";
import analytics from "@react-native-firebase/analytics";

const ModalDataArray = [
  {
    id: 1,
    toggleName: "Facebook",
    iconName: "facebook",
    toggleStatus: "toggle",
  },
  {
    id: 2,
    toggleName: "Instagram",
    iconName: "instagram",
    toggleStatus: "toggle",
  },
  {
    id: 3,
    toggleName: "Instagram: Link IG feed to profile",
    iconName: "instagram",
    toggleStatus: "toggle",
  },
  {
    id: 4,
    toggleName: "Google",
    iconName: "google",
    toggleStatus: "toggle",
  },
  {
    id: 5,
    toggleName: "Phone",
    iconName: "phone-portrait-outline",
    toggleStatus: "editIcon",
  },
  {
    id: 6,
    toggleName: "Email Address",
    iconName: "email",
    toggleStatus: "editIcon",
  },
];

const MySetting = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [action, setAction] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const { handleStatusCode, handleDisablePremium } = useHelper();
  const { token, email, settings, userData } = useSelector(
    store => store.userReducer
  );
  const proMember = userData?.UserSetting?.isSubscribed;

  const onToggleSwitch = (type, val) => {
    switch (type) {
      case "Push Notification":
        dispatch({
          type: "USER_IS_NOTIFICATION",
          payload: val,
        });
        break;
      case "login Method":
        break;
      default:
        return false;
    }
  };

  const logOut = async () => {
    Alert.alert(
      "Logout",
      "Do you want to logout?",
      [
        {
          text: "No",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              // Log the logout event before performing logout actions
              await analytics().logEvent("logout", {
                email: email !== "" ? email : "Anonymous",
                phoneNumber:
                  userData?.mobileNumber !== ""
                    ? userData.mobileNumber
                    : "Anonymous",
              });

              // Call the UserService logout method with the token
              await UserService.logout(token);

              if (email !== "") {
                dispatch({ type: "USER_EMAIL", payload: "" });

                // Sign out from AWS Cognito
                await Auth.signOut().catch(err =>
                  console.log("auth signOut err:", err)
                );

                if (await InAppBrowser.isAvailable()) {
                  // Attempt to open the InAppBrowser for logout (code commented out as in original)
                  // const res = await InAppBrowser.openAuth(
                  //   https://${awsmobile.oauth.domain}/logout?client_id=${awsmobile.aws_user_pools_web_client_id}&logout_uri=${awsmobile.oauth.redirectSignOut},
                  //   awsmobile.oauth.redirectSignOut,
                  //   {
                  //     dismissButtonStyle: "cancel",
                  //     showTitle: false,
                  //     enableUrlBarHiding: true,
                  //     enableDefaultShare: false,
                  //   }
                  // );
                  // if (res.type == "cancel") {
                  //   // Handle cancel
                  // } else if (res.type == "success" && res.url) {
                  //   Linking.openURL(res.url);
                  // }
                }
              }

              // Clear user-related state
              dispatch({ type: "AUTH_TOKEN", payload: null });
              dispatch({ type: "AUTH_USER_STATUS", payload: null });
              dispatch({ type: "routeName", payload: "" });
              dispatch({ type: "USER_MOBILE_NO", payload: "" });

              // Clear AsyncStorage and reset navigation to the Welcome screen
              await AsyncStorage.clear();
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "WelcomeScreen" }],
                })
              );
            } catch (error) {
              console.log("Logout error:", error);

              // Log an error event in Firebase Analytics
              await analytics().logEvent("logout_error", {
                error: error.message,
              });
            }
          },
        },
      ],
      { cancelable: false }
    );
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
        .then(res => {
          handleStatusCode(res);
          if (res.data.status >= 200 && res.data.status <= 299) {
          }
        })
        .catch(err => console.log("updateUserSettings err", err));
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* <HeaderContainer
        goback={'arrow-back'}
        backButton
        Icon
        name={'setting'}
        gobackButtonPress={() => props.navigation.goBack()}
      /> */}
        <SettingHeader
          backPress={() => props.navigation.goBack()}
          screenTitle={"My settings"}
        />

        <View
          style={[
            styles.actionItemsView,
            {
              marginTop: "5%",
            },
          ]}
        >
          <BasicPrivacySetting
            toggleSwitch
            onToggleSwitch={onToggleSwitch}
            isOn={settings.isNotificationEnabled}
            toggleOptionText={"Push Notification"}
          />
          {/* <View style={styles.horizontalLine}></View>
          <BasicPrivacySetting
            toggleSwitch
            onToggleSwitch={onToggleSwitch}
            isOn={settings.isDarkMode}
            toggleOptionText={"Dark Mode"}
          /> */}
        </View>

        {proMember ? (
          <View
            style={[
              styles.actionItemsView,
              {
                marginTop: "5%",
              },
            ]}
          >
            <TouchableOpacity
              onPressIn={handleDisablePremium}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                // marginHorizontal: '5%',
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#374151",
                  fontFamily: "Inter-Medium",
                }}
              >
                Manage my subscription
              </Text>
              <TouchableOpacity>
                <FastImage
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                  source={require("../../assets/iconimages/settingarrow.png")}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              styles.actionItemsView,
              {
                marginTop: "5%",
                backgroundColor: "#D90368",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Paywall")}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#ffff",
                  fontFamily: "Inter-Medium",
                  fontWeight: "600",
                }}
              >
                Upgrade now to Rishta Auntie Gold
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* <View>
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            style={styles.modalContainerStyle}>
            <TouchableOpacity activeOpacity={1} style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={{
                    fontSize: 22,
                    color: colors.primaryPink,
                    fontFamily: 'Inter-Bold',
                    marginHorizontal: '3%',
                  }}>
                  Login Options
                </Text>
                {ModalDataArray.map(i => {
                  return (
                    <View key={i.id}>
                      {i.toggleStatus === 'toggle' ? (
                        <LoginMethodModalOptions
                          iconName={i.iconName}
                          loginOptionName={i.toggleName}
                          ToggleSwitchButton
                          ONPRESSTOGGLE={() => console.log('dtf', i.toggleName)}
                        />
                      ) : (
                        <LoginMethodModalOptions
                          iconName={i.iconName}
                          loginOptionName={i.toggleName}
                          editIconButton
                          ONPRESSTOGGLE={() => console.log('dtf', i.toggleName)}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View> */}

        {/* <View style={styles.horizontalLine} /> */}

        {/* <View>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Text
            style={{
              fontSize: 17,
              color: colors.primaryBlue,
              fontFamily: 'Inter-Bold',
              paddingVertical: '1%',
              paddingHorizontal: '2%',
              marginHorizontal: '5%',
            }}>
            Login Method
          </Text>
        </TouchableOpacity>

        <View
          style={{
            paddingVertical: '1%',
            paddingHorizontal: '2%',
            marginHorizontal: '5%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Icons.Zocial name={'facebook'} size={40} color={colors.darkBlue} />

          <BasicPrivacySetting
            toggleSwitch
            onToggleSwitch={() => setIsEnabled(!isEnabled)}
            isOn={isEnabled}
          />
        </View>

        <Text
          style={{
            fontSize: 12,
            color: colors.mediumGrey,
            marginHorizontal: '5%',
          }}>
          Unsync & use phone number login
        </Text>
      </View> */}

        {/* <Text
        style={{
          fontSize: 12,
          color: colors.mediumGrey,
          marginHorizontal: '5%',
          marginTop: '8%',
          alignSelf: 'center',
        }}>
        We Don't post anything to your social media
      </Text> */}
        <View style={{ marginTop: "5%" }}>
          <TouchableOpacity
            onPress={() => logOut()}
            style={[
              styles.buttonContainer,
              {
                backgroundColor: "#FDEDF1",
                borderRadius: 10,
                justifyContent: "flex-start",
                borderWidth: 0.5,
                paddingVertical: "5%",
                width: "100%",
              },
            ]}
          >
            <Icons.MaterialIcons name={"logout"} size={20} color={"#EF4770"} />
            <Text
              style={[
                styles.btnTitle,
                {
                  fontFamily: "Inter-SemiBold",
                  fontSize: 14,
                  color: "#EF4770",
                  left: 10,
                },
              ]}
            >
              {" "}
              Log Out{" "}
            </Text>
            <View
              style={{
                marginLeft: "70%",
              }}
            >
              <FastImage
                resizeMode="contain"
                style={{ width: 20, height: 20 }}
                source={require("../../assets/iconimages/settingarrow.png")}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: "5%" }}>
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              {
                backgroundColor: colors.white,
                width: "100%",
                borderRadius: 10,
                justifyContent: "flex-start",
                borderWidth: 0.5,
                paddingVertical: "5%",
              },
            ]}
            onPress={() => setAction(true)}
          >
            {/* <Icons.AntDesign
            name={'delete'}
            size={15}
            color={colors.primaryPink}
          /> */}
            <Text
              style={[
                styles.btnTitle,
                {
                  fontFamily: "Inter-SemiBold",
                  fontSize: 14,
                  color: colors.black,
                },
              ]}
            >
              Delete Account
            </Text>
            <View
              style={{
                marginLeft: "63%",
              }}
            >
              <FastImage
                resizeMode="contain"
                style={{ width: 20, height: 20 }}
                source={require("../../assets/iconimages/settingarrow.png")}
              />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {action ? (
        <ActionBottomModal
          deleteAcc
          user={{
            userId: null,
            userName: "",
          }}
          showToast
          toggle={action}
          setAction={setAction}
          onDismiss={() => setAction(false)}
        />
      ) : null}
    </>
  );
};

export default MySetting;
