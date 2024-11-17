<template>
  <FullScreenToggler class="width-all">
    <div :id="videoId" :class="{paused: !isPlaying}" class="videw-container width-all content" ref="elContainer">
      <video class=" width-all content" ref="elVideo" controls></video>
    </div>
  </FullScreenToggler>
</template>

<script>
import Hls from 'hls.js';
import { elementService } from '../../common/services/element.service';
// import { getVideoEncryptionKey } from '../../common/services/file.service';
import { fixFileSrcToThumbnail } from '../../common/services/file.service';
import { delay, getRandomId } from '../../common/services/util.service';
import FullScreenToggler from '../../common/cmps/FullScreenToggler.vue';

// import cloudinary from 'cloudinary-video-player';
// import 'cloudinary-video-player/cld-video-player.min.css';
/*
   < link href="https://unpkg.com/cloudinary-video-player@1.9.4/dist/cld-video-player.min.css" rel="stylesheet">
   < script src="https://unpkg.com/cloudinary-video-player@1.9.4/dist/cld-video-player.min.js">< /script>
*/

// 2000 ms;
// 
const getWatermarkPosByMs = (() => {
  const poss = [
    {x: 0, y: 0},
    {x: '100%', y: 0, style: {transform: `translateX(-100%)`}},
    {x: '100%', y: '100%', style: {transform: `translateX(-100%) translateY(-100%)`}},
    {x: 0, y: '100%', style: {transform: `translateY(-100%)`}},
    {x: '50%', y: '50%', style: {transform: `translateX(-50%) translateY(-50%)`}}
  ];
  const msPerPos = 10000;
  return (ms) => {
    const posIdx = parseInt(parseInt(ms / msPerPos) % poss.length);
    return poss[posIdx];
  }
})();

