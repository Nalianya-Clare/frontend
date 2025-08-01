import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  Plus, 
  Users, 
  Target, 
  Calendar, 
  BarChart3, 
  FileText,
  Clock,
  Shield,
  Edit,
  Trash2
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Total Users", value: "15,247", icon: Users, color: "text-primary" },
    { label: "Active Challenges", value: "142", icon: Target, color: "text-secondary" },
    { label: "Questions Created", value: "1,847", icon: FileText, color: "text-accent" },
    { label: "Completion Rate", value: "87%", icon: BarChart3, color: "text-success" },
  ];

  const recentQuestions = [
    { id: 1, title: "Advanced Phishing Detection", category: "Phishing", difficulty: "Hard", status: "Active" },
    { id: 2, title: "OSINT Social Media Investigation", category: "OSINT", difficulty: "Medium", status: "Draft" },
    { id: 3, title: "Network Vulnerability Assessment", category: "Network", difficulty: "Expert", status: "Active" },
    { id: 4, title: "Social Engineering Awareness", category: "Social Engineering", difficulty: "Easy", status: "Scheduled" },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-muted/20`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentQuestions.map((question) => (
              <div key={question.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                <div>
                  <div className="font-medium">{question.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {question.category} • {question.difficulty}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    question.status === 'Active' ? 'bg-success/20 text-success' :
                    question.status === 'Draft' ? 'bg-accent/20 text-accent' :
                    'bg-primary/20 text-primary'
                  }`}>
                    {question.status}
                  </span>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="cyber" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Create New Question
            </Button>
            <Button variant="neon" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Challenge
            </Button>
            <Button variant="quiz" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button variant="quiz" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderQuestionManager = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Question Manager</h2>
        <Button variant="cyber">
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phishing">Phishing Detection</SelectItem>
                  <SelectItem value="osint">OSINT Techniques</SelectItem>
                  <SelectItem value="network">Network Security</SelectItem>
                  <SelectItem value="social">Social Engineering</SelectItem>
                  <SelectItem value="malware">Malware Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea 
              id="question" 
              placeholder="Enter your cybersecurity question here..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-4">
            <Label>Answer Options</Label>
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input 
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
                <input type="radio" name="correct" className="text-primary" />
                <Label className="text-sm">Correct</Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation</Label>
            <Textarea 
              id="explanation" 
              placeholder="Explain why this is the correct answer..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex space-x-4">
            <Button variant="cyber">Save Question</Button>
            <Button variant="neon">Save & Preview</Button>
            <Button variant="ghost">Reset Form</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUserManager = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex space-x-2">
          <Input placeholder="Search users..." className="w-64" />
          <Button variant="cyber">
            <Users className="mr-2 h-4 w-4" />
            Bulk Actions
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Score</th>
                  <th className="p-4 font-medium">Last Active</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Alex Chen", email: "alex@company.com", role: "Admin", score: 15750, lastActive: "2h ago" },
                  { name: "Sarah Kim", email: "sarah@company.com", role: "User", score: 14230, lastActive: "5h ago" },
                  { name: "Marcus Johnson", email: "marcus@company.com", role: "User", score: 13890, lastActive: "1d ago" },
                ].map((user, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'Admin' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-accent">{user.score.toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground">{user.lastActive}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "questions", label: "Questions", icon: FileText },
    { id: "users", label: "Users", icon: Users },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-lg bg-gradient-primary">
          <Shield className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your cybersecurity learning platform</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "questions" && renderQuestionManager()}
        {activeTab === "users" && renderUserManager()}
        {activeTab === "schedule" && (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Schedule Management</h3>
            <p className="text-muted-foreground">Coming soon - Schedule challenges and manage release dates</p>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Platform Settings</h3>
            <p className="text-muted-foreground">Coming soon - Configure platform settings and preferences</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;