import { useEffect, useState } from "react";
import NavHeader from "@/components/NavHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { progressService, badgeService, type UserProgress, type Badge as ApiBadge } from "@/lib/api-services";
import { tokenManager } from "@/lib/api-client";
import {
  User,
  Mail,
  Phone,
  Shield,
  Trophy,
  Star,
  TrendingUp,
  Calendar,
  Award,
  Edit,
  Save,
  X,
  Loader2,
  Zap,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [userBadges, setUserBadges] = useState<ApiBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    profession: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [progressResponse, badgesResponse] = await Promise.all([
          progressService.getUserProgress(),
          badgeService.getUserBadges()
        ]);

        setUserProgress(progressResponse);
        setUserBadges(badgesResponse.earned_badges || []);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        profession: user.profession || '',
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        profession: user.profession || '',
      });
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User ID not found",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      // Create FormData for multipart/form-data request
      const formDataToSend = new FormData();

      // Add only the fields that were changed
      if (formData.first_name !== user.first_name) {
        formDataToSend.append('first_name', formData.first_name);
      }
      if (formData.last_name !== user.last_name) {
        formDataToSend.append('last_name', formData.last_name);
      }
      if (formData.phone !== (user.phone || '')) {
        formDataToSend.append('phone', formData.phone);
      }
      if (formData.profession !== (user.profession || '')) {
        formDataToSend.append('profession', formData.profession);
      }

      // Get the access token
      const accessToken = tokenManager.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token found. Please log in again.');
      }

      // Call the API client directly since we need FormData
      const response = await fetch(`http://84.247.167.2:4001/auth/v1/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      console.log('Profile updated:', result);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);

      // Optionally reload the page or update the auth context
      // For now, we'll just close the edit mode
      // You might want to add a method to refresh the user data in AuthContext
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const completionRate = userProgress && userProgress.total_quizzes_taken > 0
    ? Math.round((userProgress.total_quizzes_passed / userProgress.total_quizzes_taken) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account and view your achievements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm font-medium p-2 rounded bg-muted">{user?.first_name || 'N/A'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-sm font-medium p-2 rounded bg-muted">{user?.last_name || 'N/A'}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center space-x-2 text-sm font-medium p-2 rounded bg-muted">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 rounded bg-muted">{user?.phone || 'Not provided'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  {isEditing ? (
                    <Input
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      placeholder="e.g., Security Analyst, Developer"
                    />
                  ) : (
                    <p className="text-sm font-medium p-2 rounded bg-muted">{user?.profession || 'Not provided'}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex items-center space-x-2 pt-4">
                    <Button onClick={handleSave} disabled={saving} className="flex-1">
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={saving}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Account Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Type</span>
                  <Badge variant="outline">{user?.role || 'User'}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={user?.is_active ? "default" : "destructive"}>
                    {user?.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {user?.gender && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Gender</span>
                    <span className="text-sm font-medium">{user.gender}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Earned Badges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userBadges.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userBadges.map((badge) => (
                      <div key={badge.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-muted/20">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{badge.name}</div>
                          <div className="text-xs text-muted-foreground">{badge.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No badges earned yet</p>
                    <p className="text-sm text-muted-foreground">Complete quizzes to unlock achievements!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Progress */}
          <div className="space-y-6">
            {/* Overview Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-gradient-primary/10">
                  <div className="text-3xl font-bold text-primary">{userProgress?.total_points || 0}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Total XP
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Level
                    </span>
                    <Badge variant="outline" className="font-bold">{userProgress?.level || 1}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Quizzes Taken
                    </span>
                    <span className="text-sm font-bold">{userProgress?.total_quizzes_taken || 0}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      Quizzes Passed
                    </span>
                    <span className="text-sm font-bold">{userProgress?.total_quizzes_passed || 0}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Success Rate
                    </span>
                    <span className="text-sm font-bold">{completionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Streak Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Streaks</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
                  <div className="text-3xl font-bold text-orange-500">{userProgress?.current_streak || 0}</div>
                  <div className="text-sm text-muted-foreground">Current Streak</div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Longest Streak</span>
                  <span className="text-sm font-bold">{userProgress?.longest_streak || 0} days</span>
                </div>

                {userProgress?.last_quiz_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Quiz</span>
                    <span className="text-sm font-medium">
                      {new Date(userProgress.last_quiz_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/categories">
                    <Target className="h-4 w-4 mr-2" />
                    Browse Quizzes
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/progress">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Progress
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/leaderboard">
                    <Trophy className="h-4 w-4 mr-2" />
                    Leaderboard
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;