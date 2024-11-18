import { ScrollArea } from "@/components/ui/scroll-area";
import { ResultsListProps } from "@/types/components.props.types";
import { ResultItem } from "./components/ResultItem";

export function ResultsList({ results, currentUserId }: ResultsListProps) {
  return (
    <ScrollArea className="h-[300px] mt-8">
      <div className="space-y-4">
        {results.map((result, index) => (
          <ResultItem
            key={result.playerId}
            result={result}
            index={index}
            isCurrentUser={result.playerId === currentUserId}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

