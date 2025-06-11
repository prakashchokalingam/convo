#!/usr/bin/env tsx

import fs from 'fs/promises';
import path from 'path';
import { globSync } from 'glob';
import swaggerJSDoc from 'swagger-jsdoc';
// Fix import - remove .js extension for TypeScript
import { swaggerOptions } from './config';
import type { 
  ApiRoute, 
  RouteDiscoveryResult, 
  GenerationResult,
  HttpMethod 
} from '../../lib/swagger/types.js';

/**
 * Main Swagger documentation generator
 * Scans API routes and generates OpenAPI specification
 */
class SwaggerGenerator {
  private readonly apiDirectory = './app/api';
  private readonly outputDirectory = './docs/swagger/generated';
  private readonly outputFile = 'openapi.json';

  /**
   * Main generation process
   */
  async generate(): Promise<GenerationResult> {
    console.log('🚀 Starting Swagger documentation generation...');
    
    try {
      // Ensure output directory exists
      await this.ensureOutputDirectory();
      
      // Discover API routes
      console.log('📁 Discovering API routes...');
      const discovery = await this.discoverRoutes();
      console.log(`✅ Found ${discovery.totalRoutes} routes in ${discovery.scannedFiles.length} files`);
      
      // Generate OpenAPI specification
      console.log('📝 Generating OpenAPI specification...');
      const spec = await this.generateOpenApiSpec();
      
      // Write specification to file
      const outputPath = path.join(this.outputDirectory, this.outputFile);
      await fs.writeFile(outputPath, JSON.stringify(spec, null, 2));
      console.log(`💾 OpenAPI specification written to: ${outputPath}`);
      
      // Generate summary
      const result: GenerationResult = {
        spec,
        routes: discovery.routes,
        schemas: this.extractSchemas(spec),
        timestamp: new Date().toISOString(),
        version: spec.info?.version || '1.0.0',
      };
      
      console.log('✨ Documentation generation completed successfully!');
      console.log(`📊 Summary: ${result.routes.length} routes, ${result.schemas.length} schemas`);
      
      return result;
    } catch (error) {
      console.error('❌ Error generating documentation:', error);
      throw error;
    }
  }

  /**
   * Discover all API routes in the project
   */
  private async discoverRoutes(): Promise<RouteDiscoveryResult> {
    const routeFiles = globSync('app/api/**/route.ts', { 
      ignore: ['node_modules/**', '.next/**'],
      absolute: true 
    });
    
    const routes: ApiRoute[] = [];
    const scannedFiles: string[] = [];
    
    for (const filePath of routeFiles) {
      try {
        const relativePath = path.relative(process.cwd(), filePath);
        scannedFiles.push(relativePath);
        
        const content = await fs.readFile(filePath, 'utf-8');
        const routeInfo = await this.extractRouteInfo(filePath, content);
        routes.push(...routeInfo);
      } catch (error) {
        console.warn(`⚠️  Could not process route file: ${filePath}`, error);
      }
    }
    
    return {
      routes,
      totalRoutes: routes.length,
      scannedFiles,
    };
  }

  /**
   * Extract route information from a file
   */
  private async extractRouteInfo(filePath: string, content: string): Promise<ApiRoute[]> {
    const routes: ApiRoute[] = [];
    
    // Convert file path to API path
    const apiPath = this.filePathToApiPath(filePath);
    
    // Extract HTTP method handlers
    const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    
    for (const method of methods) {
      const handlerRegex = new RegExp(`export\\s+async\\s+function\\s+${method}\\s*\\(`, 'g');
      const match = handlerRegex.exec(content);
      
      if (match) {
        // Extract JSDoc comment for this handler
        const jsDocComment = this.extractJSDocComment(content, match.index);
        
        routes.push({
          method,
          path: apiPath,
          filePath,
          handler: `${method} handler`,
          jsDocComment,
        });
      }
    }
    
    return routes;
  }

  /**
   * Convert file path to API path
   */
  private filePathToApiPath(filePath: string): string {
    // Convert: app/api/forms/[id]/route.ts -> /api/forms/{id}
    let apiPath = filePath
      .replace(/.*\/app\/api/, '/api')
      .replace(/\/route\.ts$/, '')
      .replace(/\[([^\]]+)\]/g, '{$1}'); // Convert [id] to {id}
    
    // Handle root API path
    if (apiPath === '/api') {
      apiPath = '/api/';
    }
    
    return apiPath;
  }

  /**
   * Extract JSDoc comment preceding a function
   */
  private extractJSDocComment(content: string, functionIndex: number): string | undefined {
    const beforeFunction = content.substring(0, functionIndex);
    const lines = beforeFunction.split('\n');
    
    // Look for JSDoc comment (/** ... */) before the function
    const jsDocPattern = /\/\*\*([\s\S]*?)\*\//g;
    const matches = [...beforeFunction.matchAll(jsDocPattern)];
    
    if (matches.length > 0) {
      // Return the last JSDoc comment found before the function
      return matches[matches.length - 1][0];
    }
    
    return undefined;
  }

  /**
   * Generate OpenAPI specification using swagger-jsdoc
   */
  private async generateOpenApiSpec(): Promise<any> {
    try {
      const spec = swaggerJSDoc(swaggerOptions);
      
      // Add generation metadata
      spec.info = {
        ...spec.info,
        'x-generated-at': new Date().toISOString(),
        'x-generator': 'convo-forms-swagger-generator',
      };
      
      return spec;
    } catch (error) {
      console.error('Error generating OpenAPI spec:', error);
      throw error;
    }
  }

  /**
   * Extract schema definitions from the OpenAPI spec
   */
  private extractSchemas(spec: any): Array<{ name: string; schema: any; description?: string }> {
    const schemas = [];
    
    if (spec.components?.schemas) {
      for (const [name, schema] of Object.entries(spec.components.schemas)) {
        schemas.push({
          name,
          schema,
          description: (schema as any)?.description,
        });
      }
    }
    
    return schemas;
  }

  /**
   * Ensure output directory exists
   */
  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.access(this.outputDirectory);
    } catch {
      await fs.mkdir(this.outputDirectory, { recursive: true });
      console.log(`📁 Created output directory: ${this.outputDirectory}`);
    }
  }

  /**
   * Watch for changes and regenerate documentation
   */
  async watch(): Promise<void> {
    console.log('👀 Watching for changes...');
    
    // Initial generation
    await this.generate();
    
    console.log('✅ Initial documentation generated. Manual regeneration required for updates.');
    console.log('💡 Run `npm run docs:generate` to regenerate documentation after changes.');
  }

  /**
   * Validate that all routes have proper documentation
   */
  async validate(): Promise<{ valid: boolean; issues: string[] }> {
    console.log('🔍 Validating API documentation...');
    
    const discovery = await this.discoverRoutes();
    const issues: string[] = [];
    
    for (const route of discovery.routes) {
      if (!route.jsDocComment) {
        issues.push(`Missing JSDoc documentation: ${route.method} ${route.path}`);
      }
    }
    
    const valid = issues.length === 0;
    
    if (valid) {
      console.log('✅ All routes are properly documented');
    } else {
      console.log(`⚠️  Found ${issues.length} documentation issues:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    return { valid, issues };
  }
}

/**
 * CLI interface
 */
async function main() {
  const generator = new SwaggerGenerator();
  const command = process.argv[2];
  
  switch (command) {
    case 'watch':
      await generator.watch();
      break;
    case 'validate':
      await generator.validate();
      break;
    case 'generate':
    default:
      await generator.generate();
      break;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SwaggerGenerator };
