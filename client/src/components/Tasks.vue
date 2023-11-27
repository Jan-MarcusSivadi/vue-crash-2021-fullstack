<template>
  <div v-if="tasks.length > 0">
    <div :key="task.uid"  v-for="task in tasks">
      <Task
        @toggle-reminder="$emit('toggle-reminder', task.uid)"
        @delete-task="$emit('delete-task', task.uid)"
        :task="task"
      />
    </div>
  </div>
</template>

<script>
import Task from "./Task";

export default {
  name: "Tasks",
  props: {
    tasks: Array,
  },
  components: {
    Task,
  },
  emits: ["delete-task", "toggle-reminder"],
};
</script>