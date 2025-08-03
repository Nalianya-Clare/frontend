import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoryService, type Category as ApiCategory } from "@/lib/api-services";
import { 
  Shield, 
  Search, 
  Users, 
  Target, 
  Lock, 
  Globe, 
  Zap, 
  Eye,
  Bug,
  Network,
  FileText,
  Skull,
  Loader2
} from "lucide-react";

const Categories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getAll();
        console.log('Categories API Response:', response); // Debug log
        setCategories(response.results || []);
        setError(null);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
        // Log the actual error for debugging
        console.error('Full error details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && category.is_active;
  });

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'shield': Shield,
      'search': Search,
      'users': Users,
      'target': Target,
      'lock': Lock,
      'globe': Globe,
      'zap': Zap,
      'eye': Eye,
      'bug': Bug,
      'network': Network,
      'file-text': FileText,
      'skull': Skull,
      'test': Target, // Fallback for your test icon
    };
    return iconMap[iconName] || Shield;
  };

  const getBgColor = (color: string) => {
    // Convert hex color to a light background variant
    return 'bg-primary/10';
  };

  const getTextColor = (color: string) => {
    // Convert hex color to text color
    return 'text-primary';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Cybersecurity Categories
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Master cybersecurity through specialized challenges across multiple domains. 
            Choose your focus area and start building expertise today.
          </p>
        </div>

        {/* Search Control */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-md mx-auto">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-primary">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-secondary">
                {categories.reduce((sum, cat) => sum + (typeof cat.quiz_count === 'number' ? cat.quiz_count : parseInt(cat.quiz_count || '0', 10)), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Quizzes</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4 md:col-span-1 col-span-2">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-accent">Active</div>
              <div className="text-sm text-muted-foreground">Platform Status</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            
            return (
              <Card 
                key={category.id} 
                className="group hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/50"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${getBgColor(category.color)} group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-6 w-6 ${getTextColor(category.color)}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {category.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quizzes</span>
                      <span className="font-medium">{category.quiz_count}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="cyber" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/category/${category.id}/quizzes`)}
                    >
                      Start Challenge
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
