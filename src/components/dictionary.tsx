import { dictionaryActions, useDictionary } from "@/hooks/use-dictionary";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BookmarkMinus, BookmarkPlus } from "lucide-react";
import { getBrowserName, getDeviceType } from "@/lib/utils";

function Dictionary() {
  const { open, term, expanded } = useDictionary();

  useEffect(dictionaryActions.watch, []);

  if (getBrowserName() === 'Google Chrome' && getDeviceType() === 'Mobile') return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Card
        autoFocus={false}
        className={`rounded-t-xl border-t p-0 bg-background shadow-lg overflow-hidden transition-all duration-300 ${
          expanded ? "h-[75vh]" : "h-[60px]"
        }`}
      >
        {/* Header */}
        <CardHeader className="cursor-pointer py-3 flex">
          <CardTitle
            onMouseDown={(e) => {
              e.preventDefault();
              dictionaryActions.toggleExpanded();
            }}
            className="h-full flex-1 flex items-center text-ellipsis"
          >
            Define "{term}"
          </CardTitle>
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full aspect-square"
              onClick={
                dictionaryActions.isInDictionary
                  ? dictionaryActions.removeWordToDictionary
                  : dictionaryActions.addWordToDictionary
              }
            >
              {dictionaryActions.isInDictionary ? (
                <BookmarkMinus className="h-5 w-5 text-red-500" />
              ) : (
                <BookmarkPlus className="h-5 w-5 text-green-500" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="h-full pb-6">
          <iframe
            src={`https://en.wiktionary.org/wiki/${term}`}
            className="w-full h-full"
            rel="noopener"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export { Dictionary };
