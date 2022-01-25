import { createStore } from "vuex";
const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

let user = localStorage.getItem("user");
if (!user) {
  user = {
    idUSERS: -1,
    token: "",
  };
} else {
  try {
    user = JSON.parse(user);
  } catch (ex) {
    user = {
      idUSERS: -1,
      token: "",
    };
  }
}
export default createStore({
  state: {
    status: "",
    user: user,
    userInfos: {},
    publicationInfos: [],
  },
  mutations: {
    setStatus: function (state, status) {
      state.status = status;
    },
    logUser: function (state, user) {
      instance.defaults.headers.common["Authorization"] = user.token;
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    },
    userInfos: function (state, userInfos) {
      state.userInfos = userInfos;
    },
    publicationInfos: function (state, publicationInfos) {
      state.publicationInfos = publicationInfos;
    },

    logout: function (state) {
      state.user = {
        idUSERS: -1,
        token: "",
      };
      localStorage.removeItem("user");
    },
  },
  actions: {
    login: ({ commit }, userInfos) => {
      return new Promise((resolve, reject) => {
        instance
          .post("/user/login", userInfos)
          .then(function (response) {
            commit("setStatus", "valid");
            commit("logUser", response.data);

            resolve(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_login");
            reject(error);
            console.log(error);
          });
      });
    },

    createAccount: ({ commit }, userInfos) => {
      return new Promise((resolve, reject) => {
        instance
          .post("/user/signup", userInfos)
          .then(function (response) {
            commit("setStatus", "valid");
            resolve(response);
            console.log(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_create");
            reject(error);
            console.log(error);
          });
      });
    },

    getUserInfos: ({ commit }) => {
      let getId = localStorage.getItem("user");
      getId = JSON.parse(getId);
      const config = {
        headers: { Authorization: `Bearer ${getId.token}` },
      };

      instance
        .get(`/user/${getId.userId}`, config)
        .then(function (response) {
          console.log("TESTTTTT");
          commit("userInfos", response.data);
        })
        .catch(function () {
          console.log("ERROR TEST");
        });
    },

    putUserInfos: ({ commit }, userInfos) => {
      commit;

      let getId = localStorage.getItem("user");
      getId = JSON.parse(getId);
      const config = {
        headers: { Authorization: `Bearer ${getId.token}` },
      };
      instance
        .put(`/user/${getId.userId}`, userInfos, config)
        .then(function () {})
        .catch(function () {
          commit("Error get");
          console.log("ERROR TEST");
        });
    },

    putUserPhoto: ({ commit }, formData) => {
      commit;

      let getId = localStorage.getItem("user");
      getId = JSON.parse(getId);
      const config = {
        headers: { Authorization: `Bearer ${getId.token}` },
      };

      instance
        .put(`/user/${getId.userId}/pdp`, formData, config)
        .then(function () {})
        .catch(function () {
          commit("Error get");
          console.log("ERROR TEST");
        });
    },
    deleteUserPhoto: ({ commit }) => {
      commit;
      let getId = localStorage.getItem("user");
      getId = JSON.parse(getId);
      const config = {
        headers: { Authorization: `Bearer ${getId.token}` },
      };
      instance
        .delete(`/user/${getId.userId}/photo`, config)
        .then(function () {})
        .catch(function () {
          commit("Error get");
          console.log("ERROR TEST");
        });
    },

    createPublication: ({ commit }, formData) => {
      commit;
      let getId = localStorage.getItem("user");
      getId = JSON.parse(getId);
      const config = {
        headers: {
          Authorization: `Bearer ${getId.token}`,
        },
      };
      instance
        .post(`/publications/create`, formData, config)
        .then(function () {})
        .catch(function () {
          commit("Error get");
          console.log("ERROR TEST");
        });
    },

    getAllPublications: ({ commit }) => {
      let getId = localStorage.getItem("user");
      getId = JSON.parse(getId);
      const config = {
        headers: { Authorization: `Bearer ${getId.token}` },
      };

      instance
        .get(`/publications/getAll`, config)
        .then(function (response) {
          console.log(response.data);
          commit("publicationInfos", response.data);
        })
        .catch(function () {
          console.log("ERROR TEST");
        });
    },

    deletePublication: ({ commit }, publicationId) => {
      commit;
      let getId = localStorage.getItem("user");
      getId = JSON.parse(getId);
      const config = {
        headers: { Authorization: `Bearer ${getId.token}` },
      };
      instance
        .delete(`/publications/${getId.userId}/${publicationId}/delete`, config)
        .then(function (res) {
          console.log(res);
        })
        .catch(function () {
          commit("Error get");
          console.log("ERROR TEST");
        });
    },

    createComment: ({ commit }, message) => {
      commit;
      let getId = localStorage.getItem("user");
      getId = JSON.parse(getId);
      const config = {
        headers: {
          Authorization: `Bearer ${getId.token}`,
        },
      };
      instance
        .post(`/comment/${getId.userId}/createComment`, message, config)
        .then(function () {})
        .catch(function () {
          commit("Error get");
          console.log("ERROR TEST");
        });
    },

    deleteComment: ({ commit }, idComment) => {
      commit;
      let getId = localStorage.getItem("user");
      getId = JSON.parse(getId);
      const config = {
        headers: {
          Authorization: `Bearer ${getId.token}`,
        },
      };
      instance
        .delete(`/comment/${getId.userId}/${idComment}/deleteComment`, config)
        .then(function () {})
        .catch(function () {
          commit("Error get");
          console.log("ERROR TEST");
        });
    },

    createLike: ({ commit }, publicationId) => {
      return new Promise((resolve, reject) => {
        commit;
        let getId = localStorage.getItem("user");
        getId = JSON.parse(getId);
        const config = {
          headers: {
            Authorization: `Bearer ${getId.token}`,
          },
        };
        instance
          .post(`/like/${getId.userId}/createLike`, publicationId, config)
          .then(function (res) {
            resolve(res);
          })
          .catch(function (err) {
            commit("Error get");
            console.log("ERROR TEST");
            reject(err);
          });
      });
    },

    deleteUser: ({ commit }) => {
      commit;
      let getId = localStorage.getItem("user");
      getId = JSON.parse(getId);
      const config = {
        headers: { Authorization: `Bearer ${getId.token}` },
      };
      instance
        .delete(`/user/${getId.userId}/deleteUser`, config)
        .then(function () {})
        .catch(function () {
          commit("Error get");

          console.log("ERROR TEST");
        });
    },
  },
  modules: {},
});
