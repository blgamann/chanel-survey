"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { supabase } from "@/app/lib/supabase";
import { Label } from "@/components/ui/label";

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

type Step = "initial" | "userInfo" | "survey";

interface SurveyResult {
  userData: {
    name: string;
    email: string;
  };
  answers: UserAnswer[];
  result: string;
}

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("initial");
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState("");

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

  if (step === "initial") {
    return <StartView onStart={() => setStep("userInfo")} />;
  }

  if (step === "userInfo") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-center">
              시작하기 전에
            </CardTitle>
            <CardDescription className="text-center">
              간단한 정보를 입력해주세요
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const email = formData.get("email") as string;

                if (!name.trim() || !email.trim()) {
                  setError("이름과 이메일을 모두 입력해주세요.");
                  return;
                }

                if (!email.includes("@")) {
                  setError("올바른 이메일 주소를 입력해주세요.");
                  return;
                }

                setUserData({ name: name.trim(), email: email.trim() });
                setStep("survey");
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="이름을 입력해주세요"
                  className="w-full"
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="이메일 주소를 입력해주세요"
                  className="w-full"
                  aria-required="true"
                />
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive text-center">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full">
                테스트 시작하기
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const submitSurveyResult = async (result: string, answers: UserAnswer[]) => {
    if (!userData) return;

    try {
      const { error } = await supabase
        .from("chanel_survey")
        .insert({
          name: userData.name,
          email: userData.email,
          result_type: result,
          answers: answers,
          submitted_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Error inserting data:", error);
        throw error;
      }

      router.push(`/result/${result}`);
    } catch (error) {
      console.error("Failed to submit survey result:", error);
      // 에러가 발생해도 결과 페이지로 이동
      router.push(`/result/${result}`);
    }
  };

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

      const finalAnswers = [...userAnswers, newAnswer];
      await submitSurveyResult(result, finalAnswers);
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
      ([, score]) => score === maxScore
    );
    return winners[Math.floor(Math.random() * winners.length)][0];
  };

  if (!currentQuestion) return null;

  if (isCalculating) {
    return (
      <div className="container mx-auto min-h-screen p-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              당신의 결과를 분석하고 있어요
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 py-8">
            <div className="flex justify-center">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-full" />
                <div className="h-2 w-48 bg-muted rounded" />
                <div className="h-2 w-32 bg-muted rounded" />
              </div>
            </div>
            <p className="text-center text-muted-foreground text-sm">
              잠시만 기다려주세요...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentAnswer = getCurrentAnswer();

  return (
    <main className="min-h-screen w-full">
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="mx-auto w-full max-w-2xl">
          <div className="flex justify-between mb-2 text-sm text-muted-foreground">
            <span>진행률</span>
            <span>
              {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl mt-16">
          <CardHeader>
            <CardTitle className="text-xl text-center leading-normal">
              {currentQuestion.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant={currentAnswer === "o" ? "default" : "outline"}
              className={`w-full p-6 text-left h-auto whitespace-normal ${
                currentAnswer === "o"
                  ? ""
                  : "hover:bg-muted"
              }`}
              onClick={() => handleAnswer("o")}
            >
              {currentQuestion.descriptionO}
            </Button>

            {currentQuestion.descriptionDunno && (
              <Button
                variant={currentAnswer === "?" ? "default" : "outline"}
                className={`w-full p-6 text-left h-auto whitespace-normal ${
                  currentAnswer === "?"
                    ? ""
                    : "hover:bg-muted"
                }`}
                onClick={() => handleAnswer("?")}
              >
                {currentQuestion.descriptionDunno}
              </Button>
            )}

            <Button
              variant={currentAnswer === "x" ? "default" : "outline"}
              className={`w-full p-6 text-left h-auto whitespace-normal ${
                currentAnswer === "x"
                  ? ""
                  : "hover:bg-muted"
              }`}
              onClick={() => handleAnswer("x")}
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
              aria-label="이전 질문으로 이동"
            >
              이전
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
