import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface AnimatedHeartsProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

export default function AnimatedHearts({ isVisible, onAnimationComplete }: AnimatedHeartsProps) {
  const [hearts, setHearts] = useState<Array<{
    id: number;
    x: number;
    y: Animated.Value;
    rotation: Animated.Value;
    scale: Animated.Value;
    color: string;
    size: number;
  }>>([]);

  useEffect(() => {
    console.log('AnimatedHearts: isVisible =', isVisible);
    
    if (isVisible) {
      console.log('AnimatedHearts: Creating hearts...');
      
      // Create 15 hearts with random properties
      const newHearts = Array.from({ length: 15 }, (_, index) => ({
        id: index,
        x: Math.random() * width,
        y: new Animated.Value(-100),
        rotation: new Animated.Value(0),
        scale: new Animated.Value(0.5),
        color: ['#ef4444', '#ec4899', '#f97316', '#e11d48', '#be185d'][Math.floor(Math.random() * 5)],
        size: 20 + Math.random() * 25,
      }));
      
      setHearts(newHearts);
      
      // Animate each heart
      const animations = newHearts.map((heart) => {
        const duration = 3000 + Math.random() * 2000;
        const delay = Math.random() * 1000;
        
        return Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(heart.y, {
              toValue: height + 50,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(heart.rotation, {
              toValue: Math.random() * 360,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(heart.scale, {
              toValue: 1,
              duration: duration * 0.3,
              useNativeDriver: true,
            }),
          ]),
        ]);
      });
      
      Animated.parallel(animations).start(() => {
        console.log('AnimatedHearts: Animation completed');
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      });
    } else {
      setHearts([]);
    }
  }, [isVisible, onAnimationComplete]);

  if (!isVisible || hearts.length === 0) {
    console.log('AnimatedHearts: Not rendering, hearts count:', hearts.length);
    return null;
  }

  console.log('AnimatedHearts: Rendering', hearts.length, 'hearts');

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Static test heart to ensure visibility */}
      <View style={[styles.heart, { left: 50, top: 100, zIndex: 10000 }]}>
        <Ionicons name="heart" size={40} color="#ef4444" />
      </View>
      
      {hearts.map((heart) => (
        <Animated.View
          key={heart.id}
          style={[
            styles.heart,
            {
              left: heart.x,
              transform: [
                { translateY: heart.y },
                { rotate: heart.rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                })},
                { scale: heart.scale },
              ],
            },
          ]}
        >
          <Ionicons 
            name="heart" 
            size={heart.size} 
            color={heart.color} 
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heart: {
    position: 'absolute',
    top: 0,
    zIndex: 9999,
  },
}); 