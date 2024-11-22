"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import cardsData from "@/questions/cards.json";

type Answer = "o" | "x" | "?";

interface UserAnswer {
  cardId: string;
  answer: Answer;
  category?: string;
}

interface Question {
  id: string;
  title: string;
  descriptionO: string;
  descriptionX: string;
  descriptionDunno?: string;
  index: number;
}

export default function Home() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);

  useEffect(() => {
    const questionArray = Object.entries(cardsData.data)
      .map(([key, data]) => ({
        id: key,
        ...data,
        index: data.index || 0,
      }))
      .sort((a, b) => a.index - b.index);

    setQuestions(questionArray);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: Answer) => {
    setIsAnswerSelected(true);

    const newAnswer: UserAnswer = {
      cardId: currentQuestion.id,
      answer,
    };

    setUserAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex(
        (ans) => ans.cardId === currentQuestion.id
      );

      if (existingAnswerIndex !== -1) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = newAnswer;
        return newAnswers;
      }

      return [...prev, newAnswer];
    });

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsAnswerSelected(false);
      } else {
        console.log("Survey completed!", userAnswers);
      }
    }, 500);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const getCurrentAnswer = () => {
    return userAnswers.find((answer) => answer.cardId === currentQuestion.id)
      ?.answer;
  };

  if (!currentQuestion) return <div>Loading...</div>;

  const currentAnswer = getCurrentAnswer();

  return (
    <main className="container mx-auto min-h-screen p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-16">샤넬과 함께 할 당신은?</h1>

      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between mb-2 text-sm text-gray-500">
          <span>진행률</span>
          <span>
            {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            {currentQuestion.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant={currentAnswer === "o" ? "default" : "outline"}
            className={`w-full p-6 text-left h-auto whitespace-normal transition-all duration-300 ${
              currentAnswer === "o"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-gray-100"
            } ${
              isAnswerSelected && currentAnswer === "o"
                ? "scale-[1.02] shadow-lg"
                : ""
            }`}
            onClick={() => handleAnswer("o")}
            style={{ 
              WebkitAppearance: "none",
              backgroundColor: currentAnswer === "o" ? undefined : "transparent"
            }}
          >
            {currentQuestion.descriptionO}
          </Button>

          {currentQuestion.descriptionDunno && (
            <Button
              variant={currentAnswer === "?" ? "default" : "outline"}
              className={`w-full p-6 text-left h-auto whitespace-normal transition-all duration-300 ${
                currentAnswer === "?"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              } ${
                isAnswerSelected && currentAnswer === "?"
                  ? "scale-[1.02] shadow-lg"
                  : ""
              }`}
              onClick={() => handleAnswer("?")}
              style={{ 
                WebkitAppearance: "none",
                backgroundColor: currentAnswer === "?" ? undefined : "transparent"
              }}
            >
              {currentQuestion.descriptionDunno}
            </Button>
          )}

          <Button
            variant={currentAnswer === "x" ? "default" : "outline"}
            className={`w-full p-6 text-left h-auto whitespace-normal transition-all duration-300 ${
              currentAnswer === "x"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-gray-100"
            } ${
              isAnswerSelected && currentAnswer === "x"
                ? "scale-[1.02] shadow-lg"
                : ""
            }`}
            onClick={() => handleAnswer("x")}
            style={{ 
              WebkitAppearance: "none",
              backgroundColor: currentAnswer === "x" ? undefined : "transparent"
            }}
          >
            {currentQuestion.descriptionX}
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-between w-full max-w-2xl mt-8">
        <Button
          variant="outline"
          className="w-24"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          이전
        </Button>
      </div>
    </main>
  );
}
