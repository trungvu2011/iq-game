import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import CorrectIcon from '../../../assets/icons/CorrectIcon';
import WrongIcon from '../../../assets/icons/WrongIcon';

interface AnswerButtonProps {
  answerList: number[];
  correctAnswer: number;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

const Button = ({
  number,
  onPress,
  disabled,
  isSelected,
  isCorrect,
  showCorrect,
}: {
  number: number;
  onPress: () => void;
  disabled: boolean;
  isSelected?: boolean;
  isCorrect?: boolean;
  showCorrect?: boolean;
}) => {
  const buttonStyle = [
    styles.button,
    isSelected && (isCorrect ? styles.correctButton : styles.wrongButton),
    !isSelected && showCorrect && styles.correctButton,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={1}
    >
      <Text style={styles.buttonText}>{number}</Text>
    </TouchableOpacity>
  )
}

const AnswerButton = ({ answerList, onAnswer, disabled, correctAnswer }: AnswerButtonProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (isCorrect !== null) {
      // Show icon for a moment before proceeding to the next question
      const timer = setTimeout(() => {
        onAnswer(isCorrect);
        // Reset states for the next question
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isCorrect]);

  const handleAnswerPress = (number: number) => {
    if (disabled || selectedAnswer !== null) return;

    const correct = number === correctAnswer;
    setSelectedAnswer(number);
    setIsCorrect(correct);
  };

  return (
    <View style={styles.container}>
      {/* Overlay that covers the entire screen */}
      {isCorrect !== null && (
        <View style={styles.feedbackOverlay}>
          {isCorrect === true && (
            <View style={styles.iconContainer}>
              <CorrectIcon width={70} height={70} />
            </View>
          )}
          {isCorrect === false && (
            <View style={styles.iconContainer}>
              <WrongIcon width={70} height={70} />
            </View>
          )}
        </View>
      )}

      <View style={styles.buttonRow}>
        {answerList.map((number, index) => (
          <Button
            key={index}
            number={number}
            onPress={() => handleAnswerPress(number)}
            disabled={disabled || selectedAnswer !== null}
            isSelected={selectedAnswer === number}
            isCorrect={number === correctAnswer}
            showCorrect={isCorrect !== null && number === correctAnswer}
          />
        ))}
      </View>

    </View>
  )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 10,
  },
  button: {
    flex: 1,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#221c40',
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  feedbackOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    marginTop: -height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    pointerEvents: 'none',
  },
  iconContainer: {
    borderRadius: 150,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  wrongButton: {
    backgroundColor: '#F44336',
  }
});

export default AnswerButton