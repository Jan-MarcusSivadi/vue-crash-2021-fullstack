<template>
  <div class="container">
    <Header
      @toggle-add-task="toggleAddTask"
      title="Task Tracker"
      :showAddTask="showAddTask"
    />
    <div v-show="showAddTask">
      <AddTask @add-task="addTask" />
    </div>
    <Tasks
      @toggle-reminder="toggleReminder"
      @delete-task="deleteTask"
      :tasks="tasks"
    />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";

export default {
  name: "App",
  components: {
    Header,
    Footer,
    Tasks,
    AddTask,
  },
  data() {
    return {
      tasks: [],
      showAddTask: false,
    };
  },
  methods: {
    toggleAddTask() {
      this.showAddTask = !this.showAddTask;
    },
    async addTask(task) {
      const res = await fetch(`/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const data = await res.json();
      this.tasks = [...this.tasks, data];
    },
    async deleteTask(id) {
      if (confirm("Are you sure?")) {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
        });

        res.status === 204
          ? (this.tasks = this.tasks.filter((task) => task.uid !== id))
          : alert("Error deleting task");
      }
    },
    async toggleReminder(id) {
      if (!id) {
        return alert("Task not found");
      }

      this.tasks = this.tasks.map((task) => {
        return task.uid === id ? { ...task, reminder: !task.reminder } : task;
      });

      const taskToToggle = await this.fetchTask(id);
      if (!taskToToggle) {
        return alert("Task not found");
      }
      const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updTask),
      });

      if (res.status !== 200) {
        return alert("Error updating task");
      }

      const data = await res.json();
      console.log(data);

      // this.tasks = this.tasks.map((task) => {
      //   return task.uid === id ? { ...task, reminder: data.reminder } : task;
      // });
    },
    async fetchTasks() {
      let data;
      try {
        const res = await fetch(`/api/tasks`);

        if (!res || res.status != 200) {
          return null;
        }
        data = await res.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
      return data;
    },
    async fetchTask(id) {
      let data;
      try {
        const res = await fetch(`/api/tasks/${id}`);

        if (!res || res.status != 200) {
          return null;
        }
        data = await res.json();
      } catch (error) {
        console.error(error);
      }
      return data;
    },
  },
  async created() {
    var fetchedTasks = await this.fetchTasks();
    this.tasks = fetchedTasks || [];
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Poppins", sans-serif;
}

.container {
  max-width: 500px;
  margin: 30px auto;
  overflow: auto;
  min-height: 300px;
  border: 1px solid steelblue;
  padding: 30px;
  border-radius: 5px;
}

.btn {
  display: inline-block;
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}

.btn:focus {
  outline: none;
}

.btn:active {
  transform: scale(0.98);
}

.btn-block {
  display: block;
  width: 100%;
}
</style>
