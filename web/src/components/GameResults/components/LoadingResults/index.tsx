import { Card, CardContent } from "@/components/ui/card";

interface LoadingResultsProps {
  finishedCount: number;
  totalCount: number;
}

export function LoadingResults({ finishedCount, totalCount }: LoadingResultsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Aguardando outros jogadores...</h2>
          <div className="animate-pulse text-muted-foreground">
            Calculando resultados finais...
            ({finishedCount}/{totalCount})
          </div>
        </CardContent>
      </Card>
    </div>
  );
}