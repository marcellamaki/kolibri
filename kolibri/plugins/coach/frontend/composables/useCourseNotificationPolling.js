import { watch, onUnmounted } from 'vue';

// LOD-synced progress doesn't generate notifications associated with
// the course session, so we need to poll for updates
const FALLBACK_POLL_INTERVAL_MS = 20000;

export default function useCourseNotificationPolling(
  store,
  courseSessionId,
  onRelevantNotifications,
) {
  const initial = store.getters['coachNotifications/maxNotificationTimestamp'];
  let baselineMs = initial ? new Date(initial).getTime() : 0;

  watch(
    () => store.getters['coachNotifications/maxNotificationTimestamp'],
    newTimestamp => {
      if (!newTimestamp || !courseSessionId.value) return;
      const newMs = new Date(newTimestamp).getTime();
      const notifications = store.state.coachNotifications.notifications;
      const hasRelevant = notifications.some(
        n =>
          n.course_session_id === courseSessionId.value &&
          new Date(n.timestamp).getTime() > baselineMs,
      );
      if (hasRelevant) {
        baselineMs = newMs;
        onRelevantNotifications();
      }
    },
  );

  const intervalId = setInterval(() => {
    if (courseSessionId.value) {
      onRelevantNotifications();
    }
  }, FALLBACK_POLL_INTERVAL_MS);
  onUnmounted(() => clearInterval(intervalId));
}
