import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index', 'src/server', 'src/client'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true
  }
});
