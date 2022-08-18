export function getDefaultTsconfig() {
  return {
    compilerOptions: {
      jsx: 'preserve',
      target: 'ESNext',
      module: 'ESNext',
      moduleResolution: 'Node',
      skipLibCheck: true,
      strict: false,
      allowJs: true,
      noEmit: true,
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
      baseUrl: '..',
      paths: {}
    },
    include: ['./cloudflare.d.ts', '../**/*']
  };
}
