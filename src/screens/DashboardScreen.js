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
} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import DeviceInfo from 'react-native-device-info';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const {width, height} = Dimensions.get('window');

const DashboardScreen = () => {
  const [showDialog, setShowDialog] = useState(false);
  
  // Real device data states
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [batteryTemperature, setBatteryTemperature] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  
  // Animation values for progress indicators
  const batteryProgress = useRef(new Animated.Value(0)).current;
  const rangeProgress = useRef(new Animated.Value(0)).current;
  const temperatureProgress = useRef(new Animated.Value(0)).current;
  
  // Animation values for battery bars (dynamic based on battery level)
  const batteryBarAnimations = useRef(
    Array.from({length: 9}, () => new Animated.Value(0))
  ).current;

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
    // Start animations when battery level is loaded
    if (batteryLevel > 0) {
      animateProgress();
    }
  }, [batteryLevel, batteryTemperature]);

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
    const filledBars = getFilledBarsCount(batteryLevel);
    
    // Reset all bar animations
    batteryBarAnimations.forEach(anim => anim.setValue(0));
    
    // Animate battery bars filling from bottom based on real battery level
    const barAnimations = [];
    for (let i = 0; i < filledBars; i++) {
      barAnimations.push(
        Animated.timing(batteryBarAnimations[i], {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        })
      );
    }
    
    if (barAnimations.length > 0) {
      Animated.sequence(barAnimations).start();
    }

    // Animate other progress indicators with real data
    const estimatedRange = getEstimatedRange(batteryLevel);
    
    Animated.stagger(300, [
      Animated.timing(batteryProgress, {
        toValue: batteryLevel / 100,
        duration: 1500,
        useNativeDriver: false,
      }),
      Animated.timing(rangeProgress, {
        toValue: estimatedRange / 200,
        duration: 1500,
        useNativeDriver: false,
      }),
      Animated.timing(temperatureProgress, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleCardPress = (cardType) => {
    // Refresh data and restart animation for selected card
    fetchDeviceData();
    
    const estimatedRange = getEstimatedRange(batteryLevel);
    
    switch (cardType) {
      case 'battery':
        batteryProgress.setValue(0);
        Animated.timing(batteryProgress, {
          toValue: batteryLevel / 100,
          duration: 1000,
          useNativeDriver: false,
        }).start();
        break;
      case 'range':
        rangeProgress.setValue(0);
        Animated.timing(rangeProgress, {
          toValue: estimatedRange / 200,
          duration: 1000,
          useNativeDriver: false,
        }).start();
        break;
      case 'temperature':
        temperatureProgress.setValue(0);
        Animated.timing(temperatureProgress, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }).start();
        break;
    }
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
      const animIndex = i; // Animation index from bottom
      
      if (isFilled) {
        bars.push(
          <Animated.View 
            key={i}
            style={[
              styles.batterySegmentFilled, 
              {
                opacity: batteryBarAnimations[animIndex],
                transform: [{
                  scaleY: batteryBarAnimations[animIndex].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  })
                }]
              }
            ]} 
          />
        );
      } else {
        bars.push(<View key={i} style={styles.batterySegmentEmpty} />);
      }
    }
    
    return (
      <View style={styles.batteryVisual}>
        <View style={styles.batteryOuterContainer}>
          <View style={styles.batteryTopTab} />
          <View style={styles.batteryBodyWrapper}>
            <View style={styles.batteryBodyBorder}>
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
    // Create 20 bars representing temperature distribution
    const totalBars = 20;
    const filledBars = Math.round((batteryTemperature / 60) * totalBars);
    
    const bars = Array.from({length: totalBars}, (_, idx) => {
      const isFilled = idx < filledBars;
      // Create wave-like height pattern
      const baseHeight = 20 + Math.sin((idx / totalBars) * Math.PI * 2) * 15 + (idx / totalBars) * 30;
      
      let color;
      if (!isFilled) {
        color = '#E0E0E0';
      } else {
        // Gradient from green to red based on position
        const position = idx / filledBars;
        if (position < 0.3) color = '#4CAF50';
        else if (position < 0.5) color = '#8BC34A';
        else if (position < 0.7) color = '#FDD835';
        else if (position < 0.85) color = '#FF6F00';
        else color = '#E53935';
      }
      
      return {h: Math.round(baseHeight), c: color};
    });

    return (
      <View style={styles.tempMiniChartRow}>
        {bars.map((b, idx) => (
          <Animated.View
            key={String(idx)}
            style={[
              styles.tempMiniChartBar,
              {
                backgroundColor: b.c,
                height: temperatureProgress.interpolate({
                  inputRange: [0, (idx + 1) / bars.length, 1],
                  outputRange: [0, b.h, b.h],
                  extrapolate: 'clamp',
                }),
                opacity: temperatureProgress.interpolate({
                  inputRange: [0, (idx + 1) / bars.length],
                  outputRange: [0.3, 1],
                  extrapolate: 'clamp',
                }),
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#e7f0eb" translucent={false} />

      <View style={styles.headerArea}>
        <View style={styles.titleBar}>
          <View style={styles.redSquare} />
          <View style={styles.headerSpacer} />
          <View style={styles.headerRightActions}>
            <Image 
              source={require('../assets/Referral 2.png')} 
              style={styles.referralImage}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
              <BellIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.8} onPress={handleTitleBarPress}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.cardsRow}>
          {/* Battery Card */}
          <TouchableOpacity style={styles.batteryCard} onPress={() => handleCardPress('battery')} activeOpacity={0.9}>
            <Text style={styles.cardTitle}>Battery</Text>
            <BatteryIcon />
          </TouchableOpacity>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            <TouchableOpacity style={styles.rangeCard} onPress={() => handleCardPress('range')} activeOpacity={0.9}>
              <View style={styles.rangeHeaderRow}>
                <Text style={styles.cardTitle}>Estimated{'\n'}Range</Text>
                <View style={styles.rangeHeaderRight}>
                  <Text style={styles.rangeValueLarge}>{estimatedRange} <Text style={styles.rangeUnitSmall}>kms</Text></Text>
                </View>
              </View>
              <View style={styles.rangeContent}>
                <View style={styles.rangeProgressWrap}>
                  <CircularProgress progress={rangeProgress} size={110} strokeWidth={10} color="#cd4a4a" />
                  <View style={styles.rangeCenterText}>
                    <Text style={styles.rangeCenterTop}>{estimatedRange}/200</Text>
                    <Text style={styles.rangeCenterBottom}>kms</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.temperatureCard} onPress={() => handleCardPress('temperature')} activeOpacity={0.9}>
              <View style={styles.tempHeaderRow}>
                <Text style={styles.cardTitle}>Temperature</Text>
                <Text style={styles.temperatureValue}>
                  {batteryTemperature}<Text style={styles.temperatureUnit}>°C</Text>
                </Text>
              </View>
              <TemperatureMiniChart />
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
    paddingTop: 20,
    paddingBottom: 24,
    height: height * 0.2,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  redSquare: {
    width: 44,
    height: 44,
    backgroundColor: '#cd4a4a'
  },
  headerSpacer: {
    flex: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  referralImage: {
    width: 60,
    height: 60,
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#F5F5F5',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  // Battery Card - 38% width
  batteryCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    paddingBottom: 12,
    width: '38%',
    height: 380,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#8E8E8E',
    marginBottom: 8,
    fontWeight: '400',
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
    width: 36,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 1,
    zIndex: 1,
  },
  batteryBodyWrapper: {
    alignItems: 'center',
  },
  batteryBodyBorder: {
    width: 110,
    height: 280,
    borderWidth: 3,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    padding: 4,
  },
  batteryInnerContent: {
    flex: 1,
    gap: 4,
  },
  batterySegmentEmpty: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  batterySegmentFilled: {
    flex: 1,
    backgroundColor: '#cd4a4a',
    borderRadius: 4,
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
  // Right Column - 62% width
  rightColumn: {
    width: '62%',
    height: 380,
    gap: 10,
  },
  rangeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    paddingBottom: 18,
    marginRight: 16,
    height: 190,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
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
  rangeCenterBottom: {
    fontSize: 10,
    fontWeight: '400',
    color: '#9E9E9E',
    marginTop: -1,
  },
  temperatureCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    paddingBottom: 12,
    marginRight: 16,
    height: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
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
  temperatureUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#cd4a4a',
  },
  tempMiniChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 6,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tempMiniChartBar: {
    flex: 1,
    borderRadius: 1,
    maxWidth: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: width * 0.8,
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  dialogText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 8,
  },
  dialogButton: {
    backgroundColor: '#cd4a4a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  dialogButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;