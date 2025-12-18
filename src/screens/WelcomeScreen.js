import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Image,
  Easing,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';
import StarburstSvg from '../assets/Group 76732.svg';

// eslint-disable-next-line no-unused-vars

const WelcomeScreen = ({navigation}) => {
  const {width, height} = useWindowDimensions();
  const isLandscape = width > height;
  
  const [giftBoxPressed, setGiftBoxPressed] = useState(false);
  const [displayCoins, setDisplayCoins] = useState(0);
  
  // Gift box animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
  // Starburst behind gift box animation
  const starburstScale = useRef(new Animated.Value(0)).current;
  const starburstOpacity = useRef(new Animated.Value(0)).current;
  
  // Start shake animation on mount
  useEffect(() => {
    startShakeAnimation();
  }, []);
  
  // Continuous gentle shake animation before tap
  const startShakeAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.delay(2000), // Pause between shakes
      ])
    ).start();
  };
  
  // Content reveal animations (all hidden initially)
  const congratsOpacity = useRef(new Animated.Value(0)).current;
  const congratsTranslate = useRef(new Animated.Value(-20)).current;
  const backgroundStarsOpacity = useRef(new Animated.Value(0)).current;
  const earnedSectionOpacity = useRef(new Animated.Value(0)).current;
  const earnedSectionTranslate = useRef(new Animated.Value(30)).current;
  const welcomeCardOpacity = useRef(new Animated.Value(0)).current;
  const welcomeCardTranslate = useRef(new Animated.Value(50)).current;
  


  const handleGiftBoxPress = () => {
    if (giftBoxPressed) return;
    setGiftBoxPressed(true);
    
    // Stop shake animation
    shakeAnim.stopAnimation();
    shakeAnim.setValue(0);
    
    // Simple pop animation for gift box
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    });

    // Simple starburst fade in
    Animated.timing(starburstOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(starburstScale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Show congratulations text
    Animated.timing(congratsOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(congratsTranslate, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Show background stars
    Animated.timing(backgroundStarsOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Show earned section after short delay
    setTimeout(() => {
      Animated.timing(earnedSectionOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(earnedSectionTranslate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      animateCoinsCounter();
    }, 200);

    // Show welcome card
    setTimeout(() => {
      Animated.timing(welcomeCardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(welcomeCardTranslate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 400);
  };



  const animateCoinsCounter = () => {
    let count = 0;
    const interval = setInterval(() => {
      count += 5;
      setDisplayCoins(count);
      if (count >= 100) {
        clearInterval(interval);
        setDisplayCoins(100);
      }
    }, 25);
  };

  const shake = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });



  // Starburst SVG behind gift box - using actual SVG asset for natural feel
  const StarburstBehind = () => {
    const svgWidth = isLandscape ? 350 : 450;
    const svgHeight = isLandscape ? 480 : 620;
    
    return (
      <Animated.View 
        style={[
          styles.starburstContainer,
          {
            opacity: starburstOpacity,
            transform: [{scale: starburstScale}],
          }
        ]}>
        <StarburstSvg width={svgWidth} height={svgHeight} />
      </Animated.View>
    );
  };



  const BackgroundStars = () => (
    <Animated.View style={[styles.backgroundContainer, {opacity: backgroundStarsOpacity}]}>
      <Svg width={width} height={height} style={styles.backgroundStars}>
        <Path d="M307.217 59.313C306.787 59.3218 306.38 59.3141 306 59.2921C306.414 59.2921 306.82 59.2992 307.217 59.313C313.175 59.1911 323.44 55.8863 324.899 43C324.373 48.2605 327.679 58.6166 344.708 59.2606C345.318 59.2774 345.887 59.2921 346.404 59.2921C345.824 59.2921 345.259 59.2815 344.708 59.2606C338.405 59.087 327.751 58.6901 324.899 72C324.582 67.8864 320.578 59.7779 307.217 59.313Z" fill="#FFB903"/>
        <Path d="M12.217 27.313C11.7873 27.3218 11.38 27.3141 11 27.2921C11.414 27.2921 11.8196 27.2992 12.217 27.313C18.1746 27.1911 28.4401 23.8863 29.8989 11C29.3728 16.2605 32.6787 26.6166 49.708 27.2606C50.3179 27.2774 50.8871 27.2921 51.4045 27.2921C50.8244 27.2921 50.259 27.2815 49.708 27.2606C43.4047 27.087 32.751 26.6901 29.8989 40C29.5824 35.8864 25.5785 27.7779 12.217 27.313Z" fill="#FFB903"/>
        <Path d="M0.755355 142.125C0.488642 142.131 0.235839 142.126 0 142.112C0.256982 142.112 0.508738 142.117 0.755355 142.125C4.45319 142.05 10.8249 139.998 11.7303 132C11.4038 135.265 13.4557 141.693 24.0257 142.093C24.4042 142.103 24.7575 142.112 25.0787 142.112C24.7186 142.112 24.3677 142.106 24.0257 142.093C20.1132 141.985 13.5006 141.739 11.7303 150C11.5339 147.447 9.04871 142.414 0.755355 142.125Z" fill="#FFB903"/>
        <Path d="M111.755 10.1253C111.489 10.1308 111.236 10.126 111 10.1124C111.257 10.1124 111.509 10.1167 111.755 10.1253C115.453 10.0496 121.825 7.99838 122.73 0C122.404 3.26514 124.456 9.69307 135.026 10.0928C135.404 10.1032 135.757 10.1124 136.079 10.1124C135.719 10.1124 135.368 10.1057 135.026 10.0928C131.113 9.98503 124.501 9.73867 122.73 18C122.534 15.4467 120.049 10.4139 111.755 10.1253Z" fill="#FFB903"/>
        <Path d="M72.7554 307.125C72.4886 307.131 72.2358 307.126 72 307.112C72.257 307.112 72.5087 307.117 72.7554 307.125C76.4532 307.05 82.8249 304.998 83.7303 297C83.4038 300.265 85.4557 306.693 96.0257 307.093C96.4042 307.103 96.7575 307.112 97.0787 307.112C96.7186 307.112 96.3677 307.106 96.0257 307.093C92.1132 306.985 85.5006 306.739 83.7303 315C83.5339 312.447 81.0487 307.414 72.7554 307.125Z" fill="#FFB903"/>
        <Path d="M270.755 259.125C270.489 259.131 270.236 259.126 270 259.112C270.257 259.112 270.509 259.117 270.755 259.125C274.453 259.05 280.825 256.998 281.73 249C281.404 252.265 283.456 258.693 294.026 259.093C294.404 259.103 294.757 259.112 295.079 259.112C294.719 259.112 294.368 259.106 294.026 259.093C290.113 258.985 283.501 258.739 281.73 267C281.534 264.447 279.049 259.414 270.755 259.125Z" fill="#FFB903"/>
      </Svg>
    </Animated.View>
  );

  // Dynamic styles for landscape
  const dynamicStyles = {
    content: {
      flexDirection: isLandscape ? 'row' : 'column',
      paddingTop: isLandscape ? 20 : 40,
      paddingHorizontal: isLandscape ? 40 : 0,
    },
    leftSection: {
      flex: isLandscape ? 1 : undefined,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightSection: {
      flex: isLandscape ? 1 : undefined,
      alignItems: 'center',
      justifyContent: 'center',
    },
    giftBoxImage: {
      width: isLandscape ? 150 : 200,
      height: isLandscape ? 150 : 200,
    },
    coinsText: {
      fontSize: isLandscape ? 52 : 68,
    },
    bottomSection: {
      paddingHorizontal: isLandscape ? 60 : 20,
      paddingBottom: isLandscape ? 20 : 40,
    },
  };

  const MainContent = () => (
    <>
      {/* Congratulations text - hidden initially */}
      <Animated.Text 
        style={[
          styles.congratsText, 
          isLandscape && styles.congratsTextLandscape,
          {
            opacity: congratsOpacity,
            transform: [{translateY: congratsTranslate}],
          }
        ]}>
        CONGRATULATIONS !
      </Animated.Text>
      
      <TouchableOpacity
        onPress={handleGiftBoxPress}
        activeOpacity={0.95}
        style={[styles.giftBoxTouchable, isLandscape && styles.giftBoxTouchableLandscape]}
        disabled={giftBoxPressed}>
        <View style={styles.giftBoxWrapper}>
          {/* Starburst behind gift box - shows on tap */}
          {giftBoxPressed && <StarburstBehind />}
          <Animated.View style={[styles.animatedGiftBox, {transform: [{scale: scaleAnim}, {rotate: shake}]}]}>
            <Image
              source={require('../../assets/no coin.png')}
              style={dynamicStyles.giftBoxImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
        {!giftBoxPressed && <Text style={styles.tapHint}>Tap to open!</Text>}
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.earnedSection,
          isLandscape && styles.earnedSectionLandscape,
          {opacity: earnedSectionOpacity, transform: [{translateY: earnedSectionTranslate}]}
        ]}>
        <Text style={[styles.earnedText, isLandscape && styles.earnedTextLandscape]}>You've earned</Text>
        <Text style={[styles.coinsText, dynamicStyles.coinsText]}>{displayCoins}</Text>
        <View style={styles.coinsRow}>
          <View style={styles.coinIcon} />
          <Text style={styles.coinsLabel}>Coins</Text>
        </View>
      </Animated.View>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#679D77" />
      <LinearGradient colors={['#679D77', '#A6D0B7']} style={styles.gradient} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
        <BackgroundStars />
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={[styles.scrollContent, isLandscape && styles.scrollContentLandscape]}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {isLandscape ? (
            <View style={[styles.content, dynamicStyles.content]}>
              <View style={dynamicStyles.leftSection}>
                <MainContent />
              </View>
            </View>
          ) : (
            <View style={[styles.content, dynamicStyles.content]}>
              <MainContent />
            </View>
          )}

          <Animated.View 
            style={[
              styles.bottomSection,
              dynamicStyles.bottomSection,
              {opacity: welcomeCardOpacity, transform: [{translateY: welcomeCardTranslate}]}
            ]}>
            <View style={[styles.welcomeCard, isLandscape && styles.welcomeCardLandscape]}>
              <Text style={styles.welcomeTitle}>Welcome Bonus!</Text>
              <Text style={styles.welcomeDescription}>
                Thanks for joining!{'\n'}Collect your coins and keep earning more coins
              </Text>
              <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Dashboard')}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  gradient: {flex: 1, position: 'relative'},
  scrollView: {flex: 1},
  scrollContent: {flexGrow: 1},
  scrollContentLandscape: {paddingVertical: 20},
  content: {flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 1},
  congratsText: {fontSize: 24, fontWeight: 'bold', color: '#2D5A3D', marginBottom: 20, textAlign: 'center'},
  congratsTextLandscape: {fontSize: 20, marginBottom: 15},
  giftBoxTouchable: {marginBottom: 20, alignItems: 'center'},
  giftBoxTouchableLandscape: {marginBottom: 15},
  giftBoxWrapper: {alignItems: 'center', justifyContent: 'center', position: 'relative'},
  animatedGiftBox: {alignItems: 'center', justifyContent: 'center', zIndex: 5},
  tapHint: {marginTop: 10, fontSize: 16, color: '#2D5A3D', fontWeight: '500', opacity: 0.8},
  starburstContainer: {position: 'absolute', alignItems: 'center', justifyContent: 'center', zIndex: 1},

  backgroundContainer: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0},
  backgroundStars: {position: 'absolute', top: 0, left: 0},
  earnedSection: {alignItems: 'center', marginBottom: 10},
  earnedSectionLandscape: {marginBottom: 5},
  earnedText: {fontSize: 16, color: '#2D5A3D', marginBottom: 6},
  earnedTextLandscape: {fontSize: 14, marginBottom: 4},
  coinsText: {fontWeight: 'bold', color: '#2D5A3D', marginBottom: 6},
  coinsRow: {flexDirection: 'row', alignItems: 'center'},
  coinIcon: {width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFB903', marginRight: 6},
  coinsLabel: {fontSize: 15, color: '#2D5A3D'},
  bottomSection: {zIndex: 1},
  welcomeCard: {backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8},
  welcomeCardLandscape: {padding: 20},
  welcomeTitle: {fontSize: 20, fontWeight: 'bold', color: '#2D5A3D', marginBottom: 10},
  welcomeDescription: {fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 20},
  nextButton: {backgroundColor: '#ed145b', paddingVertical: 14, borderRadius: 25, width: '100%'},
  nextButtonText: {color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center'},
});

export default WelcomeScreen;
