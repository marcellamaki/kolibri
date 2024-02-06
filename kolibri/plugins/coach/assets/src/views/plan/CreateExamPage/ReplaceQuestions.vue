<template>

  <div>
    <h1 class="section-header" :style="{ color: `${$themeTokens.annotation}` }">
      {{ activeSection.section_title }}
    </h1>
    <span
      class="divider"
      :style="{ borderTop: `solid 1px ${$themeTokens.fineLine}` }"
    >
    </span>
    <h1 class="section-header">
      {{ replaceQuestions$() }}
    </h1>
    <p>{{ replaceQuestionsExplaination$() }}</p>
    <span
      class="divider"
      :style="{ borderTop: `solid 1px ${$themeTokens.fineLine}` }"
    >
    </span>
    <AccordionContainer
      :items="activeQuestions.map(i => ({
        id: i.question_id,
      }))"
    >
      <template #left-actions>
        <KCheckbox
          ref="selectAllCheckbox"
          class="select-all-box"
          :label="selectAllLabel$()"
          :checked="allQuestionsSelected"
          :indeterminate="selectAllIsIndeterminate"
          @change="() => selectAllQuestions()"
        />
      </template>
      <template #default="{ toggleItemState, isItemExpanded }">
        <AccordionItem
          v-for="(question, index) in activeQuestions"
          :id="question.question_id"
          :key="index"
          :title="question.title"
        >
          <template #heading="{ title }">
            <h3
              class="accordion-header"
            >
              <KCheckbox
                style="padding-left: 0.5em"
                :checked="selectedActiveQuestions.includes(
                  question.question_id
                )"
                @change="() => toggleQuestionInSelection(question.question_id)"
              />
              <KButton
                tabindex="0"
                appearance="basic-link"
                :style="accordionStyleOverrides"
                class="accordion-header-label"
                :aria-expanded="isItemExpanded(question.question_id)"
                :aria-controls="`question-panel-${question.question_id}`"
                @click="toggleItemState(question.question_id)"
              >
                <span>{{ title }}</span>
                <KIcon
                  style="position: absolute; right:0; top: 0.92em"
                  :icon="isItemExpanded(question.question_id) ?
                    'chevronUp' : 'chevronRight'"
                />
              </KButton>
            </h3>
          </template>
          <template #content>
            <div
              :id="`question-panel-${question.question_id}`"
              :ref="`question-panel-${question.question_id}`"
            >
              <p
                v-if="isItemExpanded(question.question_id)"
                class="question-content-panel"
              >
                CONTENT OF {{ question.title }}
              </p>
            </div>
          </template>
        </AccordionItem>
      </template>
    </AccordionContainer>
  </div>

</template>


<script>

  import { enhancedQuizManagementStrings } from 'kolibri-common/strings/enhancedQuizManagementStrings';
  import { get } from '@vueuse/core';
  import { injectQuizCreation } from '../../../composables/useQuizCreation';
  import AccordionContainer from './AccordionContainer';
  import AccordionItem from './AccordionItem';

  export default {
    name: 'ReplaceQuestions',
    components: {
      AccordionContainer,
      AccordionItem,
    },
    setup() {
      const {
        replaceQuestions$,
        replaceAction$,
        selectAllLabel$,
        replaceQuestionsExplaination$,
      } = enhancedQuizManagementStrings;
      const {
        // Computed
        activeSection,
        activeQuestions,
        selectedActiveQuestions,
        replacementQuestionPool,
        selectAllIsIndeterminate,
        toggleItemState,
        isItemExpanded,
        selectAllReplacementQuestions,
        replaceSelectedQuestions,
      } = injectQuizCreation();
      return {
        replaceQuestions$,
        replaceAction$,
        replaceQuestionsExplaination$,
        selectAllLabel$,

        activeSection,
        activeQuestions,
        selectAllReplacementQuestions,
        selectedActiveQuestions,
        replacementQuestionPool,
        selectAllIsIndeterminate,
        replaceSelectedQuestions,
        toggleItemState,
        isItemExpanded,
      };
    },
    computed: {
      accordionStyleOverrides() {
        return {
          color: this.$themeTokens.text + '!important',
          textDecoration: 'none',
          // Ensure text doesn't get highlighted as we drag
          userSelect: get(this.dragActive) ? 'none!important' : 'text',
        };
      },
    },
  };

</script>


<style lang="scss"  scoped>

  /deep/ .ui-textbox-label {
    width: 100% !important;
  }

  /deep/ .textbox {
    width: 100% !important;
    max-width: 100%;
    margin-left: -1em;
  }

  .space-content {
    margin: 0.5em;
    font-size: 1em;
    font-weight: 700;
  }

  .check-box-style {
    margin-top: 0.5em;
    margin-left: 0.5em;
  }

  .accordion-header {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding: 0 0.5em !important;
    margin: 0.25em 0;
  }

  .accordion-header-label {
    position: relative;
    flex-grow: 1;
    align-self: stretch;
    padding: 0 0 0 1em;
    line-height: 2.75em;
    text-align: left;
    cursor: pointer;
  }

  /deep/ .checkbox-icon {
    top: 2px;
  }

  /deep/ .grip {
    top: 2px !important;
  }

  /deep/ .overflow-tabs svg {
    top: 5px !important;
  }

  .select-all-box {
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 2.5em;

    // Vertical centering here into the KCheckbox
    /deep/ & label {
      line-height: 28px;
    }
  }

  .right-side-heading {
    display: flex;
    flex-direction: row-reverse;
  }

  .left-side-heading {
    display: flex;
    align-items: center;
  }

  .questions-list-label-row {
    /deep/ & > div {
      align-items: center;
    }
  }

  .question-content-panel {
    padding-left: 5.5em;
  }

  /deep/ .sortable-handled {
    align-self: flex-end;
  }

  .divider {
    display: block;
    min-width: 100%;
    height: 1px;
    margin: 8px 0;
    overflow-y: hidden;
  }

  .section-header {
    font-size: 1.125em;
  }

</style>
