<template>

  <component
    :is="currentComponent"
    :device.sync="device"
  />


  <!--
    <BottomAppBar v-if="service.state.matches('selectUsers')">
      <KButton
        primary
        :text="coreString('finishAction')"
        :disabled="users.length === 0"
        @click="redirectToChannels"
      />
    </BottomAppBar>
    -->

</template>


<script>

  import { computed } from 'kolibri.lib.vueCompositionApi';
  import { interpret } from 'xstate';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import commonSyncElements from 'kolibri.coreVue.mixins.commonSyncElements';
  import BottomAppBar from 'kolibri.coreVue.components.BottomAppBar';
  import { lodImportMachine } from '../machines/lodImportMachine';
  import ProgressToolbar from './ProgressToolbar';

  export default {
    name: 'ImportLODUsersSetup',
    components: {
      BottomAppBar,
      ProgressToolbar,
    },
    mixins: [commonSyncElements, commonCoreStrings],

    data() {
      // Global state for the import process
      return {
        service: interpret(lodImportMachine),
        state: lodImportMachine.initialState,
        total_steps: 6,
        stateID: null,
        device: {
          name: '',
          id: '',
          baseurl: '',
        },
      };
    },
    provide() {
      return {
        lodService: this.service,
        state: computed(() => this.state.context),
      };
    },
    inject: ['wizardService'],
    computed: {
      currentComponent() {
        return this.state.meta[this.stateID].component;
      },
    },

    beforeRouteUpdate(to, from, next) {
      // If trying to go backwards, prevent navigation and move the history back
      // to previous location
      if (Number(from.params.step) >= 2 && Number(to.params.step <= 2)) {
        window.history.forward();
        return;
      } else {
        next();
      }
    },
    created() {
      this.service.start();
      this.service.onTransition(state => {
        this.state = state;
        this.total_steps = this.state.context.steps;
        this.stateID = Object.keys(this.state.meta)[0];
      });
    },
    destroyed() {
      this.service.stop();
    },
  };

</script>


<style lang="scss" scoped></style>
