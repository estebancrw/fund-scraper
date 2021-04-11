<template>
  <pools-table :pools="pools"></pools-table>
</template>

<script>
import PoolsTable from '@/components/PoolsTable.vue'
import pools from '../mocks/pools'

export default {
  name: 'App',
  components: {
    PoolsTable,
  },
  data() {
    return {
      pools,
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
