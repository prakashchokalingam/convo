'use client'

import React, { useState, useCallback } from 'react'
import { FormBuilder } from '@/components/form-builder/core/FormBuilder'
import { FormConfig } from '@/lib/form-builder/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Eye, Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme'

export default function FormBuilderTestPage() {
  const [savedConfig, setSavedConfig] = useState<FormConfig | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleSave = useCallback((config: FormConfig) => {
    setSavedConfig(config)
    console.log('Form saved:', config)
    
    // Here you would typically save to your database
    // Example API call:
    // await fetch('/api/forms', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(config)
    // })
    
    alert('Form saved successfully!')
  }, [])

  const handlePreview = useCallback((config: FormConfig) => {
    setSavedConfig(config)
    setShowPreview(true)
  }, [])

  const handleExportConfig = useCallback(() => {
    if (savedConfig) {
      const dataStr = JSON.stringify(savedConfig, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `${savedConfig.name.replace(/\s+/g, '_').toLowerCase()}_config.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
  }, [savedConfig])

  if (showPreview && savedConfig) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-background border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowPreview(false)}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Builder</span>
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Form Preview</h1>
                  <p className="text-sm text-muted-foreground">Preview how your form will look to users</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleExportConfig}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Config
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>{savedConfig.settings.title}</CardTitle>
              {savedConfig.description && (
                <CardDescription>{savedConfig.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {savedConfig.fields
                  .sort((a, b) => a.order - b.order)
                  .map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.hint && (
                      <p className="text-xs text-muted-foreground">{field.hint}</p>
                    )}
                    <div className="bg-muted p-3 rounded border">
                      <span className="text-sm text-muted-foreground">
                        {field.type} field placeholder
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <Button className="w-full">
                    {savedConfig.settings.submitButtonText}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="flex items-center space-x-2" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Form Builder</h1>
                <p className="text-muted-foreground">Create and customize forms with drag & drop</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {savedConfig && (
                <>
                  <Button variant="outline" onClick={() => setShowPreview(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" onClick={handleExportConfig}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Builder */}
      <div className="h-[calc(100vh-140px)]">
        <FormBuilder
          onSave={handleSave}
          onPreview={handlePreview}
          initialConfig={{
            name: 'My New Form',
            description: 'A sample form to get you started'
          }}
        />
      </div>

      {/* Debug Panel */}
      {savedConfig && (
        <div className="fixed bottom-4 right-4 max-w-sm">
          <Card className="bg-card border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs">
              <div className="space-y-1">
                <div>Fields: {savedConfig.fields.length}</div>
                <div>Required: {savedConfig.fields.filter(f => f.required).length}</div>
                <div>Last saved: {new Date(savedConfig.metadata.updatedAt).toLocaleTimeString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}