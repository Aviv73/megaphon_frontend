<template>
  <FullScreenToggler class="width-all">
    <div :id="videoId" :class="{paused: !isPlaying}" class="videw-container width-all">
      <video class=" width-all content" ref="elVideo" controls></video>
    </div>
  </FullScreenToggler>
</template>

<script>
import Hls from 'hls.js';
import { elementService } from '../../common/services/element.service';
// import { getVideoEncryptionKey } from '../../common/services/file.service';
import { fixFileSrcToThumbnail } from '../../common/services/file.service';
import { getRandomId } from '../../common/services/util.service';
import FullScreenToggler from '../../common/cmps/FullScreenToggler.vue';

// import cloudinary from 'cloudinary-video-player';
// import 'cloudinary-video-player/cld-video-player.min.css';
/*
   < link href="https://unpkg.com/cloudinary-video-player@1.9.4/dist/cld-video-player.min.css" rel="stylesheet">
   < script src="https://unpkg.com/cloudinary-video-player@1.9.4/dist/cld-video-player.min.js">< /script>
*/

export default {
  name: 'VideoTag',
  components: { FullScreenToggler },
  props: {
    src: String,
    format: String,
    // type: String
  },
  data() {
    return {
      videoId: getRandomId(''),
      styleEl: null,
      isPlaying: false,
      fullScreenMode: false
    }
  },
  watch: {
    src() {
      this.destroy();
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  destroyed() {
    if (this.styleEl) document.head.removeChild(this.styleEl);
  },
  computed: {
    organization() {
      return this.$store.getters['organization/selectedItem'];
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    useWterMark() {
      return this.organization.useVideoWaterMark;
    },
    watermarkMsg() {
      return `${this.organization.name} - ${this.loggedUser.firstName} ${this.loggedUser.lastName} | ${this.loggedUser.email} | ${this.loggedUser.mobile}`
    },
    logoUrl() {
      return fixFileSrcToThumbnail(this.organization.logo);
    }
  },
  methods: {
    init() {
      const { elVideo } = this.$refs;
      elVideo.addEventListener('play', () => {
        this.isPlaying = true;
      });
      elVideo.addEventListener('pause', () => {
        this.isPlaying = false;
      });

      console.log('format', this.format);
      const isHls = (this.format === 'm3u8') || this.src?.split('?')[0]?.endsWith('.m3u8');
      if (!isHls) {
        elVideo.src = this.src;
        return;
      }

      const hls = new Hls({
        xhrSetup: function (xhr, url) {
          xhr.withCredentials = true;  // Allows cookies to be sent with each request
        }
      });
      hls.loadSource(this.src);
      // hls.loadSource('http://localhost:3000/vid-dir/ID1999192096E62588D9.m3u8');
      hls.attachMedia(elVideo);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // hls.abrController.fragCurrent._decryptdata.uri = 'http://localhost:3000/api/file/encryption-key';
        // elVideo.play();
        // setTimeout(() => {
        //   }, 1000);
        elVideo.addEventListener('canplay', () => {
          this.appendWatermarkStyling();
          elVideo.play();
        });
      });
      // elVideo.addEventListener('fullscreenchange', (ev) => {
      //   if (elVideo.fullscreenElement) {
      //     elVideo.exitFullscreen();
      //   }
      //   // ev.stopPropagation();
      //   // ev.preventDefault();
      // })
      // elVideo.requestFullscreen = () => {
      //   this.fullScreenMode = !this.fullScreenMode;
      //   console.log('WOW?');
      // }
      elVideo.controlsList = "nofullscreen"
      this.hls = hls;


      // const player = window.cloudinary.videoPlayer(elVideo, {
      //   cloud_name: 'djk2q5so4',
      //   controls: true,
      //   autoplay: false,
      //   muted: false,
      // });
      // player.source(this.src, { sourceTypes: ['hls'] });


    },
    destroyed() {
      this.hls?.destroy();
    },
    appendWatermarkStyling() {
      const { elVideo } = this.$refs;
      const width = elVideo.offsetWidth;
      const fontSize = width / 50;
      // const getEm = size => `${(size / fontSize)}em`;
      if (!this.useWterMark) return;
      const styleEl = elementService.StyleEl(`#${this.videoId}`, {
        fontSize: `${fontSize}px`,
        '&:after': {
          width: 'fit-content',
          content: `"${this.watermarkMsg}"`,
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: '0',
          fontSize: elementService._.em(15),
          fontWeight: 'bold',
          animation: '25s linear moving-watermark-animation infinite',
          'text-wrap': 'nowrap',
          opacity: '0.4'
        },
        '&.paused': {
          '&:after': {
            'animationPlayState': 'paused'
          }
        },
        '@keyframes moving-watermark-animation': {
          '0%': {left: '-100%'},
          '100%': {left: '100%'}
        },
        '&:before': {
          display: 'none',
          content: `""`,
          position: 'absolute',
          top: elementService._.em(20),
          right: elementService._.em(20),
          width: elementService._.em(70),
          height: elementService._.em(70),
          backgroundImage: `url(${this.logoUrl})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          // opacity: '0.6'
        },
        video: {
          height: 'auto',
          objectFit: 'contain',
          width: '100%',
          height: '100%'
        },
        'video::-webkit-media-controls-fullscreen-button': {
          display: 'none',
        }
      });
      styleEl.classList.add('video-styling');
      this.styleEl == styleEl;
      document.head.append(styleEl);
    }
  },
}
    
  // class CustomKeyLoader extends Hls.DefaultConfig.loader {
  //     constructor(config) {
  //         super(config);
  //     }

  //     load(context, config, callbacks) {
  //         if (context.type === 'key') {
  //             console.log('Custom key loader triggered for:', context.url);

  //             // Fetch your custom key (e.g., from a secure API or function)
  //             getVideoEncryptionKey().then(key => {
  //                 console.log('GOOD KEY:', key);

  //                 // Simulate a successful key load with the custom key
  //                 const keyBuffer = new Uint8Array(Buffer.from(key, 'hex'));
  //                 callbacks.onSuccess(
  //                     {
  //                         url: context.url,
  //                         data: keyBuffer,
  //                     },
  //                     context,
  //                     null
  //                 );
  //             }).catch(error => {
  //                 console.error('Failed to load the key:', error);
  //                 callbacks.onError({
  //                     code: 500,
  //                     text: 'Custom key load error',
  //                 });
  //             });
  //         } else {
  //             // Fall back to default loader behavior for other requests
  //             super.load(context, config, callbacks);
  //         }
  //     }
  // }
  // Hls.DefaultConfig.loader = CustomKeyLoader;

    // console.log('HLS??', isHls, this.src?.split('?')[0], hls);
    // hls.abrController.fragCurrent._decryptdata.uri = 'http://localhost:3000/api/file/encryption-key';
    // const hls = new Hls({
    //   keyLoader: () => Promise.resolve()
    // });
    // hls.on(Hls.Events.KEY_LOADING, async (event, data) => {
    //   console.log('LOADING', data);
    //   data.frag._decryptdata.uri = 'http://localhost:3000/api/file/encryption-key';
    //   const key = await getVideoEncryptionKey();
    //   // const keyUri = data.frag.decryptdata.uri;
    //   // console.log('ABOUT TO FETCH KEY, BAD URI:', keyUri);
    //   // console.log('GOOD KEY', key);
    //   // data.frag.decryptdata.key = new Uint8Array(Buffer.from(key, 'hex'));
    //   hls.trigger(Hls.Events.KEY_LOADED, {
    //     key: new Uint8Array(Buffer.from(key, 'hex')),
    //     frag: data.frag,
    //     // keyId: data.frag.keyId
    //     // key: data.frag.decryptdata.key
    //   });
    // });
  //   hls.on(Hls.Events.FRAG_CHANGED, (event, data) => {
  //     const fragment = data.frag;
      
  //     // Access the _decryptdata and change the URI
  //     if (fragment._decryptdata) {
  //         console.log('Current Key URI:', fragment._decryptdata.uri);

  //         // Change the URI to something else (for example, from a custom key-fetching logic)
  //         fragment._decryptdata.uri = 'http://localhost:3000/api/file/encryption-key';
  //         console.log('Modified Key URI:', fragment._decryptdata.uri);
  //     } else {
  //         console.log('No decryptdata found on fragment.');
  //     }
  // });
    // hls.config.xhrSetup = async (xhr, url) => {
    //   xhr.abort();
    //   const key = await getVideoEncryptionKey();
    //   hls.trigger(Hls.Events.KEY_LOADED, {
    //     key: Buffer.from(key, 'hex'),
    //     // frag: data.frag,
    //     // keyId: data.frag.keyId
    //   });
      
    //   // console.log('WOWOWOW', url);
    //   // xhr.setRequestHeader('Authorization', `Bearer ${'OPTIONAL_TOKEN'}`)
    // }
    // hls.config.loader = {
    //   loadKey: async (context, config, cbs) => {
    //     try {
    //       const key = await getVideoEncryptionKey();
    //       const keyBuff = Buffer.from(key, 'hex');
    //       cbs.onSuccess({data: keyBuff}, context);
    //     } catch(err) {
    //       cbs.onError(err, context);
    //     }
    //   }
    // }
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.videw-container {
  position: relative;
  overflow: hidden;
  video::-internal-media-controls-download-button {
    display: none !important;
  }
  video::-webkit-media-controls-enclosure {
    overflow: hidden !important;
  }
}
</style>