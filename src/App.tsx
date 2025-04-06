import { lazy, Suspense } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Route, Switch } from "wouter";
import { Loader } from "lucide-react";
const Home = lazy(() => import("@/pages/home"));
const Book = lazy(() => import("@/pages/book"));

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="book-worm-ui-theme">
      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <Loader className="h-10 w-10 animate-spin text-primary" />
          </div>
        }
      >
          <Switch>
            <Route path="/books/:id" component={Book} />
            <Route component={Home} />
          </Switch>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
