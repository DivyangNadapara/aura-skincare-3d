import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ────────────────────────────────────────────────────────────
// NASA PUBLIC DOMAIN — Solar System Planets 4K visualization
// Source: Scientific Visualization Studio — svs.gsfc.nasa.gov
// Free to use with credit (US Govt / Public Domain)
// ────────────────────────────────────────────────────────────
const SOLAR_SYSTEM_VIDEO =
  'https://svs.gsfc.nasa.gov/vis/a030000/a030700/a030710/planets3x3_pluto_colorMercury_axis_tilt_1080p.mp4';

const NAME   = 'DIVYANG';
const BLUE   = '#2C7BFE';
const LETTER_STAGGER  = 90;   // ms between each letter
const LETTER_DURATION = 520;

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [videoReady, setVideoReady] = useState(false);

  // ── Letter animations ─────────────────────────────────────
  const letterAnims = useRef(
    NAME.split('').map(() => ({
      opacity:    new Animated.Value(0),
      translateY: new Animated.Value(50),
      scale:      new Animated.Value(0.4),
    }))
  ).current;

  // ── Glow line under name ───────────────────────────────────
  const glowWidth   = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  // ── Dot at line tip ────────────────────────────────────────
  const dotScale   = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;

  // ── Tagline ────────────────────────────────────────────────
  const taglineOpacity    = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(20)).current;

  // ── Video dark overlay (fades in to partially obscure video) ─
  const overlayOpacity = useRef(new Animated.Value(0.15)).current;

  // ── Full screen fade-out ───────────────────────────────────
  const screenOpacity = useRef(new Animated.Value(0)).current; // starts transparent

  // ── Screen fade-IN when video is ready ────────────────────
  const screenFadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setHidden(true);

    // Phase 1: fade in the whole screen once video loads
    Animated.timing(screenFadeIn, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Phase 2: stagger letters after a short pause
    const totalLetterTime = NAME.length * LETTER_STAGGER + LETTER_DURATION;
    const LETTER_START_DELAY = 600; // let video render first

    const letterAnim = NAME.split('').map((_, i) =>
      Animated.parallel([
        Animated.timing(letterAnims[i].opacity, {
          toValue: 1,
          duration: LETTER_DURATION,
          delay: LETTER_START_DELAY + i * LETTER_STAGGER,
          useNativeDriver: true,
        }),
        Animated.spring(letterAnims[i].translateY, {
          toValue: 0,
          tension: 70,
          friction: 7,
          delay: LETTER_START_DELAY + i * LETTER_STAGGER,
          useNativeDriver: true,
        }),
        Animated.spring(letterAnims[i].scale, {
          toValue: 1,
          tension: 90,
          friction: 8,
          delay: LETTER_START_DELAY + i * LETTER_STAGGER,
          useNativeDriver: true,
        }),
      ])
    );

    // Phase 3: glow line sweeps in after all letters
    const glowAnim = Animated.parallel([
      Animated.timing(glowWidth, {
        toValue: SCREEN_WIDTH * 0.62,
        duration: 600,
        delay: LETTER_START_DELAY + totalLetterTime + 100,
        useNativeDriver: false,
      }),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 300,
        delay: LETTER_START_DELAY + totalLetterTime + 100,
        useNativeDriver: false,
      }),
    ]);

    // Phase 4: dot pulse at end of line
    const dotAnim = Animated.parallel([
      Animated.spring(dotScale, {
        toValue: 1,
        tension: 130,
        friction: 5,
        delay: LETTER_START_DELAY + totalLetterTime + 600,
        useNativeDriver: true,
      }),
      Animated.timing(dotOpacity, {
        toValue: 1,
        duration: 200,
        delay: LETTER_START_DELAY + totalLetterTime + 600,
        useNativeDriver: true,
      }),
    ]);

    // Phase 5: tagline emerges
    const tagAnim = Animated.parallel([
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 700,
        delay: LETTER_START_DELAY + totalLetterTime + 750,
        useNativeDriver: true,
      }),
      Animated.timing(taglineTranslateY, {
        toValue: 0,
        duration: 700,
        delay: LETTER_START_DELAY + totalLetterTime + 750,
        useNativeDriver: true,
      }),
    ]);

    // Phase 6: darken overlay slightly as exit approaches
    const darkenAnim = Animated.timing(overlayOpacity, {
      toValue: 0.72,
      duration: 700,
      delay: LETTER_START_DELAY + totalLetterTime + 1800,
      useNativeDriver: false,
    });

    // Phase 7: full fade out → app
    const fadeOut = Animated.timing(screenFadeIn, {
      toValue: 0,
      duration: 600,
      delay: LETTER_START_DELAY + totalLetterTime + 2500,
      useNativeDriver: true,
    });

    Animated.parallel([
      ...letterAnim,
      glowAnim,
      dotAnim,
      tagAnim,
      darkenAnim,
      fadeOut,
    ]).start(({ finished }) => {
      if (finished) {
        StatusBar.setHidden(false);
        onFinish();
      }
    });
  }, []);

  return (
    <Animated.View style={[styles.root, { opacity: screenFadeIn }]}>
      <StatusBar hidden />

      {/* ── NASA Solar System Video (full-screen background) ── */}
      <Video
        source={{ uri: SOLAR_SYSTEM_VIDEO }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        onLoad={() => setVideoReady(true)}
        onError={() => setVideoReady(true)} // fallback — still show name
      />

      {/* ── Dark gradient overlay on top of video ── */}
      <Animated.View
        style={[
          styles.overlay,
          { opacity: overlayOpacity },
        ]}
      />

      {/* ── Blue bottom-glow radial ── */}
      <View style={styles.blueGlow} />

      {/* ── Main Centered Content ── */}
      <View style={styles.content}>

        {/* NAME: D I V Y A N G — letter by letter */}
        <View style={styles.nameRow}>
          {NAME.split('').map((letter, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.nameLetter,
                {
                  opacity:   letterAnims[i].opacity,
                  transform: [
                    { translateY: letterAnims[i].translateY },
                    { scale:      letterAnims[i].scale },
                  ],
                },
              ]}
            >
              {letter}
            </Animated.Text>
          ))}
        </View>

        {/* ── Glow line + dot ── */}
        <View style={styles.lineRow}>
          <Animated.View
            style={[
              styles.glowLine,
              {
                width:   glowWidth,
                opacity: glowOpacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.glowDot,
              {
                opacity:   dotOpacity,
                transform: [{ scale: dotScale }],
              },
            ]}
          />
        </View>

        {/* ── Tagline ── */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity:   taglineOpacity,
              transform: [{ translateY: taglineTranslateY }],
            },
          ]}
        >
          DAILY  RHYTHM
        </Animated.Text>
      </View>

      {/* ── Bottom credit ── */}
      <Animated.Text style={[styles.credit, { opacity: taglineOpacity }]}>
        Solar system imagery · NASA SVS · Public Domain
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  blueGlow: {
    position: 'absolute',
    bottom: -60,
    alignSelf: 'center',
    width: 340,
    height: 200,
    borderRadius: 200,
    backgroundColor: BLUE,
    opacity: 0.10,
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  nameLetter: {
    fontSize: 58,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 10,
    textShadowColor: BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 28,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 4,
    marginBottom: 22,
  },
  glowLine: {
    height: 2,
    backgroundColor: BLUE,
    borderRadius: 2,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },
  glowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BLUE,
    marginLeft: 4,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 12,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 6,
  },
  credit: {
    position: 'absolute',
    bottom: 36,
    fontSize: 9,
    color: 'rgba(255,255,255,0.18)',
    letterSpacing: 1,
  },
});
