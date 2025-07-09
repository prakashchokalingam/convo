# ConvoForms shadcn/ui Component Architecture

## Professional Component System Built on shadcn/ui Foundation

---

## 🏗️ **Architecture Overview**

The ConvoForms component system uses **shadcn/ui as the foundation** with custom components built on top. This approach provides proven accessibility, excellent developer experience, and zero maintenance overhead while allowing full customization for ConvoForms-specific needs.

---

## 📂 **shadcn/ui Component Structure**

```
components/
├── ui/                           # shadcn/ui foundation components
│   ├── button.tsx               # Base Button component
│   ├── card.tsx                 # Base Card component
│   ├── input.tsx                # Base Input component
│   ├── form.tsx                 # Form components (Field, Label, etc.)
│   ├── dialog.tsx               # Modal and dialog components
│   ├── dropdown-menu.tsx        # Dropdown and context menus
│   ├── table.tsx                # Data table components
│   ├── badge.tsx                # Status badges and labels
│   ├── alert.tsx                # Alert and notification components
│   ├── tabs.tsx                 # Tab navigation
│   ├── select.tsx               # Select dropdowns
│   ├── checkbox.tsx             # Checkbox inputs
│   ├── radio-group.tsx          # Radio button groups
│   ├── textarea.tsx             # Text area inputs
│   ├── label.tsx                # Form labels
│   ├── separator.tsx            # Divider components
│   ├── skeleton.tsx             # Loading skeletons
│   ├── toast.tsx                # Toast notifications
│   └── index.ts                 # Export barrel
├── app/                         # ConvoForms-specific components
│   ├── dashboard/               # Dashboard components built on shadcn/ui
│   │   ├── stats-card.tsx       # Enhanced stats using Card
│   │   ├── quick-actions.tsx    # Action panel using Button + Card
│   │   ├── activity-feed.tsx    # Activity list using Card + Badge
│   │   └── index.ts
│   ├── form-builder/            # Form builder UI (shadcn/ui + logic)
│   │   ├── field-library.tsx    # Field palette using Card + Button
│   │   ├── form-canvas.tsx      # Canvas using Card styling
│   │   ├── properties-panel.tsx # Properties using Form components
│   │   ├── form-preview.tsx     # Preview using Dialog
│   │   └── index.ts
│   ├── workspace/               # Workspace components
│   │   ├── workspace-switcher.tsx # Switcher using DropdownMenu
│   │   ├── workspace-settings.tsx # Settings using Form + Tabs
│   │   └── index.ts
│   └── layout/                  # Layout components
│       ├── app-header.tsx       # Header using shadcn/ui components
│       ├── app-sidebar.tsx      # Sidebar using Button + Card
│       ├── app-layout.tsx       # Layout wrapper
│       └── index.ts
├── shared/                      # Shared across all contexts
│   ├── theme/                   # Theme provider (shadcn/ui)
│   │   ├── theme-provider.tsx   # next-themes integration
│   │   └── index.ts
│   ├── error-boundary.tsx       # Error handling
│   └── loading.tsx              # Loading components
├── marketing/                   # Marketing site components (unchanged)
└── forms/                       # Public form components (enhanced with shadcn/ui)
```

---

## 🎨 **shadcn/ui Component Examples**

### **Enhanced Button Usage**

```typescript
// components/app/dashboard/quick-actions.tsx
import { Button } from '@/components/ui/button'
import { Plus, BarChart3, Settings } from 'lucide-react'

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Button variant="default" size="lg" className="h-auto p-4 flex-col gap-2">
        <Plus className="h-5 w-5" />
        <span>Create Form</span>
      </Button>

      <Button variant="outline" size="lg" className="h-auto p-4 flex-col gap-2">
        <BarChart3 className="h-5 w-5" />
        <span>View Analytics</span>
      </Button>

      <Button variant="ghost" size="lg" className="h-auto p-4 flex-col gap-2">
        <Settings className="h-5 w-5" />
        <span>Settings</span>
      </Button>
    </div>
  )
}
```

### **Enhanced Card Components**

```typescript
// components/app/dashboard/stats-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down'
    period: string
  }
  icon?: React.ReactNode
}

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-3">
              <p className="text-2xl font-bold">{value}</p>
              {change && (
                <Badge
                  variant={change.trend === 'up' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {change.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {change.value}%
                </Badge>
              )}
            </div>
            {change && (
              <p className="text-xs text-muted-foreground">
                from {change.period}
              </p>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="h-6 w-6 text-primary">
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

### **Enhanced Form Components**

```typescript
// components/app/form-builder/properties-panel.tsx
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

interface PropertiesPanelProps {
  selectedField: FormField | null
  onFieldUpdate: (field: FormField) => void
}

export function PropertiesPanel({ selectedField, onFieldUpdate }: PropertiesPanelProps) {
  if (!selectedField) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>Select a field to edit its properties</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Label</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter field label..." />
                </FormControl>
                <FormDescription>
                  This label will be visible to form respondents.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">Text Input</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="textarea">Text Area</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="required"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Required Field</FormLabel>
                  <FormDescription>
                    Respondents must fill this field to submit the form.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="placeholder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placeholder Text</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter placeholder..." />
                </FormControl>
                <FormDescription>
                  Hint text shown inside the input field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Update Field
          </Button>
        </form>
      </Form>
    </div>
  )
}
```

---

## 🏗️ **Layout Components (shadcn/ui Based)**

### **AppLayout Component**

```typescript
// components/app/layout/app-layout.tsx
import { cn } from '@/lib/utils'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

interface AppLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <AppHeader />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### **AppHeader Component**

