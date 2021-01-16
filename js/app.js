const store = new Vuex.Store({
  state: {
    todos: [
      {
        id: 1,
        name: "Cuci motor",
        status: "pending",
      },
      {
        id: 2,
        name: "Cabutin rumput",
        status: "doing",
      },
      {
        id: 3,
        name: "Belajar vuex: simple todo",
        status: "doing",
      },
      {
        id: 4,
        name: "Belanja kebutuhan",
        status: "done",
      },
    ],
  },
  mutations: {
    addTodo(state, payload) {
      return state.todos.push(payload);
    },
    changeTodo(state, payload) {
      const item = state.todos.filter(function (todo) {
        return todo.id == payload.id;
      });

      return (item.status = payload.status);
    },
  },
  getters: {
    todoCount(state, getters) {
      return getters.todoList.length;
    },
    todoList(state) {
      return state.todos;
    },
  },
});

Vue.component("todo-list", {
  functional: true,
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  render(createElemenent, { props, listeners}) {
    if (props.items.length) {
      function todoName(name) {
        return createElemenent("p", { class: "has-text-weight-bold" }, name);
      }

      function todoStatus(item) {
        let getStatus = "";
        if (item.status == "pending") {
          getStatus = "is-warning";
        }
        if (item.status == "done") {
          getStatus = "is-success";
        }
        if (item.status == "doing") {
          getStatus = "is-primary";
        }

        return createElemenent(
          "span",
          { class: `tag is-rounded ${getStatus}` },
          item.status
        );
      }

      return createElemenent("div", { class: "box" }, [
        props.items.map(function (item) {
          return createElemenent(
            "article",
            {
              class: "media",
              on: {
                click: function (e) {
                  listeners.click(item);
                },
              },
            },
            [
              createElemenent("div", { class: "media-content" }, [
                todoName(item.name),
              ]),
              createElemenent("div", { class: "media-right" }, [
                todoStatus(item),
              ]),
            ]
          );
        }),
      ]);
    }

    return createElemenent(
      "p",
      { class: "box has-text-grey has-text-centered" },
      "No todo list"
    );
  },
});
Vue.component("app-navigation", {
  props: {
    count: {
      type: Number,
      required: true,
    },
  },
  render(createElemenent) {
    function incrementId(val) {
      return val + 1;
    }
    let self = this;
    let formData = {
      id: incrementId(this.count),
      name: "",
      status: "doing",
    };
    const levelLeftItem = createElemenent("div", { class: "level-item" }, [
      createElemenent("p", { class: "subtitle is-5" }, [
        createElemenent("strong", `${this.count} `),
        createElemenent("span", "todos"),
      ]),
    ]);
    const newTodoAction = createElemenent(
      "div",
      { class: "field has-addons" },
      [
        createElemenent("p", { class: "control" }, [
          createElemenent("input", {
            class: "input",
            attrs: {
              type: "text",
              placeholder: "Add new one...",
            },
            domProps: {
              value: self.value,
            },
            on: {
              input: function (event) {
                formData.name = event.target.value;
              },
            },
          }),
        ]),
        createElemenent("p", { class: "control" }, [
          createElemenent(
            "button",
            {
              class: "button is-success",
              on: {
                click: function (event) {
                  self.$emit("add", formData);
                },
              },
            },
            "Add"
          ),
        ]),
      ]
    );
    const levelRightItem = createElemenent("p", { class: "level-item" }, [
      newTodoAction,
    ]);
    return createElemenent("div", { class: "level" }, [
      createElemenent("div", { class: "level-left" }, [levelLeftItem]),
      createElemenent("div", { class: "level-right" }, [levelRightItem]),
    ]);
  },
});
Vue.component("app-title", {
  functional: true,
  render(createElemenent, { slots }) {
    return createElemenent(
      "h1",
      { class: "title has-text-centered" },
      slots().default
    );
  },
});
Vue.component("app-wrapper", {
  functional: true,
  render(createElemenent, { slots }) {
    return createElemenent("section", { class: "section" }, slots().default);
  },
});
Vue.component("item-modal", {
  functional: true,
  props: {
    active: {
      type: Boolean,
    },
    data: {
      type: Object,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
  },
  render(createElemenent, { props, listeners }) {
    const self = this;
    const isActive = props.active ? "is-active" : "";
    let arrayCheck = ["pending", "doing", "done"];
    function radioBoxList(items, checked) {
      return items.map(function (item) {
        return createElemenent("label", { class: "radio" }, [
          createElemenent("input", {
            attrs: { type: "radio" },
            domProps: { checked: item == checked, value: item },
            on: {
              change: function (e) {
                listeners.change(e.target.value);
              },
            },
          }),
          item,
        ]);
      });
    }

    return createElemenent("div", { class: `modal ${isActive}` }, [
      createElemenent("div", { class: "modal-background" }),
      createElemenent("div", { class: "modal-card" }, [
        createElemenent("header", { class: "modal-card-head" }, [
          createElemenent("p", { class: "modal-card-title" }, props.data.name),
          createElemenent("button", {
            class: "delete",
            attrs: { "aria-label": "close" },
            on: {
              click: listeners.close,
            },
          }),
        ]),
        createElemenent("section", { class: "modal-card-body" }, [
          createElemenent("div", { class: "control" }, [
            radioBoxList(arrayCheck, props.status),
          ]),
        ]),
      ]),
    ]);
  },
});

new Vue({
  el: "#app",
  store: store,
  data() {
    return {
      modalActive: false,
      modalData: {},
    };
  },
  computed: {
    todoCount() {
      return this.$store.getters.todoCount;
    },
    todoList() {
      return this.$store.getters.todoList;
    },
  },
  methods: {
    newTodo(val) {
      this.$store.commit("addTodo", val);
    },
    openMOdal(val) {
      this.modalActive = true;
      this.modalData = val;
    },
    closeModal() {
      this.modalActive = false;
    },
    changeModal(val) {
      this.modalData.status = val;
      this.modalActive = false;
      this.$store.commit("changeTodo", val);
    },
  },
});
