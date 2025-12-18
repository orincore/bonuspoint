import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Modal,
  Image,
  Platform,
  ScrollView,
  useWindowDimensions,
  Easing,
} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import DeviceInfo from 'react-native-device-info';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const {width: screenWidth} = Dimensions.get('window');

const DashboardScreen = () => {
  const {width, height} = useWindowDimensions();
  const isLandscape = width > height;
  
  const [showDialog, setShowDialog] = useState(false);
  
  // Real device data states
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [batteryTemperature, setBatteryTemperature] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  
  // Animation values for progress indicators
  const batteryProgress = useRef(new Animated.Value(0)).current;
  const rangeProgress = useRef(new Animated.Value(0)).current;
  
  // Card entrance animations - opacity and slide
  const batteryCardOpacity = useRef(new Animated.Value(0)).current;
  const batteryCardSlide = useRef(new Animated.Value(20)).current;
  const rangeCardOpacity = useRef(new Animated.Value(0)).current;
  const rangeCardSlide = useRef(new Animated.Value(20)).current;
  const tempCardOpacity = useRef(new Animated.Value(0)).current;
  const tempCardSlide = useRef(new Animated.Value(20)).current;
  
  // Card press animations
  const batteryPressAnim = useRef(new Animated.Value(1)).current;
  const rangePressAnim = useRef(new Animated.Value(1)).current;
  const tempPressAnim = useRef(new Animated.Value(1)).current;
  
  // Header animation
  const headerOpacity = useRef(new Animated.Value(0)).current;

  // Fetch real device data
  const fetchDeviceData = async () => {
    try {
      // Get battery level (returns 0-1, we convert to percentage)
      const level = await DeviceInfo.getBatteryLevel();
      const levelPercent = Math.round(level * 100);
      setBatteryLevel(levelPercent);
      
      // Get charging status
      const charging = await DeviceInfo.isBatteryCharging();
      setIsCharging(charging);
      
      // Get battery temperature
      if (Platform.OS === 'android') {
        // Android: Get battery temperature from power state
        const powerState = await DeviceInfo.getPowerState();
        // Battery temperature is typically between 25-45°C
        setBatteryTemperature(Math.round(powerState.batteryTemperature || 35));
      } else {
        // iOS doesn't expose battery temperature, use estimate based on battery level
        // Higher battery usage typically means higher temperature
        const estimatedTemp = 28 + (levelPercent > 50 ? 5 : 0);
        setBatteryTemperature(estimatedTemp);
      }
    } catch (error) {
      console.log('Error fetching device data:', error);
      // Fallback values
      setBatteryLevel(29);
      setBatteryTemperature(35);
    }
  };

  useEffect(() => {
    // Fetch real device data on mount
    fetchDeviceData();
    
    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(fetchDeviceData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Start entrance animations on mount
    animateEntrance();
  }, []);

  useEffect(() => {
    // Start progress animations when battery level is loaded
    if (batteryLevel > 0) {
      animateProgress();
    }
  }, [batteryLevel, batteryTemperature]);

  // Professional staggered entrance animations
  const animateEntrance = () => {
    // Header fades in first
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    
    // Battery card - fade + slide up
    Animated.parallel([
      Animated.timing(batteryCardOpacity, {
        toValue: 1,
        duration: 400,
        delay: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(batteryCardSlide, {
        toValue: 0,
        duration: 400,
        delay: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    
    // Range card - fade + slide up (staggered)
    Animated.parallel([
      Animated.timing(rangeCardOpacity, {
        toValue: 1,
        duration: 400,
        delay: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(rangeCardSlide, {
        toValue: 0,
        duration: 400,
        delay: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    
    // Temperature card - fade + slide up (staggered)
    Animated.parallel([
      Animated.timing(tempCardOpacity, {
        toValue: 1,
        duration: 400,
        delay: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(tempCardSlide, {
        toValue: 0,
        duration: 400,
        delay: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Calculate how many bars should be filled based on battery percentage
  const getFilledBarsCount = (percent) => {
    // 9 total bars, calculate how many should be filled
    return Math.ceil((percent / 100) * 9);
  };

  // Calculate estimated range based on battery (assuming 200km max range)
  const getEstimatedRange = (percent) => {
    return Math.round((percent / 100) * 200);
  };

  const animateProgress = () => {
    // Smooth progress animations with easing
    const estimatedRange = getEstimatedRange(batteryLevel);
    
    Animated.timing(batteryProgress, {
      toValue: batteryLevel / 100,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    
    Animated.timing(rangeProgress, {
      toValue: estimatedRange / 200,
      duration: 1000,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  // Professional press animation for cards - subtle and smooth
  const animateCardPress = (pressAnim) => {
    Animated.sequence([
      Animated.timing(pressAnim, {
        toValue: 0.96,
        duration: 80,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pressAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCardPress = (cardType) => {
    // Simple press animation based on card type
    switch (cardType) {
      case 'battery':
        animateCardPress(batteryPressAnim);
        break;
      case 'range':
        animateCardPress(rangePressAnim);
        break;
      case 'temperature':
        animateCardPress(tempPressAnim);
        break;
    }
    // Refresh data
    fetchDeviceData();
  };

  const handleTitleBarPress = () => {
    setShowDialog(true);
  };

  const CircularProgress = ({progress, size = 120, strokeWidth = 8, color = '#ED145B'}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    
    return (
      <View style={{width: size, height: size}}>
        <Svg width={size} height={size} style={{transform: [{rotate: '-90deg'}]}}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E8E8E8"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={progress.interpolate({
              inputRange: [0, 1],
              outputRange: [circumference, 0],
            })}
            strokeLinecap="round"
          />
        </Svg>
      </View>
    );
  };

  const BatteryIcon = () => {
    const filledBars = getFilledBarsCount(batteryLevel);
    const totalBars = 9;
    
    // Create array of bars (from top to bottom)
    const bars = [];
    for (let i = totalBars - 1; i >= 0; i--) {
      const isFilled = i < filledBars;
      bars.push(
        <View 
          key={i}
          style={isFilled ? styles.batterySegmentFilled : styles.batterySegmentEmpty} 
        />
      );
    }
    
    return (
      <View style={styles.batteryVisual}>
        <View style={styles.batteryOuterContainer}>
          <View style={[styles.batteryTopTab, isLandscape && {width: 28}]} />
          <View style={styles.batteryBodyWrapper}>
            <View style={[styles.batteryBodyBorder, isLandscape && {height: dynamicStyles.batteryBodyBorder.height, width: dynamicStyles.batteryBodyBorder.width}]}>
              {/* Percentage at top of battery - real data */}
              <View style={styles.batteryPercentRow}>
                <Text style={styles.batteryPercentText}>
                  {batteryLevel}<Text style={styles.batteryPercentUnit}>%</Text>
                </Text>
                {isCharging && (
                  <Text style={styles.chargingIndicator}>⚡</Text>
                )}
              </View>
              
              <View style={styles.batteryInnerContent}>
                {bars}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const TemperatureMiniChart = () => {
    // Create bars representing temperature distribution
    const totalBars = isLandscape ? 24 : 20;
    const filledBars = Math.round((batteryTemperature / 60) * totalBars);
    
    const bars = Array.from({length: totalBars}, (_, idx) => {
      const isFilled = idx < filledBars;
      // Create smooth wave-like height pattern
      const progress = idx / totalBars;
      const baseHeight = 25 + Math.sin(progress * Math.PI * 2) * 15 + progress * 35;
      
      let color;
      if (!isFilled) {
        color = '#E8E8E8';
      } else {
        // Smooth gradient from green to red
        const position = idx / filledBars;
        if (position < 0.25) color = '#4CAF50';
        else if (position < 0.45) color = '#8BC34A';
        else if (position < 0.65) color = '#FDD835';
        else if (position < 0.82) color = '#FF9800';
        else color = '#E53935';
      }
      
      return {h: Math.round(baseHeight), c: color};
    });

    // Scale bar heights for landscape - fill available space
    const heightMultiplier = isLandscape ? 2.8 : 1;
    
    return (
      <View style={[styles.tempMiniChartRow, isLandscape && styles.tempMiniChartRowLandscape]}>
        {bars.map((b, idx) => (
          <View
            key={String(idx)}
            style={[
              styles.tempMiniChartBar,
              isLandscape && styles.tempMiniChartBarLandscape,
              {
                backgroundColor: b.c,
                height: b.h * heightMultiplier,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const BellIcon = ({color = '#3B3B3B'}) => (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5-6.7V3a2 2 0 0 0-4 0v1.3A7 7 0 0 0 5 11v5l-2 2v1h20v-1l-2-2Z"
        fill={color}
      />
    </Svg>
  );

  const estimatedRange = getEstimatedRange(batteryLevel);

  // Dynamic styles based on orientation - fully responsive
  const landscapeCardHeight = Math.min(height * 0.75, 300);
  const portraitCardHeight = 380;
  const cardHeight = isLandscape ? landscapeCardHeight : portraitCardHeight;
  const batteryBodyHeight = isLandscape ? landscapeCardHeight - 80 : 280;
  
  const dynamicStyles = {
    headerArea: {
      minHeight: isLandscape ? 56 : 100,
      paddingTop: isLandscape ? 8 : 20,
      paddingBottom: isLandscape ? 8 : 20,
    },
    mainContent: {
      paddingHorizontal: isLandscape ? 16 : 16,
      paddingTop: isLandscape ? 8 : 20,
      paddingBottom: 20,
    },
    cardsRow: {
      flexDirection: 'row',
      gap: isLandscape ? 10 : 14,
    },
    batteryCard: {
      width: isLandscape ? width * 0.2 : '38%',
      height: cardHeight,
    },
    rightColumn: {
      flex: 1,
      height: cardHeight,
      flexDirection: isLandscape ? 'row' : 'column',
      gap: isLandscape ? 10 : 10,
    },
    rangeCard: {
      flex: isLandscape ? 1 : undefined,
      height: isLandscape ? cardHeight : 190,
    },
    temperatureCard: {
      flex: isLandscape ? 1 : undefined,
      height: isLandscape ? cardHeight : 180,
    },
    batteryBodyBorder: {
      height: batteryBodyHeight,
      width: isLandscape ? 90 : 110,
    },
    circularProgress: {
      size: isLandscape ? Math.min(landscapeCardHeight * 0.5, 120) : 110,
    },
    tempChartHeight: {
      height: isLandscape ? landscapeCardHeight - 60 : 100,
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#e7f0eb" translucent={false} />

      {/* Scrollable content including header */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header inside ScrollView for landscape scrolling */}
        <Animated.View style={[styles.headerArea, dynamicStyles.headerArea, {opacity: headerOpacity}]}>
          <View style={[styles.titleBar, isLandscape && styles.titleBarLandscape]}>
            <View style={[styles.redSquare, isLandscape && styles.redSquareLandscape]} />
            <View style={styles.headerSpacer} />
            <View style={styles.headerRightActions}>
              <Image 
                source={require('../assets/Referral 2.png')} 
                style={[styles.referralImage, isLandscape && styles.referralImageLandscape]}
                resizeMode="contain"
              />
              <TouchableOpacity style={[styles.iconButton, isLandscape && styles.iconButtonLandscape]} activeOpacity={0.7}>
                <BellIcon />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconButton, isLandscape && styles.iconButtonLandscape]} activeOpacity={0.7} onPress={handleTitleBarPress}>
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        {/* Main Content */}
        <View style={[styles.mainContent, dynamicStyles.mainContent]}>
          <View style={[styles.cardsRow, dynamicStyles.cardsRow]}>
            {/* Battery Card */}
            <Animated.View
              style={[
                dynamicStyles.batteryCard,
                {
                  opacity: batteryCardOpacity,
                  transform: [
                    {translateY: batteryCardSlide},
                    {scale: batteryPressAnim},
                  ],
                },
              ]}>
              <TouchableOpacity 
                style={[styles.batteryCard, {width: '100%', height: '100%'}]} 
                onPress={() => handleCardPress('battery')} 
                activeOpacity={1}
              >
                <Text style={[styles.cardTitle, isLandscape && styles.cardTitleLandscape]}>Battery</Text>
                <BatteryIcon />
              </TouchableOpacity>
            </Animated.View>

            {/* Right Column */}
            <View style={[styles.rightColumn, dynamicStyles.rightColumn]}>
              {/* Range Card */}
              <Animated.View
                style={[
                  dynamicStyles.rangeCard,
                  {
                    opacity: rangeCardOpacity,
                    transform: [
                      {translateY: rangeCardSlide},
                      {scale: rangePressAnim},
                    ],
                  },
                ]}>
                <TouchableOpacity 
                  style={[styles.rangeCard, {height: '100%'}]} 
                  onPress={() => handleCardPress('range')} 
                  activeOpacity={1}
                >
                  <View style={styles.rangeHeaderRow}>
                    <Text style={[styles.cardTitle, isLandscape && styles.cardTitleLandscape]}>Estimated{'\n'}Range</Text>
                    <View style={styles.rangeHeaderRight}>
                      <Text style={[styles.rangeValueLarge, isLandscape && styles.rangeValueLandscape]}>{estimatedRange} <Text style={styles.rangeUnitSmall}>kms</Text></Text>
                    </View>
                  </View>
                  <View style={styles.rangeContent}>
                    <View style={[styles.rangeProgressWrap, {width: dynamicStyles.circularProgress.size, height: dynamicStyles.circularProgress.size}]}>
                      <CircularProgress progress={rangeProgress} size={dynamicStyles.circularProgress.size} strokeWidth={isLandscape ? 6 : 8} color="#cd4a4a" />
                      <View style={styles.rangeCenterText}>
                        <Text style={[styles.rangeCenterTop, isLandscape && styles.rangeCenterTopLandscape]}>{estimatedRange}/200</Text>
                        <Text style={[styles.rangeCenterBottom, isLandscape && styles.rangeCenterBottomLandscape]}>kms</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>

              {/* Temperature Card */}
              <Animated.View
                style={[
                  dynamicStyles.temperatureCard,
                  {
                    opacity: tempCardOpacity,
                    transform: [
                      {translateY: tempCardSlide},
                      {scale: tempPressAnim},
                    ],
                  },
                ]}>
                <TouchableOpacity 
                  style={[styles.temperatureCard, {height: '100%'}]} 
                  onPress={() => handleCardPress('temperature')} 
                  activeOpacity={1}
                >
                  <View style={styles.tempHeaderRow}>
                    <Text style={[styles.cardTitle, isLandscape && styles.cardTitleLandscape]}>Temperature</Text>
                    <Text style={[styles.temperatureValue, isLandscape && styles.temperatureValueLandscape]}>
                      {batteryTemperature}<Text style={styles.temperatureUnit}>°C</Text>
                    </Text>
                  </View>
                  <TemperatureMiniChart />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Dialog Modal */}
      <Modal
        visible={showDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDialog(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowDialog(false)}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Menu Options</Text>
            <Text style={styles.dialogText}>Settings</Text>
            <Text style={styles.dialogText}>Profile</Text>
            <Text style={styles.dialogText}>Help</Text>
            <TouchableOpacity
              style={styles.dialogButton}
              onPress={() => setShowDialog(false)}>
              <Text style={styles.dialogButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerArea: {
    backgroundColor: '#e7f0eb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  titleBarLandscape: {
    paddingTop: 6,
    paddingHorizontal: 16,
  },
  redSquare: {
    width: 44,
    height: 44,
    backgroundColor: '#cd4a4a',
    borderRadius: 8,
  },
  redSquareLandscape: {
    width: 38,
    height: 38,
    borderRadius: 6,
  },
  headerSpacer: {
    flex: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  referralImage: {
    width: 60,
    height: 60,
  },
  referralImageLandscape: {
    width: 40,
    height: 40,
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconButtonLandscape: {
    width: 38,
    height: 38,
    borderRadius: 12,
  },
  menuLine: {
    width: 18,
    height: 2,
    backgroundColor: '#666',
    marginVertical: 2,
    borderRadius: 1,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  // Battery Card
  batteryCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 14,
    color: '#8E8E8E',
    marginBottom: 8,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  cardTitleLandscape: {
    fontSize: 12,
    marginBottom: 6,
  },
  batteryVisual: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batteryOuterContainer: {
    alignItems: 'center',
  },
  batteryTopTab: {
    width: 40,
    height: 10,
    backgroundColor: '#EBEBEB',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: -2,
    zIndex: 1,
  },
  batteryBodyWrapper: {
    alignItems: 'center',
  },
  batteryBodyBorder: {
    width: 110,
    height: 280,
    borderWidth: 3,
    borderColor: '#EBEBEB',
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    padding: 6,
  },
  batteryInnerContent: {
    flex: 1,
    gap: 5,
  },
  batterySegmentEmpty: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  batterySegmentFilled: {
    flex: 1,
    backgroundColor: '#cd4a4a',
    borderRadius: 5,
  },
  batteryPercentRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  batteryPercentText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  batteryPercentUnit: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '800',
  },
  chargingIndicator: {
    fontSize: 14,
    marginTop: 2,
  },
  // Right Column
  rightColumn: {
    gap: 10,
  },
  rangeCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    paddingBottom: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
  },
  rangeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  rangeHeaderRight: {
    alignItems: 'flex-end',
  },
  rangeValueLarge: {
    fontSize: 25,
    fontWeight: '500',
    color: '#1E1E1E',
    lineHeight: 44,
    letterSpacing: -1,
  },
  rangeValueLandscape: {
    fontSize: 20,
    lineHeight: 32,
  },
  rangeUnitSmall: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '400',
    marginTop: -2,
  },
  rangeContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 8,
  },
  rangeProgressWrap: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeCenterTop: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  rangeCenterTopLandscape: {
    fontSize: 12,
  },
  rangeCenterBottom: {
    fontSize: 10,
    fontWeight: '400',
    color: '#9E9E9E',
    marginTop: -1,
  },
  rangeCenterBottomLandscape: {
    fontSize: 8,
  },
  temperatureCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    paddingBottom: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
  },
  tempHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  temperatureValue: {
    fontSize: 25,
    fontWeight: '500',
    color: '#cd4a4a',
    letterSpacing: -1,
  },
  temperatureValueLandscape: {
    fontSize: 20,
  },
  temperatureUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#cd4a4a',
  },
  tempMiniChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tempMiniChartRowLandscape: {
    flex: 1,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  tempMiniChartBar: {
    flex: 1,
    borderRadius: 2,
    marginHorizontal: 1.5,
    maxWidth: 8,
  },
  tempMiniChartBarLandscape: {
    borderRadius: 3,
    marginHorizontal: 2,
    maxWidth: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 28,
    width: screenWidth * 0.8,
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 12,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1E1E1E',
    letterSpacing: -0.3,
  },
  dialogText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
    fontWeight: '400',
  },
  dialogButton: {
    backgroundColor: '#cd4a4a',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
    shadowColor: '#cd4a4a',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dialogButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default DashboardScreen;