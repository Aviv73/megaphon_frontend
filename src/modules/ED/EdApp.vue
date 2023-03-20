<template>
  <div class="ed-app container inner-app">
    <nav class="flex align-center gap5">
      <router-link :to="{name: 'EdMapPage'}">{{$t('map')}}</router-link>
      <router-link :to="{name: 'EdMsgEdit'}">{{$t('msgs')}}</router-link>
    </nav>
    <router-view class="inner-app-content"/>
  </div>
</template>