```typescript
// components/app/layout/app-header.tsx
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Bell, Search, User } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-4 flex">
          <h1 className="text-xl font-bold">ConvoForms</h1>
        </div>

        {/* Search */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button
              variant="outline"
              className="inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline-flex">Search forms...</span>
              <span className="inline-flex lg:hidden">Search...</span>
              <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
```

### **AppSidebar Component**

```typescript
// components/app/layout/app-sidebar.tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  BarChart3,
  Plus
} from 'lucide-react'

interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
    { name: 'Forms', href: '/forms', icon: FileText, current: false, count: 12 },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, current: false },
    { name: 'Team', href: '/team', icon: Users, current: false },
    { name: 'Settings', href: '/settings', icon: Settings, current: false },
  ]

  return (
    <div className={cn("w-64 border-r bg-muted/10", className)}>
      <div className="flex h-full flex-col gap-2 p-4">
        {/* Quick Create */}
        <Card className="p-4">
          <Button className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </Card>

        {/* Navigation */}
        <nav className="flex flex-col space-y-1">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={item.current ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                item.current && "bg-primary text-primary-foreground"
              )}
              asChild
            >
              <a href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
                {item.count && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </a>
            </Button>
          ))}
        </nav>

        {/* Workspace Info */}
        <div className="mt-auto">
          <Card className="p-3">
            <div className="text-sm">
              <p className="font-medium">My Workspace</p>
              <p className="text-muted-foreground">Free Plan</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

---

## 🎭 **Form Builder Components (shadcn/ui UI Only)**

### **FormBuilder Main Component**

```typescript
// components/app/form-builder/form-builder.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FieldLibrary } from './field-library'
import { FormCanvas } from './form-canvas'
import { PropertiesPanel } from './properties-panel'

export function FormBuilder() {
  return (
    <div className="flex h-full">
      {/* Field Library */}
      <div className="w-64 border-r bg-muted/10">
        <Card className="h-full rounded-none border-0">
          <CardHeader>
            <CardTitle className="text-lg">Field Library</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldLibrary />
          </CardContent>
        </Card>
      </div>

      {/* Form Canvas */}
      <div className="flex-1 bg-background">
        <div className="h-full p-6">
          <FormCanvas />
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 border-l bg-muted/10">
        <Card className="h-full rounded-none border-0">
          <CardHeader>
            <CardTitle className="text-lg">Properties</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <PropertiesPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### **Field Library Component**

```typescript
// components/app/form-builder/field-library.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Type,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  Radio,
  List,
  FileText
} from 'lucide-react'

const fieldTypes = [
  { id: 'text', name: 'Text Input', icon: Type, category: 'Basic' },
  { id: 'email', name: 'Email', icon: Mail, category: 'Basic' },
  { id: 'phone', name: 'Phone', icon: Phone, category: 'Basic' },
  { id: 'date', name: 'Date', icon: Calendar, category: 'Basic' },
  { id: 'checkbox', name: 'Checkbox', icon: CheckSquare, category: 'Choice' },
  { id: 'radio', name: 'Radio', icon: Radio, category: 'Choice' },
  { id: 'select', name: 'Dropdown', icon: List, category: 'Choice' },
  { id: 'textarea', name: 'Text Area', icon: FileText, category: 'Advanced' },
]

export function FieldLibrary() {
  const categories = [...new Set(fieldTypes.map(field => field.category))]

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <div key={category} className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <div className="space-y-1">
            {fieldTypes
              .filter(field => field.category === category)
              .map(field => (
                <Button
                  key={field.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('field-type', field.id)
                  }}
                >
                  <field.icon className="mr-2 h-4 w-4" />
                  <span className="text-sm">{field.name}</span>
                </Button>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## 📱 **Responsive Design Patterns**

### **Dashboard Grid with shadcn/ui**

```typescript
// Responsive dashboard layout
export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your forms.
          </p>
        </div>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Create Form
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Forms" value={12} />
        <StatsCard title="Total Responses" value="1,284" />
        <StatsCard title="Completion Rate" value="87%" />
        <StatsCard title="Active Forms" value={8} />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Activity feed */}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

## ♿ **Accessibility (Built-in with shadcn/ui)**

### **Form Accessibility**

```typescript
// shadcn/ui provides excellent accessibility out of the box
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="formName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Form Name *</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="Enter form name"
              aria-describedby="form-name-description form-name-error"
            />
          </FormControl>
          <FormDescription id="form-name-description">
            Choose a descriptive name for your form.
          </FormDescription>
          <FormMessage id="form-name-error" />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### **Navigation Accessibility**

```typescript
// Accessible navigation with proper ARIA labels
<nav role="navigation" aria-label="Main navigation">
  {navigation.map((item) => (
    <Button
      key={item.name}
      variant={item.current ? "default" : "ghost"}
      className="w-full justify-start"
      aria-current={item.current ? "page" : undefined}
      asChild
    >
      <a href={item.href}>
        <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
        {item.name}
      </a>
    </Button>
  ))}
</nav>
```

---

## 🛠️ **Utility Functions & Hooks**

### **shadcn/ui Utilities**

```typescript
// lib/utils.ts (provided by shadcn/ui)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage in components
<Card className={cn("hover:shadow-lg transition-shadow", className)}>
```

### **Theme Hook**

```typescript
// hooks/use-theme.ts
import { useTheme } from 'next-themes';

export function useConvoTheme() {
  const { theme, setTheme } = useTheme();

  return {
    theme,
    setTheme,
    isDark: theme === 'dark',
    toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light'),
  };
}
```

---

This shadcn/ui-based component architecture provides ConvoForms with a solid, maintainable, and accessible foundation while allowing for complete customization and extension! 🎨⚡
