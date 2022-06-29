<template>

  <OnboardingStepBase
    :title="$tr('title')"
    :description="$tr('description')"
    @continue="handleContinue"
  >
    <KRadioButton
      v-model="selected"
      :value="Options.CREATE"
      :label="$tr('createNewFacility')"
    />
    <KRadioButton
      v-model="selected"
      :value="Options.IMPORT"
      :label="$tr('importFacility')"
    />
    <SelectAddressModalGroup
      v-show="showSelectAddressModal"
      @cancel="showSelectAddressModal = false"
      @submit="handleAddressSubmit"
    />

  </OnboardingStepBase>

</template>


<script>

  import { SelectAddressModalGroup } from 'kolibri.coreVue.componentSets.sync';
  import commonSyncElements from 'kolibri.coreVue.mixins.commonSyncElements';
  import OnboardingStepBase from '../OnboardingStepBase';

  const Options = Object.freeze({
    CREATE: 'create',
    IMPORT: 'import',
  });

  export default {
    name: 'SelectLODSetupType',
    components: {
      OnboardingStepBase,
      SelectAddressModalGroup,
    },
    mixins: [commonSyncElements],
    inject: ['lodService'],
    data() {
      return {
        Options,
        selected: Options.CREATE,
        showSelectAddressModal: false,
      };
    },
    methods: {
      handleContinue() {
        this.showSelectAddressModal = true;
      },
      handleAddressSubmit(address) {
        this.loadingNewAddress = true;
        return this.fetchNetworkLocationFacilities(address.id)
          .then(data => {
            this.lodService.send({ type: 'SETSETUPTYPE', value: this.selected });
            this.lodService.send({ type: 'CONTINUE', value: data });
          })
          .catch(error => {
            // TODO handle disconnected peers error more gracefully
            this.$store.dispatch('showError', error);
          });
      },
    },

    $trs: {
      title: {
        message: 'Select a facility setup for this learn-only device',
        context: '',
      },
      description: {
        message:
          'This device will have Kolibri features for learners, but not for coaches and admins',
        context: '',
      },
      createNewFacility: {
        message: 'Create a new user account for an existing facility',
        context: '',
      },
      importFacility: {
        message: 'Import one or more existing user accounts from an existing facility',
        context: '',
      },
    },
  };

</script>
