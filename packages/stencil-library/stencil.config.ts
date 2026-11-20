import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';
import tailwind, { tailwindHMR } from 'stencil-tailwind-plugin';

export const config: Config = {
  namespace: 'stencil-library',
  globalStyle: 'src/styles/theme.css',
  plugins: [tailwind({
    tailwindCssPath: './src/styles/tailwind.css',
    enableDebug: false,
  }), tailwindHMR()],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: 'styles/theme.css', dest: 'theme.css' },
      ],
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
      generateTypeDeclarations: true,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null,
    },
    reactOutputTarget({
      outDir: '../react-library/lib/components/stencil-generated/',
      componentCorePackage: '@seakh/ui-core',
      proxiesFile: '../react-library/lib/components/stencil-generated/components.ts',
      includeDefineCustomElements: true,
      includeImportCustomElements: true,
    }),
    angularOutputTarget({
      componentCorePackage: '@seakh/ui-core',
      outputType: 'standalone',
      directivesProxyFile: '../angular-library/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../angular-library/src/lib/stencil-generated/index.ts',
    }),
  ],
};
