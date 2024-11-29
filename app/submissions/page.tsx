"use client";

import { useEffect, useState } from "react";
import cardsData from "@/data/cards.json";
import { supabase } from "@/app/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import results from "@/data/results.json";

interface Submission {
  id: number;
  name: string;
  email: string;
  result_type: string;
  answers: Array<{
    cardId: string;
    answer: "o" | "x" | "?";
  }>;
  submitted_at: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const { data, error } = await supabase
          .from("chanel_survey")
          .select("*")
          .order("submitted_at", { ascending: false });

        if (error) throw error;
        setSubmissions(data || []);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  // 답변 관련 헬퍼 함수들
  const getQuestionTitle = (cardId: string) => {
    return (
      cardsData.data[cardId as keyof typeof cardsData.data]?.title ||
      "Unknown Question"
    );
  };

  const getAnswerText = (cardId: string, answer: "o" | "x" | "?") => {
    const question = cardsData.data[cardId as keyof typeof cardsData.data];
    if (!question) return "Unknown Answer";

    switch (answer) {
      case "o":
        return question.descriptionO;
      case "x":
        return question.descriptionX;
      case "?":
        return question.descriptionDunno || "모르겠어요";
      default:
        return "Unknown Answer";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>설문 제출 목록</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>설문 제출 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제출</TableHead>
                <TableHead>이름 (이메일)</TableHead>
                <TableHead>결과</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">
                    {new Date(submission.submitted_at).toLocaleDateString(
                      "ko-KR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    <span>{submission.name} </span>
                    <span className="text-sm text-muted-foreground">
                      ({submission.email})
                    </span>
                  </TableCell>
                  <TableCell>
                    {results[submission.result_type as keyof typeof results]
                      ?.description || submission.result_type}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedSubmission}
        onOpenChange={() => setSelectedSubmission(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {selectedSubmission.name}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedSubmission.email}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        결과: {results[selectedSubmission.result_type as keyof typeof results]?.description || selectedSubmission.result_type}
                      </p>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] overflow-hidden">
                <div className="space-y-4 p-1">
                  <h3 className="font-medium text-lg">답변 내역</h3>
                  <div className="space-y-3">
                    {selectedSubmission.answers.map((answer, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <p className="font-medium">
                            Q{index + 1}. {getQuestionTitle(answer.cardId)}
                          </p>
                          <p className="text-muted-foreground mt-1">
                            A: {getAnswerText(answer.cardId, answer.answer)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
