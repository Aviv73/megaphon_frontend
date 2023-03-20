<template>
  <div class="about-page container flex-center height-all">
    ABOUT PAGE | <Tooltip msg="This is a tooltip in the about page, telling you something about it."/>
    <!-- <br/> -->
    <!-- <Tooltip>
      <template #preview>
        I AM A TOOLTIP
      </template>
      <template #content>
        THIS IS A TOOLTIP MESSAGE !!!
      </template>
    </Tooltip> -->
  </div>
</template>
<script>
import Tooltip from '../cmps/Tooltip.vue';
export default {
  name: 'About',
  components: { Tooltip }
}
</script>