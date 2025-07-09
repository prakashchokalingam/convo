'use client';

import { RefreshCw, Download, ExternalLink, Code2, Book, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/ui/card';
import { Separator } from '@/components/shared/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/tabs';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center h-96'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      <span className='ml-2 text-gray-600'>Loading API Documentation...</span>
    </div>
  ),
});

interface ApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
    'x-generated-at'?: string;
    'x-server-version'?: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, unknown>;
  components: {
    schemas: Record<string, unknown>;
    securitySchemes: Record<string, unknown>;
  };
  tags: Array<{
    name: string;
    description: string;
  }>;
}

interface GenerationMetadata {
  routesCount: number;
  schemasCount: number;
  generatedAt: string;
  version: string;
}

export default function ApiDocumentationPage() {
  const [spec, setSpec] = useState<ApiSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<GenerationMetadata | null>(null);

  const loadApiSpec = async () => {
    try {
      setError(null);
      const response = await fetch('/api/docs');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load API documentation');
      }

      const apiSpec = await response.json();
      setSpec(apiSpec);

      // Extract metadata if available
      if (apiSpec.info) {
        setMetadata({
          routesCount: Object.keys(apiSpec.paths || {}).length,
          schemasCount: Object.keys(apiSpec.components?.schemas || {}).length,
          generatedAt: apiSpec.info['x-generated-at'] || new Date().toISOString(),
          version: apiSpec.info.version || '1.0.0',
        });
      }
    } catch (err) {
      console.error('Error loading API spec:', err);
      setError(err instanceof Error ? err.message : 'Failed to load API documentation');
    } finally {
      setLoading(false);
    }
  };

  const regenerateDocumentation = async () => {
    try {
      setRegenerating(true);
      setError(null);

      const response = await fetch('/api/docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to regenerate documentation');
      }

      const result = await response.json();

      if (result.metadata) {
        setMetadata(result.metadata);
      }

      // Reload the spec after regeneration
      await loadApiSpec();
    } catch (err) {
      console.error('Error regenerating documentation:', err);
      setError(err instanceof Error ? err.message : 'Failed to regenerate documentation');
    } finally {
      setRegenerating(false);
    }
  };

  const downloadSpec = () => {
    if (!spec) {
      return;
    }

    const dataStr = JSON.stringify(spec, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `convo-forms-api-v${spec.info.version}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  useEffect(() => {
    loadApiSpec();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>Loading API Documentation</h2>
          <p className='text-gray-600'>Please wait while we load the documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <Card className='max-w-md w-full'>
          <CardHeader>
            <CardTitle className='text-red-600'>Documentation Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <p className='text-sm text-gray-600'>
                The API documentation could not be loaded. This might happen if:
              </p>
              <ul className='text-sm text-gray-600 list-disc list-inside space-y-1'>
                <li>Documentation hasn&apos;t been generated yet</li>
                <li>There was an error in the generation process</li>
                <li>API routes have JSDoc syntax errors</li>
              </ul>
              <div className='flex gap-2'>
                <Button onClick={regenerateDocumentation} disabled={regenerating}>
                  {regenerating && <RefreshCw className='w-4 h-4 mr-2 animate-spin' />}
                  Generate Documentation
                </Button>
                <Button variant='outline' onClick={loadApiSpec}>
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <Book className='w-8 h-8 text-blue-600' />
                <div>
                  <h1 className='text-xl font-bold text-gray-900'>
                    {spec?.info.title || 'API Documentation'}
                  </h1>
                  <p className='text-sm text-gray-500'>
                    Version {spec?.info.version} • OpenAPI {spec?.openapi}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              {metadata && (
                <div className='hidden md:flex items-center space-x-4 text-sm text-gray-600'>
                  <span>{metadata.routesCount} endpoints</span>
                  <span>{metadata.schemasCount} schemas</span>
                  <span>Updated {new Date(metadata.generatedAt).toLocaleDateString()}</span>
                </div>
              )}

              <Button variant='outline' size='sm' onClick={downloadSpec} className='hidden sm:flex'>
                <Download className='w-4 h-4 mr-2' />
                Download OpenAPI
              </Button>

              <Button size='sm' onClick={regenerateDocumentation} disabled={regenerating}>
                {regenerating ? (
                  <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <RefreshCw className='w-4 h-4 mr-2' />
                )}
                Regenerate
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Tabs defaultValue='documentation' className='w-full'>
          <TabsList className='grid w-full grid-cols-3 mb-8'>
            <TabsTrigger value='documentation' className='flex items-center space-x-2'>
              <Book className='w-4 h-4' />
              <span>Documentation</span>
            </TabsTrigger>
            <TabsTrigger value='overview' className='flex items-center space-x-2'>
              <Zap className='w-4 h-4' />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value='schemas' className='flex items-center space-x-2'>
              <Code2 className='w-4 h-4' />
              <span>Schemas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='documentation' className='mt-0'>
            <Card>
              <CardContent className='p-0'>
                <div className='swagger-ui-container'>
                  <SwaggerUI
                    spec={spec}
                    deepLinking={true}
                    displayRequestDuration={true}
                    defaultModelsExpandDepth={2}
                    defaultModelExpandDepth={2}
                    docExpansion='list'
                    filter={true}
                    showRequestHeaders={true}
                    showCommonExtensions={true}
                    tryItOutEnabled={true}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='overview' className='mt-0'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>API Information</CardTitle>
                  <CardDescription>Overview of the Convo Forms API</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <h4 className='font-medium text-gray-900 mb-2'>Description</h4>
                    <p className='text-sm text-gray-600'>
                      {spec?.info.description || 'No description available'}
                    </p>
                  </div>

                  <Separator />

                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='font-medium text-gray-900'>Version:</span>
                      <Badge variant='outline' className='ml-2'>
                        {spec?.info.version}
                      </Badge>
                    </div>
                    <div>
                      <span className='font-medium text-gray-900'>OpenAPI:</span>
                      <Badge variant='outline' className='ml-2'>
                        {spec?.openapi}
                      </Badge>
                    </div>
                  </div>

                  {metadata && (
                    <>
                      <Separator />
                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                          <span className='font-medium text-gray-900'>Endpoints:</span>
                          <Badge variant='secondary' className='ml-2'>
                            {metadata.routesCount}
                          </Badge>
                        </div>
                        <div>
                          <span className='font-medium text-gray-900'>Schemas:</span>
                          <Badge variant='secondary' className='ml-2'>
                            {metadata.schemasCount}
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Servers</CardTitle>
                  <CardDescription>Available API endpoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {spec?.servers?.map((server, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                      >
                        <div>
                          <p className='font-medium text-gray-900'>{server.description}</p>
                          <p className='text-sm text-gray-600 font-mono'>{server.url}</p>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => window.open(server.url, '_blank')}
                        >
                          <ExternalLink className='w-4 h-4' />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>API authentication methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {spec?.components?.securitySchemes &&
                      Object.entries(spec.components.securitySchemes).map(
                        ([name, scheme]: [string, unknown]) => (
                          <div key={name} className='p-3 bg-gray-50 rounded-lg'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-medium text-gray-900'>{name}</h4>
                              <Badge variant='outline'>{(scheme as Record<string, unknown>).type as string}</Badge>
                            </div>
                            <p className='text-sm text-gray-600'>
                              {(scheme as Record<string, unknown>).description as string || `${(scheme as Record<string, unknown>).type as string} authentication`}
                            </p>
                            {(scheme as Record<string, unknown>).bearerFormat && (
                              <p className='text-xs text-gray-500 mt-1'>
                                Format: {(scheme as Record<string, unknown>).bearerFormat as string}
                              </p>
                            )}
                          </div>
                        )
                      )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Tags</CardTitle>
                  <CardDescription>Endpoint categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {spec?.tags?.map((tag, index) => (
                      <Badge key={index} variant='secondary' className='text-sm'>
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <div className='mt-4 space-y-2'>
                    {spec?.tags?.slice(0, 3).map((tag, index) => (
                      <div key={index} className='text-sm'>
                        <span className='font-medium text-gray-900'>{tag.name}:</span>
                        <span className='text-gray-600 ml-2'>{tag.description}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='schemas' className='mt-0'>
            <Card>
              <CardHeader>
                <CardTitle>API Schemas</CardTitle>
                <CardDescription>
                  Data models and type definitions used throughout the API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4'>
                  {spec?.components?.schemas &&
                    Object.entries(spec.components.schemas).map(([name, schema]: [string, unknown]) => (
                      <div key={name} className='border rounded-lg p-4'>
                        <div className='flex items-center justify-between mb-2'>
                          <h4 className='font-medium text-gray-900'>{name}</h4>
                          <Badge variant='outline'>{(schema as Record<string, unknown>).type as string || 'object'}</Badge>
                        </div>
                        {(schema as Record<string, unknown>).description && (
                          <p className='text-sm text-gray-600 mb-3'>{(schema as Record<string, unknown>).description as string}</p>
                        )}
                        <div className='bg-gray-50 rounded p-3'>
                          <pre className='text-xs text-gray-800 overflow-x-auto'>
                            {JSON.stringify(schema, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Custom Swagger UI Styles */}
      <style jsx global>{`
        .swagger-ui-container .swagger-ui {
          font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
            sans-serif;
        }

        .swagger-ui-container .swagger-ui .topbar {
          display: none;
        }

        .swagger-ui-container .swagger-ui .info {
          margin: 20px 0;
        }

        .swagger-ui-container .swagger-ui .scheme-container {
          margin: 0 0 20px 0;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
