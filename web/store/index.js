export const state = () => ({
  pools: [],
})

export const mutations = {
  updatePools(state, pools) {
    state.pools = pools
  },
}

export const actions = {
  async fetchPools({ commit, state }) {
    if (state.pools.length) {
      return
    }

    const snapshot = await this.$fire.firestore
      .collection('pools')
      .where('aprYear', '>=', 300)
      .get()
    const pools = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    commit('updatePools', pools)
  },
}
