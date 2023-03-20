<template>
  <div class="credit-logo">Aviv<span>Js</span></div>
</template>

<script>
export default {
  name: "CreditLogo"
}
</script>

<style>
.credit-logo {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  font-size: 20px;
  display: inline-block;
  color: red;
}
.credit-logo span {
    color: black;
    text-transform: lowercase;
}
.credit-logo span:before {
    content: '.';
}
</style>