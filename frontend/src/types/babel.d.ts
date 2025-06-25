// Types pour les packages babel manquants
declare module '@babel/generator' {
  const generator: any;
  export default generator;
}

declare module '@babel/core' {
  const babel: any;
  export default babel;
}
