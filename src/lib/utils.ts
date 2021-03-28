let globalNodeId = 0;

function* idMaker(): Generator<number> {
  while (true) {
    yield globalNodeId++;
  }
}

export const genId = {
  build: idMaker(),
  reset() {
    globalNodeId = 0;
  },
};
