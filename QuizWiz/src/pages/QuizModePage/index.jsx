import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AnswersBox, QuizInstructionsWrapper, Timer } from '../../components';

const QuizModePage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuestionsGenerated, setIsQuestionsGenerated] = useState(false);
  const subjectId = JSON.parse(localStorage.getItem('selectedTopic'));
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subjectId: subjectId
          })
        };
        const response = await fetch(
          `http://localhost:3000/questions`,
          options
        );
        const data = await response.json();

        if (!data.questions && !data.answers) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.error
          }).then(() => navigate('/'));
        }

        if (
          Array.isArray(data.questions) &&
          Array.isArray(data.answers) &&
          data.questions.length > 0 &&
          data.answers.length > 0
        ) {
          setQuestions(data.questions);
          setAnswers(data.answers);
          setIsQuestionsGenerated(true);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error fetching questions:',
          error
        });
      }
    };

    loadQuestions();
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <>
      <div className='quiz'>
        {isQuestionsGenerated && (
          <>
            <Timer flag_page={'quiz'} />
            {questions.length > 0 &&
              currentQuestionIndex < questions.length && (
                <div className='question-container'>
                  <div key={questions[currentQuestionIndex]._id}>
                    <h3>{questions[currentQuestionIndex].name}</h3>
                  </div>
                  <div>
                    <AnswersBox
                      answers={answers}
                      currentQuestionIndex={currentQuestionIndex}
                    />
                  </div>
                  <div className='navigation-buttons-container'>
                    <button
                      className='navigation-button'
                      onClick={handlePrevQuestion}
                      hidden={currentQuestionIndex === 0}
                    >
                      &lt; Previous
                    </button>
                    <button
                      className='navigation-button'
                      onClick={handleNextQuestion}
                      hidden={currentQuestionIndex === questions.length - 1}
                    >
                      Next &gt;
                    </button>
                  </div>
                </div>
              )}
            {currentQuestionIndex === questions.length && (
              <p>
                All questions answered!
                <Link to='/test/quiz/results'>See Results</Link>
              </p>
            )}
          </>
        )}
      </div>
      <QuizInstructionsWrapper />
    </>
  );
};

export default QuizModePage;
