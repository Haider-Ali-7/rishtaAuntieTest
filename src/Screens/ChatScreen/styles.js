import {StyleSheet} from 'react-native';
import {ios, android, windowWidth, windowHeight} from '../../utility/size';
import colors from '../../utility/colors';

export default StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  receivingmessage: {
    maxWidth: '100%',
    backgroundColor: colors.white,
    paddingVertical: '3%',
    elevation: 5,
    alignItems: 'center',
    marginHorizontal: '3%',
    paddingHorizontal: '2%',
    borderRadius: 10,
  },
  sendingmessage: {
    marginVertical: '3%',
    maxWidth: '70%',
    backgroundColor: colors.darkBlue,
    paddingVertical: '3%',
    elevation: 5,
    alignItems: 'center',
    marginHorizontal: '3%',
    paddingHorizontal: '2%',
    borderRadius: 10,
  },
  image: {
    width: 37,
    height: 37,
    borderRadius: 40 / 2,
  },
  status: {
    backgroundColor: colors.blazingGreen,
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    position: 'absolute',
    right: -1,
    top: 4,
  },
  receivingText: {
    fontSize: 17,
    paddingHorizontal: '4%',
    color: colors.black,
  },
  sendingText: {
    fontSize: 17,
    paddingHorizontal: '4%',
    color: colors.white,
  },
  imageMessageContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
  },
  bottomContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: '2%',
    marginBottom: '1%',
  },
  inputContainer: {
    borderRadius: 16,
    // borderWidth: 1,
    // borderColor: colors.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: ios ? '2%' : '1%',
    backgroundColor: colors.msgGrey,
    paddingHorizontal: '3%',
  },
  replyInputContainer: {
    borderRadius: 25,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  input: {
    color: colors.black,
    fontSize: 14,
    flex: 1,
    padding: 8,
    fontFamily: 'Inter-Regular',
  },
  replyContainer: {
    backgroundColor: colors.white,
    // borderWidth: 1,
    // borderColor: colors.primaryBlue,
    borderRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    minHeight: 70,
    maxHeight: 112,
    width: ios ? windowWidth * 0.95 - 50 : windowWidth * 0.95 - 50 + 0.1,
    bottom: -3,
    marginHorizontal: '2%',
    padding: '2%',
  },
  replyInnerContainer: {
    backgroundColor: colors.softGrey,
    borderLeftWidth: 5,
    borderLeftColor: colors.primaryBlue,
    borderRadius: 16,
    justifyContent: 'space-between',
    padding: '2%',
  },
  replyYou: {
    fontSize: 16,
    color: colors.primaryBlue,
  },
  replyText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.mediumGrey,
  },
  // MIC
  micContainer: {
    marginLeft: '1%',
    backgroundColor: colors.primaryPink,
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '1.5%',
  },
  deletePauseContainer: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    backgroundColor: colors.primaryPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordTime: {
    marginLeft: '5%',
    fontSize: 16,
    color: colors.primaryBlue,
    fontFamily: 'Inter-Regular',
  },
  highlight: {
    backgroundColor: 'rgba(52, 183, 241, 0.5)',
    height: '97%',
    alignSelf: 'center',
    width: windowWidth,
    position: 'absolute',
    zIndex: 1,
    top: 0,
  },
  interactionContainer: {
    width: windowWidth * 0.8,
    padding: 12,
    backgroundColor: colors.greyWhite,
    alignSelf: 'center',
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 12,
  },
  avatar: {
    position: 'absolute',
    left: 20,
    top: 36,
  },
  interactionTxt: {
    textAlign: 'center',
    color: colors.textGrey1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  interactionImageContainer: {
    width: windowWidth * 0.4,
    height: windowWidth * 0.45,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 12,
  },
  video: {
    height: 190,
    width: '100%',
  },
  playBtn: {
    top: 80,
    zIndex: 1,
    position: 'absolute',
    alignSelf: 'center',
  },
  interactionImage: {width: '100%', height: '100%'},
  divider: {
    width: '70%',
    borderRadius: 3,
    marginTop: '5%',
    marginBottom: '3%',
  },
  comment: {
    fontSize: 14,
    color: colors.blackBlue,
    fontFamily: 'Inter-Medium',
  },
});
