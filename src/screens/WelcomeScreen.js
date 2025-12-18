import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';

const {width, height} = Dimensions.get('window');

const WelcomeScreen = ({navigation}) => {
  const [giftBoxPressed, setGiftBoxPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const handleGiftBoxPress = () => {
    setGiftBoxPressed(true);
    
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotation animation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      {iterations: 3}
    ).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const StarIcon = ({style}) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" style={style}>
      <Path
        d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
        fill="#FFB903"
      />
    </Svg>
  );

  const GiftBox = () => (
    <Image
      source={require('../../assets/no coin.png')}
      style={styles.giftBoxImage}
      resizeMode="contain"
    />
  );

  const BackgroundStars = () => (
    <View style={styles.backgroundContainer}>
      <Svg width={width} height={height} style={styles.backgroundStars}>
        <Path d="M307.217 59.313C306.787 59.3218 306.38 59.3141 306 59.2921C306.414 59.2921 306.82 59.2992 307.217 59.313C313.175 59.1911 323.44 55.8863 324.899 43C324.373 48.2605 327.679 58.6166 344.708 59.2606C345.318 59.2774 345.887 59.2921 346.404 59.2921C345.824 59.2921 345.259 59.2815 344.708 59.2606C338.405 59.087 327.751 58.6901 324.899 72C324.582 67.8864 320.578 59.7779 307.217 59.313Z" fill="#FFB903"/>
        <Path d="M12.217 27.313C11.7873 27.3218 11.38 27.3141 11 27.2921C11.414 27.2921 11.8196 27.2992 12.217 27.313C18.1746 27.1911 28.4401 23.8863 29.8989 11C29.3728 16.2605 32.6787 26.6166 49.708 27.2606C50.3179 27.2774 50.8871 27.2921 51.4045 27.2921C50.8244 27.2921 50.259 27.2815 49.708 27.2606C43.4047 27.087 32.751 26.6901 29.8989 40C29.5824 35.8864 25.5785 27.7779 12.217 27.313Z" fill="#FFB903"/>
        <Path d="M0.755355 142.125C0.488642 142.131 0.235839 142.126 0 142.112C0.256982 142.112 0.508738 142.117 0.755355 142.125C4.45319 142.05 10.8249 139.998 11.7303 132C11.4038 135.265 13.4557 141.693 24.0257 142.093C24.4042 142.103 24.7575 142.112 25.0787 142.112C24.7186 142.112 24.3677 142.106 24.0257 142.093C20.1132 141.985 13.5006 141.739 11.7303 150C11.5339 147.447 9.04871 142.414 0.755355 142.125Z" fill="#FFB903"/>
        <Path d="M111.755 10.1253C111.489 10.1308 111.236 10.126 111 10.1124C111.257 10.1124 111.509 10.1167 111.755 10.1253C115.453 10.0496 121.825 7.99838 122.73 0C122.404 3.26514 124.456 9.69307 135.026 10.0928C135.404 10.1032 135.757 10.1124 136.079 10.1124C135.719 10.1124 135.368 10.1057 135.026 10.0928C131.113 9.98503 124.501 9.73867 122.73 18C122.534 15.4467 120.049 10.4139 111.755 10.1253Z" fill="#FFB903"/>
        <Path d="M72.7554 307.125C72.4886 307.131 72.2358 307.126 72 307.112C72.257 307.112 72.5087 307.117 72.7554 307.125C76.4532 307.05 82.8249 304.998 83.7303 297C83.4038 300.265 85.4557 306.693 96.0257 307.093C96.4042 307.103 96.7575 307.112 97.0787 307.112C96.7186 307.112 96.3677 307.106 96.0257 307.093C92.1132 306.985 85.5006 306.739 83.7303 315C83.5339 312.447 81.0487 307.414 72.7554 307.125Z" fill="#FFB903"/>
        <Path d="M270.755 259.125C270.489 259.131 270.236 259.126 270 259.112C270.257 259.112 270.509 259.117 270.755 259.125C274.453 259.05 280.825 256.998 281.73 249C281.404 252.265 283.456 258.693 294.026 259.093C294.404 259.103 294.757 259.112 295.079 259.112C294.719 259.112 294.368 259.106 294.026 259.093C290.113 258.985 283.501 258.739 281.73 267C281.534 264.447 279.049 259.414 270.755 259.125Z" fill="#FFB903"/>
        <Path d="M319.755 189.125C319.489 189.131 319.236 189.126 319 189.112C319.257 189.112 319.509 189.117 319.755 189.125C323.453 189.05 329.825 186.998 330.73 179C330.404 182.265 332.456 188.693 343.026 189.093C343.404 189.103 343.757 189.112 344.079 189.112C343.719 189.112 343.368 189.106 343.026 189.093C339.113 188.985 332.501 188.739 330.73 197C330.534 194.447 328.049 189.414 319.755 189.125Z" fill="#FFB903"/>
        <Path d="M1.59463 256.376C1.03157 256.387 0.497881 256.377 0 256.348C0.542516 256.348 1.074 256.358 1.59463 256.376C9.40118 256.216 22.8525 251.885 24.764 235C24.0747 241.893 28.4065 255.463 50.7208 256.307C51.52 256.329 52.2658 256.348 52.9438 256.348C52.1837 256.348 51.4428 256.334 50.7208 256.307C42.4613 256.08 28.5013 255.559 24.764 273C24.3494 267.61 19.1028 256.985 1.59463 256.376Z" fill="#FFB903"/>
        <Path d="M300.595 347.376C300.032 347.387 299.498 347.377 299 347.348C299.543 347.348 300.074 347.358 300.595 347.376C308.401 347.216 321.852 342.885 323.764 326C323.075 332.893 327.407 346.463 349.721 347.307C350.52 347.329 351.266 347.348 351.944 347.348C351.184 347.348 350.443 347.334 349.721 347.307C341.461 347.08 327.501 346.559 323.764 364C323.349 358.61 318.103 347.985 300.595 347.376Z" fill="#FFB903"/>
      </Svg>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#679D77" />
      <LinearGradient
        colors={['#679D77', '#A6D0B7']}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        
        {/* Background Stars */}
        <BackgroundStars />

        <View style={styles.content}>
          <Text style={styles.congratsText}>CONGRATULATIONS !</Text>
          
          <TouchableOpacity
            onPress={handleGiftBoxPress}
            activeOpacity={0.8}
            style={styles.giftBoxTouchable}>
            <Animated.View
              style={[
                styles.animatedGiftBox,
                {
                  transform: [
                    {scale: scaleAnim},
                    {rotate: spin},
                    {translateY: bounceAnim},
                  ],
                },
              ]}>
              <GiftBox />
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.earnedSection}>
            <Text style={styles.earnedText}>You've earned</Text>
            <Text style={styles.coinsText}>100</Text>
            <View style={styles.coinsRow}>
              <View style={styles.coinIcon} />
              <Text style={styles.coinsLabel}>Coins</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome Bonus!</Text>
            <Text style={styles.welcomeDescription}>
              Thanks for joining!{'\n'}
              Collect your coins and keep earning{'\n'}
              more coins
            </Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    zIndex: 1,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5A3D',
    marginBottom: 40,
    textAlign: 'center',
  },
  giftBoxTouchable: {
    marginBottom: 40,
  },
  animatedGiftBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backgroundStars: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.8,
  },
  giftBoxImage: {
    width: 210,
    height: 210,
  },
  earnedSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  earnedText: {
    fontSize: 16,
    color: '#2D5A3D',
    marginBottom: 8,
  },
  coinsText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#2D5A3D',
    marginBottom: 8,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFB903',
    marginRight: 8,
  },
  coinsLabel: {
    fontSize: 16,
    color: '#2D5A3D',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 1,
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5A3D',
    marginBottom: 12,
  },
  welcomeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  nextButton: {
    backgroundColor: '#ed145b',
    paddingHorizontal: 120,
    paddingVertical: 16,
    borderRadius: 25,
    width: '100%',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  star: {
    position: 'absolute',
  },
  star1: {
    top: 100,
    left: 40,
    transform: [{scale: 1.2}],
  },
  star2: {
    top: 150,
    right: 60,
    transform: [{scale: 0.8}],
  },
  star3: {
    top: 250,
    left: 20,
    transform: [{scale: 0.6}],
  },
  star4: {
    top: 300,
    right: 30,
    transform: [{scale: 1.0}],
  },
  star5: {
    bottom: 200,
    left: 50,
    transform: [{scale: 0.9}],
  },
  star6: {
    bottom: 150,
    right: 40,
    transform: [{scale: 1.1}],
  },
});

export default WelcomeScreen;
