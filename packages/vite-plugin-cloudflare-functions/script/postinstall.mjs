try {
  const { prepare } = await import('../dist/index.mjs');
  await prepare('.');
} catch {}
