"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle, useThemeConfig } from "@/components/theme"
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Check, 
  X, 
  AlertTriangle, 
  Info,
  Plus,
  Edit,
  Trash2,
  Settings,
  User,
  Mail,
  Lock,
  Search,
  Bell,
  Heart,
  Star,
  Download,
  Upload
} from "lucide-react"

export default function ThemeDemoPage() {
  const themeConfig = useThemeConfig()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Theme Showcase</h1>
              <p className="text-muted-foreground">
                Current theme: <span className="font-medium">{themeConfig.theme}</span> 
                {themeConfig.isSystem && ` (resolved: ${themeConfig.resolvedTheme})`}
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Theme Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Configuration
            </CardTitle>
            <CardDescription>
              Global theme system with automatic dark mode support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={themeConfig.theme === "light" ? "default" : "outline"}
                onClick={() => themeConfig.setTheme("light")}
                className="justify-start"
              >
                <Sun className="mr-2 h-4 w-4" />
                Light Mode
              </Button>
              <Button
                variant={themeConfig.theme === "dark" ? "default" : "outline"}
                onClick={() => themeConfig.setTheme("dark")}
                className="justify-start"
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark Mode
              </Button>
              <Button
                variant={themeConfig.theme === "system" ? "default" : "outline"}
                onClick={() => themeConfig.setTheme("system")}
                className="justify-start"
              >
                <Monitor className="mr-2 h-4 w-4" />
                System
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>
              Semantic color tokens that adapt to the current theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-12 bg-primary rounded-md border"></div>
                <p className="text-sm font-medium">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-secondary rounded-md border"></div>
                <p className="text-sm font-medium">Secondary</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-muted rounded-md border"></div>
                <p className="text-sm font-medium">Muted</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-accent rounded-md border"></div>
                <p className="text-sm font-medium">Accent</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-destructive rounded-md border"></div>
                <p className="text-sm font-medium">Destructive</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-success rounded-md border"></div>
                <p className="text-sm font-medium">Success</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-warning rounded-md border"></div>
                <p className="text-sm font-medium">Warning</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-info rounded-md border"></div>
                <p className="text-sm font-medium">Info</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>
              All button styles work seamlessly across themes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>
              Form controls that adapt to the theme automatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="search" placeholder="Search..." className="pl-10" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="textarea">Message</Label>
                  <Textarea id="textarea" placeholder="Type your message here..." />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
            <CardDescription>
              Various states and status indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge className="bg-success text-success-foreground">Success</Badge>
              <Badge className="bg-warning text-warning-foreground">Warning</Badge>
              <Badge className="bg-info text-info-foreground">Info</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-success" />
                <span>Operation completed successfully</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>Warning: Please review your settings</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <X className="h-4 w-4 text-destructive" />
                <span>Error: Something went wrong</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-info" />
                <span>Information: New features available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards & Surfaces */}
        <Card>
          <CardHeader>
            <CardTitle>Surface Variations</CardTitle>
            <CardDescription>
              Different surface levels and elevations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Standard Card</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Default card background with border
                </CardContent>
              </Card>
              
              <Card className="bg-surface-elevated">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Elevated Surface</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Slightly elevated surface level
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Glass Card</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Glassmorphism effect with backdrop blur
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Elements</CardTitle>
            <CardDescription>
              Hover and focus states that work in all themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="ghost" className="h-20 flex-col gap-2">
                <User className="h-6 w-6" />
                Profile
              </Button>
              <Button variant="ghost" className="h-20 flex-col gap-2">
                <Settings className="h-6 w-6" />
                Settings
              </Button>
              <Button variant="ghost" className="h-20 flex-col gap-2">
                <Bell className="h-6 w-6" />
                Notifications
              </Button>
              <Button variant="ghost" className="h-20 flex-col gap-2">
                <Mail className="h-6 w-6" />
                Messages
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Elements</CardTitle>
            <CardDescription>
              Navigation components with theme support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-1 rounded-lg bg-muted p-1">
                <Button variant="ghost" size="sm" className="nav-item-active">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
                <Button variant="ghost" size="sm" className="nav-item">
                  <Lock className="mr-2 h-4 w-4" />
                  Security
                </Button>
                <Button variant="ghost" size="sm" className="nav-item">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Star className="mr-2 h-4 w-4" />
                  Starred
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Download className="mr-2 h-4 w-4" />
                  Downloads
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Upload className="mr-2 h-4 w-4" />
                  Uploads
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Builder Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Form Builder Preview</CardTitle>
            <CardDescription>
              How form builder components look in the current theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Field Library</h4>
                <div className="space-y-2">
                  <div className="field-item p-3 group cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="field-item-icon w-8 h-8 rounded-md flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-foreground">Text Input</h5>
                        <p className="text-xs text-muted-foreground">Single line text field</p>
                      </div>
                    </div>
                  </div>
                  <div className="field-item p-3 group cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="field-item-icon w-8 h-8 rounded-md flex items-center justify-center">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-foreground">Email Field</h5>
                        <p className="text-xs text-muted-foreground">Email validation included</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Form Canvas</h4>
                <div className="form-container p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm py-8">
          <p>Theme system fully implemented with {themeConfig.isDark ? 'dark' : 'light'} mode active</p>
          <p className="mt-2">All components automatically adapt to theme changes</p>
        </div>
      </div>
    </div>
  )
}