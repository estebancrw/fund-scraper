<template>
  <table>
    <thead>
      <tr>
        <th>Project</th>
        <th>Name</th>
        <th>aprYear</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="pool in sortedFilteredPools"
        :key="pool.name"
      >
        <td>{{ pool.project }}</td>
        <td>{{ pool.name }}</td>
        <td>{{ pool.aprYear }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    pools: {
      type: Array,
      required: true,
    },
  },
  computed: {
    filteredPools() {
      return this.pools.filter(
        (pool) => pool.aprYear > 300
      )
    },
    sortedFilteredPools() {
      const copyPools = this.filteredPools
      return copyPools.sort(
        (a, b) => b.aprYear - a.aprYear
      )
    },
  },
}
</script>
