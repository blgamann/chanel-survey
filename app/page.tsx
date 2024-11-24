"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import cardsData from "@/questions/cards.json";
import { useRouter } from "next/navigation";

import artGeniusAnswers from "@/answers/art-genius.json";
import happyCheerAnswers from "@/answers/happy-cheer.json";
import ideaMakerAnswers from "@/answers/idea-maker.json";
import kindHelperAnswers from "@/answers/kind-helper.json";
import curiousObserverAnswers from "@/answers/curious-observer.json";
import logicalThinkerAnswers from "@/answers/logical-thinker.json";
import passionateMidfielderAnswers from "@/answers/passionate-midfielder.json";
import wiseStrategistAnswers from "@/answers/wise-strategist.json";

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

interface AnswerData {
  cardId: string;
  answer: Answer;
  category: string;
}

export default function Home() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

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

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const result = calculateResult([...userAnswers, newAnswer]);
      router.push(`/result/${result}`);
    }
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

  const calculateResult = (answers: UserAnswer[]) => {
    const scores = {
      "art-genius": 0,
      "happy-cheer": 0,
      "idea-maker": 0,
      "kind-helper": 0,
      "curious-observer": 0,
      "logical-thinker": 0,
      "passionate-midfielder": 0,
      "wise-strategist": 0,
    };

    answers.forEach((answer) => {
      const userAnswer = answer.answer;

      if (userAnswer === "o") {
        Object.entries({
          "art-genius": artGeniusAnswers,
          "happy-cheer": happyCheerAnswers,
          "idea-maker": ideaMakerAnswers,
          "kind-helper": kindHelperAnswers,
          "curious-observer": curiousObserverAnswers,
          "logical-thinker": logicalThinkerAnswers,
          "passionate-midfielder": passionateMidfielderAnswers,
          "wise-strategist": wiseStrategistAnswers,
        }).forEach(([type, answerSet]) => {
          if (
            (answerSet as AnswerData[]).some(
              (a) => a.cardId === answer.cardId && a.answer === "o"
            )
          ) {
            scores[type as keyof typeof scores] += 1;
          }
        });
      } else if (userAnswer === "x") {
        Object.entries({
          "art-genius": artGeniusAnswers,
          "happy-cheer": happyCheerAnswers,
          "idea-maker": ideaMakerAnswers,
          "kind-helper": kindHelperAnswers,
          "curious-observer": curiousObserverAnswers,
          "logical-thinker": logicalThinkerAnswers,
          "passionate-midfielder": passionateMidfielderAnswers,
          "wise-strategist": wiseStrategistAnswers,
        }).forEach(([type, answerSet]) => {
          if (
            (answerSet as AnswerData[]).some(
              (a) => a.cardId === answer.cardId && a.answer === "x"
            )
          ) {
            scores[type as keyof typeof scores] += 1;
          }
        });
      } else if (userAnswer === "?") {
        Object.entries({
          "art-genius": artGeniusAnswers,
          "happy-cheer": happyCheerAnswers,
          "idea-maker": ideaMakerAnswers,
          "kind-helper": kindHelperAnswers,
          "curious-observer": curiousObserverAnswers,
          "logical-thinker": logicalThinkerAnswers,
          "passionate-midfielder": passionateMidfielderAnswers,
          "wise-strategist": wiseStrategistAnswers,
        }).forEach(([type, answerSet]) => {
          if (
            (answerSet as AnswerData[]).some(
              (a) => a.cardId === answer.cardId && a.answer === "?"
            )
          ) {
            scores[type as keyof typeof scores] += 1;
          }
        });
      }
    });

    const maxScore = Math.max(...Object.values(scores));
    const winners = Object.entries(scores).filter(
      ([_, score]) => score === maxScore
    );
    return winners[Math.floor(Math.random() * winners.length)][0];
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
            className={`w-full p-6 text-left h-auto whitespace-normal ${
              currentAnswer === "o"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleAnswer("o")}
            style={{
              WebkitAppearance: "none",
              backgroundColor:
                currentAnswer === "o" ? undefined : "transparent",
            }}
          >
            {currentQuestion.descriptionO}
          </Button>

          {currentQuestion.descriptionDunno && (
            <Button
              variant={currentAnswer === "?" ? "default" : "outline"}
              className={`w-full p-6 text-left h-auto whitespace-normal ${
                currentAnswer === "?"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleAnswer("?")}
              style={{
                WebkitAppearance: "none",
                backgroundColor:
                  currentAnswer === "?" ? undefined : "transparent",
              }}
            >
              {currentQuestion.descriptionDunno}
            </Button>
          )}

          <Button
            variant={currentAnswer === "x" ? "default" : "outline"}
            className={`w-full p-6 text-left h-auto whitespace-normal ${
              currentAnswer === "x"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleAnswer("x")}
            style={{
              WebkitAppearance: "none",
              backgroundColor:
                currentAnswer === "x" ? undefined : "transparent",
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