export default {
  name: 'VideoTag',
  components: { FullScreenToggler },
  props: {
    src: String,
    format: String,
    fileItem: Object
    // type: String
  },
  data() {
    return {
      videoId: getRandomId(''),
      styleEl: null,
      isPlaying: false,
      watermarkInterval: null,

      watchSession: null,
      currWatchSection: null,
      sessionUpdateIntervalId: null,

      isSeeking: false
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
    this.destroy();
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
      // return `${this.organization.name} - ${this.loggedUser.firstName} ${this.loggedUser.lastName} | ${this.loggedUser.email} | ${this.loggedUser.mobile}`
      return `${this.loggedUser.firstName} ${this.loggedUser.lastName} | ${this.loggedUser.email} | ${this.loggedUser.mobile}`
    },
    logoUrl() {
      return fixFileSrcToThumbnail(this.organization.logo);
    }
  },
  methods: {
    init() {
      const { elVideo } = this.$refs;
      elVideo.addEventListener('play', async() => {
        await delay(10);
        if (this.isSeeking) {
          this.isSeeking = false;
          return;
        }
        this.play();
      });
      elVideo.addEventListener('pause', async () => {
        await delay(10);
        if (this.isSeeking) return;
        this.pause();
      });
      elVideo.addEventListener('seeking', () => {
        this.isSeeking = true;
        this.setNewWatchSection();
      });
      // elVideo.addEventListener('seeked', () => {
      //   this.isSeeking = false;
      // });

      const isHls = (this.format === 'm3u8') || this.src?.split('?')[0]?.endsWith('.m3u8');
      if (!isHls) {
        elVideo.src = this.src;
        return;
      }

      const hls = new Hls({
        // xhrSetup: function (xhr, url) {
        //   xhr.withCredentials = true;  // Allows cookies to be sent with each request
        // }
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
          // this.appendWatermarkStyling();
          // this.play();
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
      // }
      elVideo.controlsList = "nofullscreen"
      this.hls = hls;


      this.initWatchSession();


      // const player = window.cloudinary.videoPlayer(elVideo, {
      //   cloud_name: 'djk2q5so4',
      //   controls: true,
      //   autoplay: false,
      //   muted: false,
      // });
      // player.source(this.src, { sourceTypes: ['hls'] });

    },
    destroy() {
      this.hls?.destroy();
      if (this.styleEl) {
        document.head.removeChild(this.styleEl);
        this.styleEl = null;
      }
      this.pause();
    },

    async initWatchSession() {
      this.watchSession = await this.$store.dispatch({ type: 'videoWatchLog/loadItem', silent: true });
      this.watchSession.organizationId = this.organization._id;
      this.watchSession.accountId = this.loggedUser._id;
      this.watchSession.fileId = this.fileItem.fileId;
      this.setNewWatchSection();
      this.updateWatchSession();
    },
    setSessionUpdateInterval() {
      this.stopSessionUpdateIterval();
      this.sessionUpdateIntervalId = setInterval(() => {
        this.updateWatchSession();
      }, 5000);
    },
    stopSessionUpdateIterval() {
      clearInterval(this.sessionUpdateIntervalId);
      this.updateWatchSession();
    },
    async setNewWatchSection() {
      this.currWatchSection = { id: getRandomId(''), start: this.$refs.elVideo.currentTime * 1000, end: this.$refs.elVideo.currentTime * 1000 }
      this.watchSession.sections.push(this.currWatchSection);
    },
    async updateWatchSession() {
      this.currWatchSection.end = this.$refs.elVideo.currentTime * 1000;
      this.watchSession = JSON.parse(JSON.stringify(await this.$store.dispatch({ type: 'videoWatchLog/saveItem', item: this.watchSession, silent: true })));
      this.currWatchSection = this.watchSession.sections.find(c => c.id === this.currWatchSection.id);
    },



    play() {
      this.isPlaying = true;
      this.setSessionUpdateInterval();
      this.watermarkInterval = setInterval(() => {
        this.applyWatermark();
      }, 10);
    },
    pause() {
      this.isPlaying = false;
      if (this.watermarkInterval) clearInterval(this.watermarkInterval);
      this.stopSessionUpdateIterval();
    },
    
    applyWatermark() {
      const { elContainer, elVideo } = this.$refs;
      const existWatermarkItem = elContainer.querySelector('.watermark');
      if (existWatermarkItem) elContainer.removeChild(existWatermarkItem);
      
      const width = elVideo.offsetWidth;
      const fontSize = width / 50;
      const watermarkEl = elementService.El(`<div class="watermark">
        ${elementService.dataToCssElStr(`.watermark`, {
          fontSize: fontSize*1 + 'px',
          position: 'absolute',
          padding: `${elementService._.em(55)} ${elementService._.em(30)}`,
          textAlign: 'end',
          opacity: '0.5',
          // fontWeight: 'bold',
          cursor: 'normal',
          'user-select': 'none',

          color: 'gray',
          fontFamily: 'fantasy'
        })}
        <p>${this.loggedUser.email || this.watermarkMsg.split('|').join('</p><p>')}</p>
      </div>`);
      const watermarkPos = getWatermarkPosByMs(elVideo.currentTime * 1000);
      const style = { left: watermarkPos.x, top: watermarkPos.y, ...(watermarkPos.style || {}) };
      // watermarkEl.style = style;
      for (let key in style) watermarkEl.style[key] = style[key];
      elContainer.appendChild(watermarkEl);
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

  //             // Fetch your custom key (e.g., from a secure API or function)
  //             getVideoEncryptionKey().then(key => {

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

    // hls.abrController.fragCurrent._decryptdata.uri = 'http://localhost:3000/api/file/encryption-key';
    // const hls = new Hls({
    //   keyLoader: () => Promise.resolve()
    // });
    // hls.on(Hls.Events.KEY_LOADING, async (event, data) => {
    //   data.frag._decryptdata.uri = 'http://localhost:3000/api/file/encryption-key';
    //   const key = await getVideoEncryptionKey();
    //   // const keyUri = data.frag.decryptdata.uri;
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

  //         // Change the URI to something else (for example, from a custom key-fetching logic)
  //         fragment._decryptdata.uri = 'http://localhost:3000/api/file/encryption-key';
  //     } else {
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


  video {
    height: auto;
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
  video::-webkit-media-controls-fullscreen-button {
    display: none
  }
}
</style>