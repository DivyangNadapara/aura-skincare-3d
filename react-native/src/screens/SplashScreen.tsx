import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Supports local video: place your 1080p clip in assets/intro.mp4 (or fallback to assets/solar.mp4)
let videoSource: any = null;
try {
  videoSource = require('../../assets/intro.mp4');
} catch (e) {
  try {
    videoSource = require('../../assets/solar.mp4');
  } catch (err) {}
}

const NAME = 'DIVYANG';
const ARIANA_PINK = '#FF4DA6';
const SAMSUNG_BLUE = '#2C7BFE';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  let player: any = null;
  if (videoSource) {
    try {
      player = useVideoPlayer(videoSource, (p) => {
        p.loop = true;
        p.muted = true;
        p.play();
      });
    } catch (err) {}
  }

  // Animation drivers
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const nameScale = useRef(new Animated.Value(0.85)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const beamWidth = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(1)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  // Staggered letter animations
  const letterAnims = useRef(
    NAME.split('').map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(35),
      scale: new Animated.Value(0.4),
    }))
  ).current;

  useEffect(() => {
    StatusBar.setHidden(true);

    // Subtle neon pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1.12,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 1. Reveal Name container
    Animated.timing(nameOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.spring(nameScale, {
      toValue: 1,
      tension: 65,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // 2. Stagger each letter of DIVYANG
    const letterSequence = NAME.split('').map((_, i) =>
      Animated.parallel([
        Animated.timing(letterAnims[i].opacity, {
          toValue: 1,
          duration: 400,
          delay: 300 + i * 80,
          useNativeDriver: true,
        }),
        Animated.spring(letterAnims[i].translateY, {
          toValue: 0,
          tension: 70,
          friction: 6,
          delay: 300 + i * 80,
          useNativeDriver: true,
        }),
        Animated.spring(letterAnims[i].scale, {
          toValue: 1,
          tension: 90,
          friction: 7,
          delay: 300 + i * 80,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.parallel(letterSequence).start();

    // 3. Sweep glowing line under DIVYANG
    Animated.timing(beamWidth, {
      toValue: SCREEN_WIDTH * 0.72,
      duration: 600,
      delay: 1000,
      useNativeDriver: false,
    }).start();

    // 4. Reveal Tagline
    Animated.timing(taglineOpacity, {
      toValue: 1,
      duration: 600,
      delay: 1300,
      useNativeDriver: true,
    }).start();

    // 5. Smooth fade out into main app
    const timer = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        StatusBar.setHidden(false);
        onFinish();
      });
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <StatusBar hidden />

      {/* ── 1. FULLSCREEN 1080P VIDEO LAYER (100% UNBLOCKED) ── */}
      {player && (
        <VideoView
          player={player}
          style={styles.fullscreenVideo}
          contentFit="cover"
          nativeControls={false}
        />
      )}

      {/* ── 2. SOFT VIGNETTE OVERLAY (Gives high contrast for the text without darkening video) ── */}
      <View style={styles.vignetteOverlay} pointerEvents="none" />

      {/* ── 3. FOREGROUND: DIVYANG HERO OVERLAY ── */}
      <Animated.View
        style={[
          styles.heroBox,
          {
            opacity: nameOpacity,
            transform: [{ scale: nameScale }],
          },
        ]}
      >
        <Text style={styles.badgeText}>SPECIAL EDITION</Text>

        {/* Staggered Name Letters */}
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

        {/* Glowing Beam Line */}
        <View style={styles.beamWrapper}>
          <Animated.View style={[styles.beamLine, { width: beamWidth }]} />
          <View style={styles.beamDot} />
        </View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          DAILY RHYTHM • SIGNATURE EDITION
        </Animated.Text>
      </Animated.View>

      {/* Bottom Glow Horizon */}
      <Animated.View
        style={[
          styles.ambientGlow,
          {
            transform: [{ scale: glowPulse }],
          },
        ]}
        pointerEvents="none"
      />
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
  fullscreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
  },
  heroBox: {
    alignItems: 'center',
    zIndex: 20,
    paddingHorizontal: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ARIANA_PINK,
    letterSpacing: 4,
    marginBottom: 8,
    textTransform: 'uppercase',
    textShadowColor: ARIANA_PINK,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  nameLetter: {
    fontSize: 58,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 8,
    textShadowColor: SAMSUNG_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 32,
  },
  beamWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 4,
    marginBottom: 16,
  },
  beamLine: {
    height: 2,
    backgroundColor: ARIANA_PINK,
    borderRadius: 1,
    shadowColor: ARIANA_PINK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 8,
  },
  beamDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginLeft: 3,
    shadowColor: ARIANA_PINK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 4,
  },
  ambientGlow: {
    position: 'absolute',
    bottom: -70,
    width: SCREEN_WIDTH * 0.9,
    height: 180,
    borderRadius: 120,
    backgroundColor: ARIANA_PINK,
    opacity: 0.15,
  },
});
