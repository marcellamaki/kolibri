<template>

  <div
    v-if="panelOpen"
    ref="sidePanel"
    class="side-panel-wrapper"
    tabindex="0"
    :style="alignmentStyle"
    @keyup.esc="togglePanel"
  >
    <transition name="side-panel">
      <div
        class="side-panel"
        :style="{
          color: $themeTokens.text,
          backgroundColor: $themeTokens.surface,
        }"
      >
      </div>
    </transition>
    <Backdrop
      :transitions="true"
      class="backdrop"
      @click="togglePanel"
    />
  </div>

</template>


<script>

  import Backdrop from 'kolibri.coreVue.components.Backdrop';
  // import { mapState } from 'vuex';

  export default {
    name: 'FullScreenSidePanel',
    components: {
      Backdrop,
    },
    props: {
      alignment: {
        type: String,
        default: 'right',
        validator(val) {
          return Object.values(['left', 'right']).includes(val);
        },
      },
    },
    data: function() {
      return {
        panelOpen: true,
      };
    },
    // computed: {
    //   ...mapState('topicsTree', ['content', 'contents']),
    // },
    methods: {
      togglePanel() {
        this.$emit('togglePanel');
      },
      alignmentStyle() {
        this.alignment == 'right' ? { right: 0 } : { left: 0 };
      },
    },
    // $trs: {
    //   topicHeader: {
    //     message: 'Also in this folder',
    //     context: 'Title of the panel with all topic contents. ',
    //   },
    // },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri-design-system/lib/styles/definitions';

  .side-panel-wrapper {
    overflow-x: hidden;
  }

  .side-panel {
    position: fixed;
    top: 0;
    z-index: 16;
    width: 100vw;
    height: 100vh;
    padding-top: 18px;
    overflow: scroll;
    font-size: 14px;

    @media (min-width: 436px) {
      width: 436px;
    }
  }

  .title {
    max-width: 70vw;
    margin-left: 32px;
  }

  .close-button {
    position: fixed;
    top: 22px;
    right: 36px;
  }

  .next-resource-footer {
    position: fixed;
    bottom: 0;
    height: 100px;
  }

  .backdrop {
    z-index: 4;
    color: rgba(0, 0, 0, 0.7);
  }

</style>
