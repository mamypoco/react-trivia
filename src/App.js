import React, { useState, useEffect } from "react";
import { decode } from "html-entities";
import "./App.scss";

const Trivia = () => {
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [showNextButton, setShowNextButton] = useState(false);
  const [userChoiceCorrect, setUserChoiceCorrect] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://opentdb.com/api_category.php");
      const data = await response.json();
      setCategories(data.trivia_categories);
      // console.log("data.trivia_categories:", data.trivia_categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    const selectedCategoryName =
      event.target.options[event.target.selectedIndex].text;

    setCategoryId(selectedCategoryId);
    setCategoryName(selectedCategoryName);

    console.log("selectedCategoryName: ", selectedCategoryName);
    console.log("selectedCategoryId:", selectedCategoryId);

    fetchTrivia(selectedCategoryId);
    console.log("categoryId:", categoryId);
    console.log("categoryName:", categoryName);
  };

  const fetchTrivia = async (selectedCategoryId) => {
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=1&category=${selectedCategoryId}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const {
          //  categoryName,
          //  categoryId,
          difficulty,
          question,
          correct_answer,
          incorrect_answers,
        } = data.results[0];

        //   setCategoryName(categoryName);
        //   setCategoryId(categoryId);
        setDifficulty(difficulty);
        setQuestion(question);
        setCorrectAnswer(correct_answer);
        setChoices(shuffleArray([correct_answer, ...incorrect_answers]));
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
    fetchTrivia(categoryId);
  };

  return (
    <div className="App">
      <h2>Happy Hour Trivia</h2>
      <div className="category-select">
        <label htmlFor="category">Select Category: </label>
        <select id="category" onChange={handleCategoryChange}>
          <option className="category-option" value="">
            - Select Category -
          </option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      {categoryId && (
        <>
          <p className="cat-dif">Category: {decode(categoryName)}</p>
          <p className="cat-dif">Difficulty: {difficulty}</p>
          <p className="question">
            <strong>Question:</strong> {decode(question)}
          </p>

          <ol>
            {choices.map((choice, index) => (
              <li key={index} onClick={() => handleAnswerClick(choice)}>
                <button className="choice-btn"> {decode(choice)}</button>
              </li>
            ))}
          </ol>
          {userChoiceCorrect === true && <p>CORRECT! Good Job😸</p>}
          {userChoiceCorrect === false && <p>INCORRECT! Try Again💩💦</p>}
          {showNextButton && (
            <div className="next-btn-wrappter">
              <button className="next-btn" onClick={handleNextClick}>
                Go to next quiz
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Trivia;
