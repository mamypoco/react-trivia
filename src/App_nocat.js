import React, { useState, useEffect } from "react";
import { decode } from "html-entities";
import "./App.scss";

const Trivia = () => {
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [showNextButton, setShowNextButton] = useState(false);
  const [userChoiceCorrect, setUserChoiceCorrect] = useState(null);

  useEffect(() => {
    fetchTrivia();
  }, []);

  const fetchTrivia = async () => {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=1");
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const {
          question,
          correct_answer,
          incorrect_answers,
          category,
          difficulty,
        } = data.results[0];
        setQuestion(question);
        setCorrectAnswer(correct_answer);
        setChoices(shuffleArray([correct_answer, ...incorrect_answers]));
        setCategory(category);
        setDifficulty(difficulty);
        setUserChoiceCorrect(null);
        setShowNextButton(false);
      } else {
        console.error("No trivia questions found");
      }
    } catch (error) {
      console.error("Error fetching trivia:", error);
    }
  };

  const shuffleArray = (array) => {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswerClick = (choice) => {
    if (choice === correctAnswer) {
      setUserChoiceCorrect(true);
      setShowNextButton(true);
    } else {
      setUserChoiceCorrect(false);
      setShowNextButton(false);
    }
  };

  const handleNextClick = () => {
    setShowNextButton(false);
    fetchTrivia();
  };

  return (
    <div>
      <h2>Happy Hour Trivia</h2>
      <p>
        <strong>Category:</strong> {decode(category)}
      </p>
      <p>
        <strong>Difficulty:</strong> {difficulty}
      </p>
      <p>
        <strong>Question:</strong> {decode(question)}
      </p>

      <ol>
        {choices.map((choice, index) => (
          <li key={index} onClick={() => handleAnswerClick(choice)}>
            <button> {decode(choice)}</button>
          </li>
        ))}
      </ol>
      {userChoiceCorrect === true && <p>CORRECT! Good Job😸</p>}
      {userChoiceCorrect === false && <p>INCORRECT! Try Again💩💦</p>}
      {showNextButton && (
        <button className="next-btn" onClick={handleNextClick}>
          Go to next quiz
        </button>
      )}
    </div>
  );
};

export default Trivia;
