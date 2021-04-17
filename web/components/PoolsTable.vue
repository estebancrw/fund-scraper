<template>
  <div>
    <fieldset>
      <legend>Filter</legend>
      <label for="minApr">Minimum APR</label>
      <input id="minApr" v-model.number.lazy="minApr" type="number" />
      <label for="maxApr">Maximum APR</label>
      <input id="maxApr" v-model.number.lazy="maxApr" type="number" />
      <label for="minTvl">Minimum TVL</label>
      <input id="minTvl" v-model.number.lazy="minTvl" type="number" />
      <label for="maxTvl">Maximum TVL</label>
      <input id="maxTvl" v-model.number.lazy="maxTvl" type="number" />
      <label for="sortBy">Sort by</label>
      <select id="sortby" v-model="sortBy">
        <option value="aprYear">aprYear</option>
        <option value="tvl">tvl</option>
      </select>
    </fieldset>
    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column">
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pool in sortedFilteredPools" :key="pool.id">
          <td v-for="column in columns" :key="column">
            {{ pool[column] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      minApr: 300,
      maxApr: 3000,
      minTvl: 50000,
      maxTvl: 500000,
      columns: ['project', 'name', 'aprYear', 'tvl'],
      sortBy: 'aprYear',
    }
  },
  computed: {
    ...mapState(['pools']),
    filteredPools() {
      return this.pools.filter(
        (pool) =>
          pool.aprYear >= this.minApr &&
          pool.aprYear <= this.maxApr &&
          pool.tvl >= this.minTvl &&
          pool.tvl <= this.maxTvl
      )
    },
    sortedFilteredPools() {
      const copyPools = this.filteredPools
      return copyPools.sort((a, b) => b[this.sortBy] - a[this.sortBy])
    },
  },
  created() {
    this.fetchPools()
  },
  methods: {
    ...mapActions(['fetchPools']),
  },
}
</script>
