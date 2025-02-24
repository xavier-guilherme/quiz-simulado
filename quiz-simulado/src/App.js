import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Papa from "papaparse";

const quizDataUrl = "/mnt/data/simulado_cea.csv"; // Simulação do caminho do CSV

const QuestionCard = ({ question, options, onAnswer }) => (
  <Card className="p-4 max-w-xl w-full text-center">
    <h2 className="text-xl font-bold mb-4">{question}</h2>
    <CardContent className="grid gap-2">
      {options.map((option, index) => (
        <Button key={index} onClick={() => onAnswer(option)}>
          {option}
        </Button>
      ))}
    </CardContent>
  </Card>
);

const ResultCard = ({ score, total }) => (
  <Card className="p-4 max-w-xl w-full text-center">
    <h2 className="text-2xl font-bold">Resultado</h2>
    <p className="text-lg mt-2">Você acertou {score} de {total} questões! 🎉</p>
    <p className="text-lg mt-2">Percentual de acerto: {((score / total) * 100).toFixed(2)}%</p>
  </Card>
);

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetch(quizDataUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha ao carregar os dados do quiz");
        }
        return response.text();
      })
      .then((data) => {
        Papa.parse(data, {
          complete: (result) => {
            const parsedQuestions = result.data.slice(1).map((cols) => ({
              question: cols[1],
              options: [cols[2], cols[3], cols[4], cols[5]].filter(Boolean),
              answer: cols[6]?.trim(),
            }));
            setQuestions(parsedQuestions);
          },
          skipEmptyLines: true,
        });
      })
      .catch((error) => console.error("Erro ao buscar o quiz:", error));
  }, []);

  const handleAnswer = (option) => {
    if (option[0] === questions[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {showResult ? (
        <ResultCard score={score} total={questions.length} />
      ) : (
        questions.length > 0 && (
          <QuestionCard
            question={questions[currentQuestion].question}
            options={questions[currentQuestion].options}
            onAnswer={handleAnswer}
          />
        )
      )}
    </div>
  );
};

export default QuizApp;
