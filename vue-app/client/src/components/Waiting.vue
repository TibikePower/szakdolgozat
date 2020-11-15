<template>
  <div id="Waiting">
    <div class="waitingTemplate container-fluid">
      {{status}}
      <div v-if="status=='host'">
        Te vagy a host! Parancsok:
        <ul>
          <li>
            /start - Játék indítása
          </li>
          <li>
            /clear - Chat törlése
          </li>
          <li>
            /kick [ játékosnév ] - Játékos kickelése
          </li>
          <li>
            /addbot [ 1 / 2 / 3 ] - Bot hozzáadása ( 1 - könnyű, 2 - közepes, 3 - nehéz )
          </li>
          <li>
            /kickbot [ botnév ] - Bot eltávolítása
          </li>
        </ul>
      </div>
      <div v-else>
        Várj, amíg a host elindítja a játékot!
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Waiting',
  props: ['status'],
  methods:{
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
