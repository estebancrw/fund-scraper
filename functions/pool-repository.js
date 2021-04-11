function PoolRepository(firestore) {
  const database = firestore;
  const collection = 'pools';
  const timestamp = new Date().getTime();

  const addAll = (pools) => {
    const batch = database.batch();

    pools.forEach((pool) => {
      const { name, project } = pool;
      const docId = `${project}-${name}`;
      const docRef = database.collection(collection).doc(docId);

      batch.set(docRef, {
        ...pool,
        timestamp,
      });
    });

    return batch.commit();
  };

  return {
    addAll,
  };
}

module.exports = PoolRepository;
