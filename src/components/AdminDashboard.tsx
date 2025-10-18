import { useState, useEffect } from "react";
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
  Trash2,
  Loader2,
  Crown,
  UserCheck
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminService, quizService, categoryService, resourceService, type User, type Quiz, type Category, type Resource, type CreateQuizRequest, type CreateQuestionRequest, type CreateAnswerRequest, type AdminStats, type CreateUserRequest, type UpdateUserRequest, type UserListResponse } from "@/lib/api-services";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { user, hasAdminAccess } = useAuth();
  const { toast } = useToast();
  
  // Additional security check - this should be redundant due to AdminProtectedRoute
  useEffect(() => {
    if (!hasAdminAccess()) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive"
      });
    }
  }, [hasAdminAccess, toast]);

  const [activeTab, setActiveTab] = useState("overview");
  // Resource state
  // Replace your existing resource state and functions with these updated versions:

// Resource state (update this)
const [resources, setResources] = useState<Resource[]>([]);
const [newResource, setNewResource] = useState<{ 
  description: string; 
  raw_file: File | null; 
  image: File | null;
  quiz?: number; // Add this field
}>({ 
  description: '', 
  raw_file: null, 
  image: null,
  quiz: undefined // Add this field
});
const [resourceLoading, setResourceLoading] = useState(false);

// Load resources (update this)
const loadResources = async () => {
  setResourceLoading(true);
  try {
    const res = await resourceService.getAll();
    setResources(res.results || []);
  } catch (error) {
    toast({ 
      title: 'Error', 
      description: 'Failed to load resources', 
      variant: 'destructive' 
    });
  } finally {
    setResourceLoading(false);
  }
};

// Handle resource create (update this)
const handleCreateResource = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newResource.description) {
    toast({ 
      title: 'Error', 
      description: 'Description is required', 
      variant: 'destructive' 
    });
    return;
  }
  
  setResourceLoading(true);
  try {
    await resourceService.create({
      description: newResource.description,
      raw_file: newResource.raw_file || undefined,
      image: newResource.image || undefined,
      quiz: newResource.quiz, // Add this field
    });
    
    toast({ 
      title: 'Success', 
      description: newResource.quiz 
        ? 'Resource created and assigned to quiz' 
        : 'Resource created successfully' 
    });
    
    // Reset form
    setNewResource({ 
      description: '', 
      raw_file: null, 
      image: null,
      quiz: undefined // Reset this field too
    });
    
    loadResources();
  } catch (error) {
    toast({ 
      title: 'Error', 
      description: 'Failed to create resource', 
      variant: 'destructive' 
    });
  } finally {
    setResourceLoading(false);
  }
};

// Update the useEffect to also load quizzes when needed
useEffect(() => {
  loadDashboardData();
  loadResources();
  // Load quizzes for the resource selector
  if (quizzes.length === 0) {
    loadQuizzes();
  }
}, []);

