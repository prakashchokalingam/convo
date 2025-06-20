'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState } from "react"
import { 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Plus, 
  Settings,
  Mail,
  Eye,
  EyeOff,
  CheckCircle
} from "lucide-react"

function StatsCard({ title, value, description, icon: Icon, trend }: {
  title: string
  value: string | number
  description?: string
  icon: any
  trend?: { value: number, direction: 'up' | 'down' }
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
              {trend.direction === 'up' ? '↗' : '↘'} {trend.value}%
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function SampleForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your details to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="email" 
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pr-10"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">Cancel</Button>
        <Button className="flex-1">Create Account</Button>
      </CardFooter>
    </Card>
  )
}

export default function ShadcnTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                ConvoForms with shadcn/ui
              </h1>
              <p className="text-muted-foreground">
                Clean, simple, and professional components for our MVP
              </p>
            </div>
            <Badge variant="secondary">MVP Ready</Badge>
          </div>
          
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Much Simpler Approach!</AlertTitle>
            <AlertDescription>
              Using shadcn/ui gives us professional components without over-engineering.
              Perfect for MVP development and faster iteration.
            </AlertDescription>
          </Alert>
        </div>

        {/* Stats Dashboard */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Dashboard Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Forms"
              value={42}
              description="Active and draft forms"
              icon={FileText}
              trend={{ value: 12, direction: 'up' }}
            />
            <StatsCard
              title="Responses"
              value="1,284"
              description="Form submissions"
              icon={MessageSquare}
              trend={{ value: 8, direction: 'up' }}
            />
            <StatsCard
              title="Completion Rate"
              value="87%"
              description="Average completion"
              icon={BarChart3}
              trend={{ value: 5, direction: 'up' }}
            />
            <StatsCard
              title="Active Users"
              value={156}
              description="This month"
              icon={Users}
              trend={{ value: 3, direction: 'down' }}
            />
          </div>
        </div>

        {/* Components Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Example */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Form Components</h3>
            <SampleForm />
          </div>

          {/* Button Examples */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Button Variants</h3>
            <Card>
              <CardHeader>
                <CardTitle>Button Examples</CardTitle>
                <CardDescription>
                  Clean and consistent button variants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    With Icon
                  </Button>
                  <Button disabled>Disabled</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Why shadcn/ui for ConvoForms MVP?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">✅ Advantages</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Battle-tested components</li>
                  <li>• Excellent accessibility</li>
                  <li>• Fast implementation</li>
                  <li>• Consistent design</li>
                  <li>• Zero maintenance overhead</li>
                  <li>• Focus on product features</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">🎯 Perfect for MVP</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Ship faster</li>
                  <li>• Professional appearance</li>
                  <li>• Easy to customize later</li>
                  <li>• Great developer experience</li>
                  <li>• Industry standard</li>
                  <li>• Proven reliability</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
