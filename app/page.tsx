"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import cardsData from "@/data/cards.json";
import { useRouter } from "next/navigation";

import artGeniusAnswers from "@/data/answers/art-genius.json";
import happyCheerAnswers from "@/data/answers/happy-cheer.json";
import ideaMakerAnswers from "@/data/answers/idea-maker.json";
import kindHelperAnswers from "@/data/answers/kind-helper.json";
import curiousObserverAnswers from "@/data/answers/curious-observer.json";
import logicalThinkerAnswers from "@/data/answers/logical-thinker.json";
import passionateMidfielderAnswers from "@/data/answers/passionate-midfielder.json";
import wiseStrategistAnswers from "@/data/answers/wise-strategist.json";
import StartView from "@/app/components/start-view";

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
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

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

  if (!started) {
    return (
      <StartView onStart={() => setStarted(true)} participantCount={298} />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = async (answer: Answer) => {
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
      setIsCalculating(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
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

  if (isCalculating) {
    return (
      <main className="container mx-auto min-h-screen p-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              당신의 결과를 분석하고 있어요
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 py-8">
            <div className="flex justify-center">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div className="h-2 w-48 bg-gray-200 rounded" />
                <div className="h-2 w-32 bg-gray-200 rounded" />
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm">
              잠시만 기다려주세요...
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto min-h-screen p-4 flex flex-col items-center justify-center">
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
        {currentQuestionIndex > 0 && (
          <Button
            variant="outline"
            className="w-24"
            onClick={handlePrevious}
          >
            이전
          </Button>
        )}
      </div>
    </main>
  );
}
