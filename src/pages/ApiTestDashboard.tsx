import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  gameService, 
  progressService, 
  leaderboardService, 
  badgeService 
} from '@/lib/api-services';

const ApiTestDashboard = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [quizId, setQuizId] = useState('1');
  const [sessionId, setSessionId] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [answerId, setAnswerId] = useState('');

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFn();
      setResults(prev => ({ ...prev, [testName]: result }));
    } catch (error) {
      setResults(prev => ({ ...prev, [testName]: { error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const testGameStart = () => runTest('gameStart', () => 
    gameService.startGame(Number(quizId))
  );

  const testSubmitAnswer = () => runTest('submitAnswer', () => 
    gameService.submitAnswer(Number(sessionId), Number(questionId), Number(answerId), 30)
  );

  const testFinishGame = () => runTest('finishGame', () => 
    gameService.finishGame(Number(sessionId))
  );

  const testUserProgress = () => runTest('userProgress', () => 
    progressService.getUserProgress()
  );

  const testGlobalLeaderboard = () => runTest('globalLeaderboard', () => 
    leaderboardService.getGlobal()
  );

  const testCategoryLeaderboard = () => runTest('categoryLeaderboard', () => 
    leaderboardService.getByCategory()
  );

  const testAllBadges = () => runTest('allBadges', () => 
    badgeService.getAll()
  );

  const testUserBadges = () => runTest('userBadges', () => 
    badgeService.getUserBadges()
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">API Test Dashboard</h1>
          <p className="text-muted-foreground">Test all the implemented API endpoints</p>
        </div>

        {/* Input Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Parameters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="quizId">Quiz ID</Label>
              <Input
                id="quizId"
                value={quizId}
                onChange={(e) => setQuizId(e.target.value)}
                placeholder="1"
              />
            </div>
            <div>
              <Label htmlFor="sessionId">Session ID</Label>
              <Input
                id="sessionId"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Session ID from game start"
              />
            </div>
            <div>
              <Label htmlFor="questionId">Question ID</Label>
              <Input
                id="questionId"
                value={questionId}
                onChange={(e) => setQuestionId(e.target.value)}
                placeholder="Question ID"
              />
            </div>
            <div>
              <Label htmlFor="answerId">Answer ID</Label>
              <Input
                id="answerId"
                value={answerId}
                onChange={(e) => setAnswerId(e.target.value)}
                placeholder="Answer ID"
              />
            </div>
          </CardContent>
        </Card>

        {/* API Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Game APIs */}
          <Card>
            <CardHeader>
              <CardTitle>Game APIs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testGameStart} 
                disabled={loading.gameStart}
                className="w-full"
              >
                {loading.gameStart ? 'Testing...' : 'Start Game'}
              </Button>
              <Button 
                onClick={testSubmitAnswer} 
                disabled={loading.submitAnswer || !sessionId}
                className="w-full"
              >
                {loading.submitAnswer ? 'Testing...' : 'Submit Answer'}
              </Button>
              <Button 
                onClick={testFinishGame} 
                disabled={loading.finishGame || !sessionId}
                className="w-full"
              >
                {loading.finishGame ? 'Testing...' : 'Finish Game'}
              </Button>
            </CardContent>
          </Card>

          {/* Progress & Leaderboard APIs */}
          <Card>
            <CardHeader>
              <CardTitle>Progress & Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testUserProgress} 
                disabled={loading.userProgress}
                className="w-full"
              >
                {loading.userProgress ? 'Testing...' : 'Get User Progress'}
              </Button>
              <Button 
                onClick={testGlobalLeaderboard} 
                disabled={loading.globalLeaderboard}
                className="w-full"
              >
                {loading.globalLeaderboard ? 'Testing...' : 'Global Leaderboard'}
              </Button>
              <Button 
                onClick={testCategoryLeaderboard} 
                disabled={loading.categoryLeaderboard}
                className="w-full"
              >
                {loading.categoryLeaderboard ? 'Testing...' : 'Category Leaderboard'}
              </Button>
            </CardContent>
          </Card>

          {/* Badge APIs */}
          <Card>
            <CardHeader>
              <CardTitle>Badge APIs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testAllBadges} 
                disabled={loading.allBadges}
                className="w-full"
              >
                {loading.allBadges ? 'Testing...' : 'Get All Badges'}
              </Button>
              <Button 
                onClick={testUserBadges} 
                disabled={loading.userBadges}
                className="w-full"
              >
                {loading.userBadges ? 'Testing...' : 'Get User Badges'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>API Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={JSON.stringify(results, null, 2)}
              readOnly
              className="min-h-96 font-mono text-sm"
              placeholder="API results will appear here..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiTestDashboard;
