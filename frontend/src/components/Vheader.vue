<template>
  <header>
    <div class="header">
      <img
        src="../assets/logoHeader.png"
        alt="Logo Groupomania"
        class="header__logo"
      />
    </div>
  </header>
</template>

<script>
export default {
  name: "Vheader",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 1);

  background-color: white;
  &__logo {
    width: 95%;
    max-width: 600px;
  }
}
</style>
