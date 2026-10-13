import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NAME = 'DIVYANG';
const SAMSUNG_BLUE = '#2C7BFE';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // One animated value per letter
  const letterAnims = useRef(
    NAME.split('').map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(40),
      scale: new Animated.Value(0.6),
    }))
  ).current;

  // Glow line width (sweeps across under the name)
  const glowLineWidth = useRef(new Animated.Value(0)).current;

  // Tagline below
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(16)).current;

  // Dot pulse beneath glow line
  const dotScale = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;

  // Full screen fade out at end
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setHidden(true);

    const LETTER_STAGGER = 80;   // ms between each letter appearing
    const LETTER_DURATION = 500; // ms for each letter animation

    // Animate each letter sequentially with stagger
    const letterSequence = NAME.split('').map((_, i) =>
      Animated.parallel([
        Animated.timing(letterAnims[i].opacity, {
          toValue: 1,
          duration: LETTER_DURATION,
          delay: i * LETTER_STAGGER,
          useNativeDriver: true,
        }),
        Animated.spring(letterAnims[i].translateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          delay: i * LETTER_STAGGER,
          useNativeDriver: true,
        }),
        Animated.spring(letterAnims[i].scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          delay: i * LETTER_STAGGER,
          useNativeDriver: true,
        }),
      ])
    );

    const totalLetterDuration = NAME.length * LETTER_STAGGER + LETTER_DURATION;

    // Glow line sweep after letters appear
    const glowLine = Animated.timing(glowLineWidth, {
      toValue: SCREEN_WIDTH * 0.65,
      duration: 500,
      delay: totalLetterDuration + 100,
      useNativeDriver: false,
    });

    // Dot burst
    const dotAnim = Animated.parallel([
      Animated.spring(dotScale, {
        toValue: 1,
        tension: 120,
        friction: 6,
        delay: totalLetterDuration + 500,
        useNativeDriver: true,
      }),
      Animated.timing(dotOpacity, {
        toValue: 1,
        duration: 200,
        delay: totalLetterDuration + 500,
        useNativeDriver: true,
      }),
    ]);

    // Tagline fade in
    const tagline = Animated.parallel([
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        delay: totalLetterDuration + 600,
        useNativeDriver: true,
      }),
      Animated.timing(taglineTranslateY, {
        toValue: 0,
        duration: 600,
        delay: totalLetterDuration + 600,
        useNativeDriver: true,
      }),
    ]);

    // Fade out entire screen
    const fadeOut = Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 600,
      delay: totalLetterDuration + 1600,
      useNativeDriver: true,
    });

    Animated.sequence([
      Animated.parallel([...letterSequence, glowLine, dotAnim, tagline]),
      fadeOut,
    ]).start(() => {
      StatusBar.setHidden(false);
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <StatusBar hidden />

      {/* Background ambient glow */}
      <View style={styles.ambientGlow} />

      {/* Main content */}
      <View style={styles.content}>

        {/* NAME letters */}
        <View style={styles.nameRow}>
          {NAME.split('').map((letter, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.nameLetter,
                {
                  opacity: letterAnims[i].opacity,
                  transform: [
                    { translateY: letterAnims[i].translateY },
                    { scale: letterAnims[i].scale },
                  ],
                },
              ]}
            >
              {letter}
            </Animated.Text>
          ))}
        </View>

        {/* Glow sweep line */}
        <View style={styles.glowLineContainer}>
          <Animated.View style={[styles.glowLine, { width: glowLineWidth }]} />
          {/* Dot at end of line */}
          <Animated.View
            style={[
              styles.glowDot,
              {
                opacity: dotOpacity,
                transform: [{ scale: dotScale }],
              },
            ]}
          />
        </View>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslateY }],
            },
          ]}
        >
          Daily Rhythm
        </Animated.Text>
      </View>

      {/* Bottom signature dot */}
      <Animated.View style={[styles.bottomDot, { opacity: taglineOpacity }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: SAMSUNG_BLUE,
    opacity: 0.06,
    top: '30%',
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  nameLetter: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 8,
    textShadowColor: SAMSUNG_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  glowLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 3,
    marginBottom: 20,
  },
  glowLine: {
    height: 2,
    backgroundColor: SAMSUNG_BLUE,
    borderRadius: 1,
    shadowColor: SAMSUNG_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  glowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SAMSUNG_BLUE,
    marginLeft: 3,
    shadowColor: SAMSUNG_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  bottomDot: {
    position: 'absolute',
    bottom: 48,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: SAMSUNG_BLUE,
    shadowColor: SAMSUNG_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
});