// Add this useEffect to load quizzes when switching to resources tab
useEffect(() => {
  if (activeTab === "resources" && quizzes.length === 0) {
    loadQuizzes();
  }
}, [activeTab]);

  // Handle file input
  const handleResourceFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'raw_file' | 'image') => {
    if (e.target.files && e.target.files[0]) {
      setNewResource((prev) => ({ ...prev, [type]: e.target.files![0] }));
    }
  };
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    active_quizzes: 0,
    total_questions: 0,
    completion_rate: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Quiz creation form state
  const [newQuiz, setNewQuiz] = useState<CreateQuizRequest>({
    title: "",
    description: "",
    category: 0,
    difficulty: "easy",
    time_limit: 30,
    total_questions: 0,
    pass_score: 70,
    points_reward: 100,
    start_time: "",
    questions_data: []
  });

  // Category creation form state
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "F",
    color: "#FF5733"
  });

  // Category editing state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryData, setEditCategoryData] = useState<{
    name?: string;
    description?: string;
    icon?: string;
    color?: string;
    is_active?: boolean;
  }>({});

  // Dialog states for category management
  const [showCreateCategoryDialog, setShowCreateCategoryDialog] = useState(false);
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);

  // User creation form state
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "user",
    gender: "",
    profession: "",
    is_active: true,
    is_medical_staff: false,
    is_approved_staff: false
  });

  // User editing state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserData, setEditUserData] = useState<UpdateUserRequest>({});
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Question creation state
  const [currentQuestion, setCurrentQuestion] = useState<CreateQuestionRequest>({
    question_text: "",
    question_type: "multiple_choice",
    explanation: "",
    points: 1,
    order: 1,
    answers: []
  });

  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
    loadResources();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, categoriesData] = await Promise.all([
        adminService.getDashboardStats(),
        categoryService.getAll()
      ]);
      
      setStats(statsData);
      setCategories(categoriesData.results || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers(1, searchTerm);
      setUsers(response.results || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizService.getAll();
      setQuizzes(response.results || []);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast({
        title: "Error",
        description: "Failed to load quizzes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!newQuiz.title || !newQuiz.description || !newQuiz.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    if (newQuiz.questions_data && newQuiz.questions_data.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question to the quiz",
        variant: "destructive"
      });
      return;
    }
    if (!newQuiz.start_time) {
      toast({
        title: "Error",
        description: "Please select a start time for the quiz",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      // Set total_questions based on questions_data length
      const quizToCreate = {
        ...newQuiz,
        total_questions: newQuiz.questions_data?.length || 0
      };
      await adminService.createQuiz(quizToCreate);
      toast({
        title: "Success",
        description: "Quiz created successfully with questions",
      });
      // Reset form
      setNewQuiz({
        title: "",
        description: "",
        category: 0,
        difficulty: "easy",
        time_limit: 30,
        total_questions: 0,
        pass_score: 70,
        points_reward: 100,
        start_time: "",
        questions_data: []
      });
      // Reload quizzes
      loadQuizzes();
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to create quiz",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuestionToQuiz = () => {
    if (!currentQuestion.question_text || currentQuestion.answers.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in question text and add at least one answer",
        variant: "destructive"
      });
      return;
    }

    // Validate that at least one answer is correct for multiple choice and true/false
    if (currentQuestion.question_type !== 'fill_blank') {
      const hasCorrectAnswer = currentQuestion.answers.some(answer => answer.is_correct);
      if (!hasCorrectAnswer) {
        toast({
          title: "Error",
          description: "Please mark at least one answer as correct",
          variant: "destructive"
        });
        return;
      }
    }

    const newQuestionWithOrder = {
      ...currentQuestion,
      order: (newQuiz.questions_data?.length || 0) + 1
    };

    setNewQuiz(prev => ({
      ...prev,
      questions_data: [...(prev.questions_data || []), newQuestionWithOrder]
    }));

    // Reset current question
    setCurrentQuestion({
      question_text: "",
      question_type: "multiple_choice",
      explanation: "",
      points: 1,
      order: 1,
      answers: []
    });

    setShowQuestionBuilder(false);
    
    toast({
      title: "Success",
      description: "Question added to quiz",
    });
  };

  const addAnswerToQuestion = () => {
    const newAnswer: CreateAnswerRequest = {
      answer_text: "",
      is_correct: false,
      order: currentQuestion.answers.length + 1
    };

    setCurrentQuestion(prev => ({
      ...prev,
      answers: [...prev.answers, newAnswer]
    }));
  };

  const updateAnswer = (index: number, field: keyof CreateAnswerRequest, value: any) => {
    setCurrentQuestion(prev => ({
      ...prev,
      answers: prev.answers.map((answer, i) => 
        i === index ? { ...answer, [field]: value } : answer
      )
    }));
  };

  const removeAnswer = (index: number) => {
    setCurrentQuestion(prev => ({
      ...prev,
      answers: prev.answers.filter((_, i) => i !== index)
    }));
  };

  const removeQuestionFromQuiz = (questionIndex: number) => {
    setNewQuiz(prev => ({
      ...prev,
      questions_data: prev.questions_data?.filter((_, i) => i !== questionIndex)
    }));
  };

  const loadSampleQuiz = () => {
    const sampleQuiz: CreateQuizRequest = {
      title: "Advanced Python Programming Quiz",
      description: "Test your knowledge of advanced Python concepts including decorators, metaclasses, and async programming",
      category: 1, // You might need to adjust this based on available categories
      difficulty: "hard",
      time_limit: 45,
      total_questions: 3,
      pass_score: 80,
      points_reward: 50,
      questions_data: [
        {
          question_text: "What is the primary purpose of Python decorators?",
          question_type: "multiple_choice",
          explanation: "Decorators allow you to modify or extend the behavior of functions or classes without permanently modifying their code.",
          points: 2,
          order: 1,
          answers: [
            {
              answer_text: "To modify or extend function behavior",
              is_correct: true,
              order: 1
            },
            {
              answer_text: "To create new classes",
              is_correct: false,
              order: 2
            },
            {
              answer_text: "To handle exceptions",
              is_correct: false,
              order: 3
            },
            {
              answer_text: "To import modules",
              is_correct: false,
              order: 4
            }
          ]
        },
        {
          question_text: "Python supports multiple inheritance.",
          question_type: "true_false",
          explanation: "Yes, Python supports multiple inheritance, allowing a class to inherit from multiple parent classes.",
          points: 1,
          order: 2,
          answers: [
            {
              answer_text: "True",
              is_correct: true,
              order: 1
            },
            {
              answer_text: "False",
              is_correct: false,
              order: 2
            }
          ]
        },
        {
          question_text: "Complete the code: async def fetch_data(): result = _____ fetch_api()",
          question_type: "fill_blank",
          explanation: "The 'await' keyword is used to wait for an asynchronous operation to complete.",
          points: 3,
          order: 3,
          answers: []
        }
      ]
    };

    setNewQuiz(sampleQuiz);
    toast({
      title: "Sample Loaded",
      description: "Sample Python quiz loaded with 3 questions",
    });
  };

  const handleDeleteQuiz = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    
    setLoading(true);
    try {
      await adminService.deleteQuiz(id);
      toast({
        title: "Success",
        description: "Quiz deleted successfully",
      });
      loadQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    // Only super admins can delete users
    if (user?.role !== 'super') {
      toast({
        title: "Access Denied",
        description: "Only super administrators can delete users",
        variant: "destructive"
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    try {
      await adminService.deleteUser(id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name || !newCategory.description) {
      toast({
        title: "Error",
        description: "Please fill in category name and description",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await categoryService.create(newCategory);
      toast({
        title: "Success",
        description: "Category created successfully",
      });

      // Reset form and close dialog
      setNewCategory({
        name: "",
        description: "",
        icon: "",
        color: ""
      });
      setShowCreateCategoryDialog(false);

      // Reload categories
      loadDashboardData();
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      is_active: category.is_active
    });
    setShowEditCategoryDialog(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    if (!editCategoryData.name || !editCategoryData.description) {
      toast({
        title: "Error",
        description: "Please fill in category name and description",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await categoryService.update(editingCategory.id, editCategoryData);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });

      setEditingCategory(null);
      setEditCategoryData({});
      setShowEditCategoryDialog(false);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setLoading(true);
    try {
      await categoryService.delete(id);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    // Only super admins can create users
    if (user?.role !== 'super') {
      toast({
        title: "Access Denied",
        description: "Only super administrators can create users",
        variant: "destructive"
      });
      return;
    }

    if (!newUser.email || !newUser.password || !newUser.first_name || !newUser.last_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await adminService.createUser(newUser);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      
      // Reset form
      setNewUser({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        role: "user",
        gender: "",
        profession: "",
        is_active: true,
        is_medical_staff: false,
        is_approved_staff: false
      });
      setShowUserForm(false);
      
      // Reload users
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (userId: string) => {
    setLoading(true);
    try {
      const user = await adminService.getUserById(userId);
      setEditingUser(user);
      setEditUserData({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        gender: user.gender,
        profession: user.profession,
        is_active: user.is_active,
        is_medical_staff: user.is_medical_staff,
        is_approved_staff: user.is_approved_staff
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    setLoading(true);
    try {
      await adminService.updateUser(editingUser.id, editUserData);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      
      setEditingUser(null);
      setEditUserData({});
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (userId: string) => {
    setLoading(true);
    try {
      const user = await adminService.getUserById(userId);
      setSelectedUserId(userId);
      toast({
        title: "User Details",
        description: `${user.first_name} ${user.last_name} - ${user.email}`,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "users" && users.length === 0) {
      loadUsers();
    } else if (activeTab === "questions" && quizzes.length === 0) {
      loadQuizzes();
    }
  }, [activeTab]);

  // Load users when search term changes
  useEffect(() => {
    if (activeTab === "users") {
      const delayedSearch = setTimeout(() => {
        loadUsers();
      }, 500);
      
      return () => clearTimeout(delayedSearch);
    }
  }, [searchTerm]);

  const statsConfig = [
    { label: "Total Users", value: stats.total_users.toLocaleString(), icon: Users, color: "text-primary" },
    { label: "Active Quizzes", value: stats.active_quizzes.toString(), icon: Target, color: "text-secondary" },
    { label: "Total Questions", value: stats.total_questions.toLocaleString(), icon: FileText, color: "text-accent" },
    { label: "Completion Rate", value: `${stats.completion_rate}%`, icon: BarChart3, color: "text-success" },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
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
            <CardTitle>Recent Quizzes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : quizzes.slice(0, 4).map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                <div>
                  <div className="font-medium">{quiz.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {quiz.category_name} • {quiz.difficulty}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 rounded text-xs bg-success/20 text-success">
                    Active
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteQuiz(quiz.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {!loading && quizzes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No quizzes found
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="cyber" className="w-full justify-start" onClick={() => setActiveTab("questions")}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Quiz
            </Button>
            <Button variant="neon" className="w-full justify-start" onClick={() => setActiveTab("schedule")}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Challenge
            </Button>
            <Button variant="quiz" className="w-full justify-start" onClick={() => setActiveTab("users")}>
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button variant="quiz" className="w-full justify-start" onClick={() => {
              // Test API connectivity
              toast({
                title: "API Test",
                description: "Testing admin API endpoints...",
              });
              loadDashboardData();
            }}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Test Admin APIs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderQuestionManager = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quiz Manager</h2>
        <Button variant="cyber" onClick={() => loadQuizzes()}>
          <Plus className="mr-2 h-4 w-4" />
          Refresh Quizzes
        </Button>
      </div>

      {/* Create New Quiz Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newQuiz.category.toString()}
                onValueChange={(value) => setNewQuiz(prev => ({ ...prev, category: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={newQuiz.difficulty}
                onValueChange={(value: 'easy' | 'medium' | 'hard') => setNewQuiz(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input 
              id="title" 
              placeholder="Enter quiz title..."
              value={newQuiz.title}
              onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Enter quiz description..."
              className="min-h-[100px]"
              value={newQuiz.description}
              onChange={(e) => setNewQuiz(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time_limit">Time Limit (minutes)</Label>
              <Input 
                id="time_limit" 
                type="number"
                placeholder="30"
                value={newQuiz.time_limit}
                onChange={(e) => setNewQuiz(prev => ({ ...prev, time_limit: parseInt(e.target.value) || 30 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass_score">Pass Score (%)</Label>
              <Input 
                id="pass_score" 
                type="number"
                placeholder="70"
                value={newQuiz.pass_score}
                onChange={(e) => setNewQuiz(prev => ({ ...prev, pass_score: parseInt(e.target.value) || 70 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points_reward">Points Reward</Label>
              <Input 
                id="points_reward" 
                type="number"
                placeholder="100"
                value={newQuiz.points_reward}
                onChange={(e) => setNewQuiz(prev => ({ ...prev, points_reward: parseInt(e.target.value) || 100 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={newQuiz.start_time ? newQuiz.start_time.substring(0, 16) : ""}
                onChange={e => setNewQuiz(prev => ({ ...prev, start_time: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base">Questions ({newQuiz.questions_data?.length || 0})</Label>
              <Button variant="neon" onClick={() => setShowQuestionBuilder(!showQuestionBuilder)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>

            {/* Question List */}
            {newQuiz.questions_data && newQuiz.questions_data.length > 0 && (
              <div className="space-y-3">
                {newQuiz.questions_data.map((question, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{question.question_text}</div>
                        <div className="text-sm text-muted-foreground">
                          Type: {question.question_type} • Points: {question.points} • Answers: {question.answers.length}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removeQuestionFromQuiz(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Question Builder */}
            {showQuestionBuilder && (
              <Card className="border-2 border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg">Add Question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select
                        value={currentQuestion.question_type}
                        onValueChange={(value: 'multiple_choice' | 'true_false' | 'fill_blank') => 
                          setCurrentQuestion(prev => ({ ...prev, question_type: value, answers: [] }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True/False</SelectItem>
                          <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Points</Label>
                      <Input 
                        type="number" 
                        value={currentQuestion.points}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Textarea 
                      placeholder="Enter your question..."
                      value={currentQuestion.question_text}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question_text: e.target.value }))}
                    />
                  </div>

                  {/* Answers Section */}
                  {currentQuestion.question_type !== 'fill_blank' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Answers</Label>
                        {currentQuestion.question_type === 'multiple_choice' && (
                          <Button size="sm" variant="outline" onClick={addAnswerToQuestion}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Answer
                          </Button>
                        )}
                      </div>

                      {currentQuestion.question_type === 'true_false' && currentQuestion.answers.length === 0 && (
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              setCurrentQuestion(prev => ({
                                ...prev,
                                answers: [
                                  { answer_text: "True", is_correct: false, order: 1 },
                                  { answer_text: "False", is_correct: false, order: 2 }
                                ]
                              }));
                            }}
                          >
                            Generate True/False Options
                          </Button>
                        </div>
                      )}

                      {currentQuestion.answers.map((answer, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input 
                            placeholder={`Answer ${index + 1}`}
                            value={answer.answer_text}
                            onChange={(e) => updateAnswer(index, 'answer_text', e.target.value)}
                            className="flex-1"
                          />
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name="correct_answer"
                              checked={answer.is_correct}
                              onChange={() => {
                                // For single correct answer, uncheck others
                                setCurrentQuestion(prev => ({
                                  ...prev,
                                  answers: prev.answers.map((a, i) => ({
                                    ...a,
                                    is_correct: i === index
                                  }))
                                }));
                              }}
                            />
                            <Label className="text-sm">Correct</Label>
                          </div>
                          {currentQuestion.question_type === 'multiple_choice' && (
                            <Button size="sm" variant="ghost" onClick={() => removeAnswer(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Explanation</Label>
                    <Textarea 
                      placeholder="Explain the correct answer..."
                      value={currentQuestion.explanation}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="cyber" onClick={addQuestionToQuiz}>
                      Add Question
                    </Button>
                    <Button variant="ghost" onClick={() => setShowQuestionBuilder(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex space-x-4">
            <Button variant="cyber" onClick={handleCreateQuiz} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Quiz with Questions
            </Button>
            <Button variant="neon" onClick={loadSampleQuiz}>
              Load Sample Quiz
            </Button>
            <Button variant="ghost" onClick={() => {
              setNewQuiz({
                title: "",
                description: "",
                category: 0,
                difficulty: "easy",
                time_limit: 30,
                total_questions: 0,
                pass_score: 70,
                points_reward: 100,
                questions_data: []
              });
              setShowQuestionBuilder(false);
            }}>
              Reset Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <div className="font-medium">{quiz.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {quiz.category_name} • {quiz.difficulty} • {quiz.question_count} questions
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(quiz.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteQuiz(quiz.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {quizzes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No quizzes found. Create your first quiz above.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderUserManager = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex space-x-2">
          <Input 
            placeholder="Search users..." 
            className="w-64" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            variant="neon" 
            onClick={() => setShowUserForm(!showUserForm)}
            disabled={user?.role !== 'super'}
            title={user?.role !== 'super' ? "Only super admins can create users" : "Add User"}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Button variant="cyber" onClick={loadUsers}>
            <Users className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Create User Form */}
      {showUserForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userFirstName">First Name</Label>
                <Input 
                  id="userFirstName" 
                  placeholder="Enter first name..."
                  value={newUser.first_name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userLastName">Last Name</Label>
                <Input 
                  id="userLastName" 
                  placeholder="Enter last name..."
                  value={newUser.last_name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input 
                id="userEmail" 
                type="email"
                placeholder="Enter email address..."
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userPassword">Password</Label>
              <Input 
                id="userPassword" 
                type="password"
                placeholder="Enter password..."
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userPhone">Phone (optional)</Label>
                <Input 
                  id="userPhone" 
                  placeholder="Enter phone number..."
                  value={newUser.phone}
                  onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userRole">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userGender">Gender (optional)</Label>
                <Input 
                  id="userGender" 
                  placeholder="Enter gender..."
                  value={newUser.gender}
                  onChange={(e) => setNewUser(prev => ({ ...prev, gender: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userProfession">Profession (optional)</Label>
                <Input 
                  id="userProfession" 
                  placeholder="Enter profession..."
                  value={newUser.profession}
                  onChange={(e) => setNewUser(prev => ({ ...prev, profession: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="userActive"
                  checked={newUser.is_active}
                  onChange={(e) => setNewUser(prev => ({ ...prev, is_active: e.target.checked }))}
                />
                <Label htmlFor="userActive">Account Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="userMedical"
                  checked={newUser.is_medical_staff}
                  onChange={(e) => setNewUser(prev => ({ ...prev, is_medical_staff: e.target.checked }))}
                />
                <Label htmlFor="userMedical">Medical Staff</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="userApproved"
                  checked={newUser.is_approved_staff}
                  onChange={(e) => setNewUser(prev => ({ ...prev, is_approved_staff: e.target.checked }))}
                />
                <Label htmlFor="userApproved">Approved Staff</Label>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="cyber" onClick={handleCreateUser} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create User
              </Button>
              <Button variant="ghost" onClick={() => {
                setShowUserForm(false);
                setNewUser({
                  email: "",
                  password: "",
                  first_name: "",
                  last_name: "",
                  phone: "",
                  role: "user",
                  gender: "",
                  profession: "",
                  is_active: true,
                  is_medical_staff: false,
                  is_approved_staff: false
                });
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <Card>
          <CardHeader>
            <CardTitle>Edit User: {editingUser.first_name} {editingUser.last_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input 
                  id="editFirstName" 
                  placeholder="Enter first name..."
                  value={editUserData.first_name || ''}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input 
                  id="editLastName" 
                  placeholder="Enter last name..."
                  value={editUserData.last_name || ''}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input 
                id="editEmail" 
                type="email"
                placeholder="Enter email address..."
                value={editUserData.email || ''}
                onChange={(e) => setEditUserData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone</Label>
                <Input 
                  id="editPhone" 
                  placeholder="Enter phone number..."
                  value={editUserData.phone || ''}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Select
                  value={editUserData.role || 'user'}
                  onValueChange={(value) => setEditUserData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editGender">Gender</Label>
                <Input 
                  id="editGender" 
                  placeholder="Enter gender..."
                  value={editUserData.gender || ''}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, gender: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editProfession">Profession</Label>
                <Input 
                  id="editProfession" 
                  placeholder="Enter profession..."
                  value={editUserData.profession || ''}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, profession: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="editActive"
                  checked={editUserData.is_active || false}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
                <Label htmlFor="editActive">Account Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="editMedical"
                  checked={editUserData.is_medical_staff || false}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, is_medical_staff: e.target.checked }))}
                />
                <Label htmlFor="editMedical">Medical Staff</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="editApproved"
                  checked={editUserData.is_approved_staff || false}
                  onChange={(e) => setEditUserData(prev => ({ ...prev, is_approved_staff: e.target.checked }))}
                />
                <Label htmlFor="editApproved">Approved Staff</Label>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="cyber" onClick={handleUpdateUser} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update User
              </Button>
              <Button variant="ghost" onClick={() => {
                setEditingUser(null);
                setEditUserData({});
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Profession</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((currentUser) => (
                    <tr key={currentUser.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                            {currentUser.first_name?.[0] || currentUser.email[0].toUpperCase()}
                          </div>
                          <span className="font-medium">
                            {currentUser.first_name && currentUser.last_name 
                              ? `${currentUser.first_name} ${currentUser.last_name}`
                              : currentUser.email.split('@')[0]
                            }
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{currentUser.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          currentUser.is_active ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                        }`}>
                          {currentUser.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {currentUser.role && (
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            currentUser.role === 'super' ? 'bg-purple-500/20 text-purple-600' : 'bg-blue-500/20 text-blue-600'
                          }`}>
                            {currentUser.role}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {currentUser.profession || 'Not specified'}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleViewUser(currentUser.id.toString())}
                            title="View user details"
                          >
                            👁️
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEditUser(currentUser.id.toString())}
                            title="Edit user"
                            disabled={user?.role !== 'super' && currentUser.role === 'super'}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteUser(currentUser.id.toString())}
                            title={user?.role !== 'super' ? "Only super admins can delete users" : "Delete user"}
                            disabled={user?.role !== 'super'}
                            className={user?.role !== 'super' ? 'opacity-50 cursor-not-allowed' : ''}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found. {searchTerm ? 'Try a different search term.' : 'Create your first user above.'}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderCategoryManager = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Modules Management</h2>
        <Button variant="cyber" onClick={() => setShowCreateCategoryDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Module
        </Button>
      </div>

      {/* Existing Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Modules</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center space-x-4">
                    {category.icon && (
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                        {category.icon}
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {category.quiz_count} quizzes • Created: {new Date(category.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      category.is_active ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                    }`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => handleEditCategory(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No categories found. Create your first category above.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Category Dialog */}
      <Dialog open={showCreateCategoryDialog} onOpenChange={setShowCreateCategoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Module</DialogTitle>
            <DialogDescription>
              Add a new category module to your cybersecurity platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Module Name</Label>
              <Input
                id="categoryName"
                placeholder="Enter category name..."
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryDescription">Description</Label>
              <Textarea
                id="categoryDescription"
                placeholder="Enter category description..."
                className="min-h-[100px]"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex space-x-4 pt-4 border-t">
              <Button variant="ghost" onClick={() => {
                setShowCreateCategoryDialog(false);
                setNewCategory({
                  name: "",
                  description: "",
                  icon: "",
                  color: ""
                });
              }}>
                Cancel
              </Button>
              <Button variant="cyber" onClick={handleCreateCategory} disabled={loading} className="flex-1">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Module
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditCategoryDialog} onOpenChange={(open) => {
        setShowEditCategoryDialog(open);
        if (!open) {
          setEditingCategory(null);
          setEditCategoryData({});
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Module: {editingCategory?.name}</DialogTitle>
            <DialogDescription>
              Update the module information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="editCategoryName">Module Name</Label>
              <Input
                id="editCategoryName"
                placeholder="Enter category name..."
                value={editCategoryData.name || ''}
                onChange={(e) => setEditCategoryData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCategoryDescription">Description</Label>
              <Textarea
                id="editCategoryDescription"
                placeholder="Enter category description..."
                className="min-h-[100px]"
                value={editCategoryData.description || ''}
                onChange={(e) => setEditCategoryData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="editCategoryActive"
                checked={editCategoryData.is_active ?? false}
                onChange={(e) => setEditCategoryData(prev => ({ ...prev, is_active: e.target.checked }))}
              />
              <Label htmlFor="editCategoryActive">Module Active</Label>
            </div>

            <div className="flex space-x-4 pt-4 border-t">
              <Button variant="ghost" onClick={() => {
                setShowEditCategoryDialog(false);
                setEditingCategory(null);
                setEditCategoryData({});
              }}>
                Cancel
              </Button>
              <Button variant="cyber" onClick={handleUpdateCategory} disabled={loading} className="flex-1">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Module
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "categories", label: "Categories", icon: Target },
    { id: "questions", label: "Quizzes", icon: FileText },
    { id: "resources", label: "Resources", icon: FileText },
    { id: "users", label: "Users", icon: Users },
    // { id: "schedule", label: "Schedule", icon: Calendar },
    // { id: "settings", label: "Settings", icon: Settings },
  ];
  // Resource Manager UI
  // Add this to your AdminDashboard component, replacing the existing renderResourceManager function

// Add this to your AdminDashboard component, replacing the existing renderResourceManager function

const renderResourceManager = () => (
  <div className="space-y-8">
    <h2 className="text-2xl font-bold mb-4">Resources</h2>
    
    <Card>
      <CardHeader>
        <CardTitle>Add New Resource</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleCreateResource}>
          {/* Quiz Selection */}
          <div className="space-y-2">
            <Label htmlFor="resourceQuiz">Assign to Quiz (Optional)</Label>
            <Select
              value={newResource.quiz ? newResource.quiz.toString() : "none"}
              onValueChange={(value) => 
                setNewResource(prev => ({ 
                  ...prev, 
                  quiz: value === "none" ? undefined : parseInt(value)
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a quiz (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Quiz Assignment</SelectItem>
                {quizzes.map((quiz) => (
                  <SelectItem key={quiz.id} value={quiz.id.toString()}>
                    {quiz.title} ({quiz.category_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select a quiz to associate this resource with, or leave blank for general resources
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resourceDescription">Description</Label>
            <Textarea 
              id="resourceDescription"
              placeholder="Describe this resource..."
              value={newResource.description} 
              onChange={e => setNewResource(r => ({ ...r, description: e.target.value }))} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resourceFile">Raw File (PDF, DOC, TXT, etc.)</Label>
            <Input 
              id="resourceFile"
              type="file" 
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx" 
              onChange={e => handleResourceFileChange(e, 'raw_file')} 
            />
          </div>
          
          {/* <div className="space-y-2">
            <Label htmlFor="resourceImage">Image</Label>
            <Input 
              id="resourceImage"
              type="file" 
              accept="image/*" 
              onChange={e => handleResourceFileChange(e, 'image')} 
            />
          </div> */}
          
          <Button type="submit" variant="cyber" disabled={resourceLoading}>
            {resourceLoading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Add Resource
          </Button>
        </form>
      </CardContent>
    </Card>

    {/* Existing Resources */}
    <Card>
      <CardHeader>
        <CardTitle>Existing Resources</CardTitle>
      </CardHeader>
      <CardContent>
        {resourceLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin h-6 w-6" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.map(res => (
              <Card key={res.id} className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Resource #{res.id}</CardTitle>
                  {res.quiz_title && (
                    <div className="text-sm text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                      📚 Assigned to: {res.quiz_title}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium text-sm">Description:</span>
                    <p className="text-sm text-muted-foreground mt-1">{res.description}</p>
                  </div>
                  
                  {res.raw_file && (
                    <div>
                      <a 
                        href={res.raw_file} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-sm text-primary hover:text-primary/80 underline"
                      >
                        📄 Download File
                      </a>
                    </div>
                  )}
                  
                  {res.image && (
                    <div>
                      <img 
                        src={res.image} 
                        alt="Resource" 
                        className="max-h-32 w-full object-cover rounded border" 
                      />
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Uploaded: {new Date(res.uploaded_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {resources.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No resources found. Add your first resource above.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-gradient-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your cybersecurity learning platform</p>
          </div>
        </div>
        
        {/* User Role Badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-muted/20 rounded-lg border">
            {user?.role === 'super' ? (
              <Crown className="h-4 w-4 text-purple-600" />
            ) : (
              <UserCheck className="h-4 w-4 text-blue-600" />
            )}
            <div className="text-sm">
              <div className="font-medium">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                {user?.role || 'Unknown'} Role
              </div>
            </div>
          </div>
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
  {activeTab === "categories" && renderCategoryManager()}
  {activeTab === "users" && renderUserManager()}
  {activeTab === "resources" && renderResourceManager()}
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