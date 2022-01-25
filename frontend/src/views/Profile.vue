<template>
  <div>
    <main v-if="mode == 'modifProfile'">
      <div class="modif">
        <div class="modif__profile">
          <div class="modif__profile__icon">
            <i
              @click="modifExit()"
              class="fas fa-times-circle modif__profile__icon--size"
            ></i>
          </div>

          <form>
            <div class="flex">
              <div class="modif__profile__photo">
                <img
                  v-if="modePic == 'defaultPic' && userInfos.profilImg == null"
                  class="modif__profile__photo--img"
                  src="../assets/icon.png"
                  alt="Photo de profil"
                />
                <img
                  v-if="modePic == 'defaultPic' && userInfos.profilImg != null"
                  class="modif__profile__photo--img"
                  :src="userInfos.profilImg"
                  alt="Photo de profil"
                />
                <img
                  v-if="modePic == 'previewPic'"
                  class="modif__profile__photo--img"
                  :src="previewImg"
                  alt="Photo de profil"
                />
              </div>

              <label class="flex__pic" for="picture"
                >Modifier ma photo de profil</label
              >
              <input
                id="picture"
                type="file"
                accept=".jpg, .jpeg, .png"
                @change="fileChange"
              />
              <button @click="deletePic()" type="button" class="flex__button">
                <span>Supprimer ma photo de profil</span>
              </button>
            </div>

            <div class="inputMargin">
              <label for="username">Changer votre pseudo :</label>

              <input type="text" v-model="username" />
            </div>

            <div class="inputMargin">
              <label for="biographie">Changer votre biographie :</label>

              <input type="text" class="bioSize" v-model="bio" />
            </div>

            <div>
              <button
                @click="putUserInf()"
                type="button"
                class="modif__profile__button"
              >
                <span>Sauvegarder mes informations</span>
              </button>
            </div>
          </form>

          <p class="attention">
            --------- Attention, toute suppression de compte est irréversible !
            ---------
          </p>

          <div>
            <button
              @click="deleteUser()"
              type="button"
              class="modif__profile__button"
            >
              <span>Supprimer mon compte</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <header>
      <Vheader />
    </header>

    <main v-if="mode == 'defaultProfile'">
      <div class="profile">
        <div class="profile__link">
          <button @click="actu()" type="button" class="profile__link--bodyl">
            <span>Fil d'actualités</span>
          </button>
          <button @click="logout()" type="button" class="profile__link--bodyr">
            <span>Se déconnecter</span>
          </button>
        </div>

        <div class="profile__photo">
          <img
            v-if="userInfos.profilImg != null"
            class="profile__photo--img"
            :src="userInfos.profilImg"
            alt="Photo de profil"
          />
          <img
            v-else
            class="profile__photo--img"
            src="../assets/icon.png"
            alt="Photo de profil"
          />
        </div>

        <p>{{ userInfos.username }}</p>

        <p>{{ userInfos.bio }}</p>

        <div class="">
          <button @click="modifP()" type="button" class="button">
            <span>Modifier mon compte</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Vheader from "@/components/Vheader.vue";
import { mapState } from "vuex";

export default {
  name: "Profile",
  mounted: function () {
    if (this.$store.state.user.idUSERS == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getUserInfos");
  },

  components: {
    Vheader,
  },

  data: function () {
    return {
      mode: "defaultProfile",
      modePic: "defaultPic",
      profilImg: null,
      previewImg: null,
      newFile: false,
      username: "",
      bio: "",
      images: null,
    };
  },

  computed: {
    ...mapState(["userInfos"]),
  },

  methods: {
    actu: function () {
      console.log(this.$store.state.user.userId);
      this.$router.push(`/Publication`);
    },
    logout: function () {
      this.$store.commit("logout");
      this.$router.push("/");
    },
    fileChange(e) {
      this.newFile = true;
      this.images = e.target.files[0];
      this.profilImg = this.images.name;
      const reader = new FileReader();
      reader.readAsDataURL(this.images);
      reader.onload = (e) => {
        this.previewImg = e.target.result;
      };
      this.modePic = "previewPic";
    },
    modifP: function () {
      this.mode = "modifProfile";
      this.profilImg = this.userInfos.profilImg;
      this.username = this.userInfos.username;
      this.bio = this.userInfos.bio;
    },
    putUserInf: function () {
      if (this.newFile === true) {
        const formData = new FormData();
        formData.append("image", this.images, this.images.name);
        this.$store.dispatch("putUserPhoto", formData);
      }

      this.$store.dispatch("putUserInfos", {
        username: this.username,
        bio: this.bio,
      });
      this.$router.go();
    },
    deletePic: function () {
      if (this.profilImg != null) {
        this.$store.dispatch("deleteUserPhoto");
        this.$router.go();
      }
    },
    deleteUser: function () {
      this.$store.dispatch("deleteUser");
      this.$store.commit("logout");
      this.$router.push("/");
    },
    modifExit: function () {
      this.mode = "defaultProfile";
      this.previewImg = null;
      this.modePic = "defaultPic";
    },
  },
};
</script>

<style lang="scss" scoped>
#picture {
  display: none;
}
.attention {
  color: #fd2d01;
  font-weight: bold;
}
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 50px;
  gap: 10px;
  &__button {
    background: #fd2d01;
    color: white;
    border-radius: 8px;
    font-weight: 800;
    font-size: 15px;
    border: none;
    min-width: 280px;
    width: 50%;
    padding: 16px;
    margin: 10px;

    &:hover {
      cursor: pointer;
      transform: scale(1.01) translate(-10px, -4px);
      box-shadow: 4px 5px 8px 4px #c7c7c7;
    }
    &:active {
      transform: scale(0.9);
      transition: 0.1s;
      box-shadow: -6px -4px 32px 0px;
    }
  }

  &__pic {
    background: #ffd7d7;
    color: #fd2d01;
    border-radius: 8px;
    font-weight: 800;
    font-size: 15px;
    border: none;
    min-width: 240px;
    width: 50%;
    padding: 16px;
    margin: 10px;
    font-family: "Roboto", sans-serif;

    box-shadow: 4px 5px 8px 4px #c7c7c7;
    &:hover {
      cursor: pointer;
      transform: scale(1.01) translate(-10px, -4px);
    }
    &:active {
      transform: scale(0.9);
      transition: 0.1s;
      box-shadow: -6px -4px 32px 0px;
    }
  }
}
.inputMargin {
  display: flex;
  font-family: "Roboto", sans-serif;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 15px;
}
main {
  display: flex;
  justify-content: center;
  margin-top: 4px;
  background-color: #ffd7d7;
}
.profile {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 26px;
  background-color: white;
  padding-bottom: 26px;
  align-items: center;
  max-width: 700px;
  &__link {
    display: flex;
    width: 100%;
    gap: 8px;

    &--bodyl {
      background: #ffd7d7;
      color: #fd2d01;

      margin-bottom: 26px;
      font-weight: 800;
      font-size: 15px;
      border: none;
      width: 50%;
      padding: 16px;

      &:hover {
        cursor: pointer;
        transform: scale(1.01) translate(10px, -4px);
        box-shadow: -4px 5px 8px 4px #c7c7c7;
      }
      &:active {
        transform: scale(0.9);
        transition: 0.1s;
        box-shadow: -6px -4px 32px 0px #c7c7c7;
      }
    }
    &--bodyr {
      background: #ffd7d7;
      color: #fd2d01;

      margin-bottom: 26px;
      font-weight: 800;
      font-size: 15px;
      border: none;
      width: 50%;
      padding: 16px;

      &:hover {
        cursor: pointer;
        transform: scale(1.01) translate(-10px, -4px);
        box-shadow: 4px 5px 8px 4px #c7c7c7;
      }
      &:active {
        transform: scale(0.9);
        transition: 0.1s;
        box-shadow: -6px -4px 32px 0px #c7c7c7;
      }
    }
  }

  &__photo {
    width: 40%;
    overflow: hidden;

    border-radius: 50%;

    &--img {
      width: 100%;
      object-fit: cover;
    }
  }
}
.button {
  background: #fd2d01;
  color: white;
  border-radius: 8px;
  font-weight: 800;
  font-size: 15px;
  border: none;
  min-width: 280px;
  width: 50%;
  padding: 16px;
  margin: 10px;

  &:hover {
    cursor: pointer;
    transform: scale(1.01) translate(-10px, -4px);
    box-shadow: 4px 5px 8px 4px #c7c7c7;
  }
  &:active {
    transform: scale(0.9);
    transition: 0.1s;
    box-shadow: -6px -4px 32px 0px;
  }
}

.modif {
  position: absolute;

  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  background: black;
  opacity: 0.85;
  &__profile {
    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: #ffd7d7;
    width: 100%;
    max-width: 600px;
    border-radius: 16px;
    &__icon {
      width: 100%;
      text-align: right;

      &--size {
        font-size: 35px;
        color: #fd2d01;
        margin-right: -1.8px;
        margin-top: -1.8px;
        cursor: pointer;
      }
    }
    &__photo {
      width: 40%;
      border-radius: 50%;
      overflow: hidden;
      margin: 10px;

      &--img {
        width: 100%;
      }
    }
    &__button {
      background: #fd2d01;
      color: white;
      border-radius: 8px;
      font-weight: 800;
      font-size: 15px;
      border: none;
      min-width: 280px;
      width: 50%;
      padding: 16px;
      margin: 10px;
      margin-top: 30px;
      margin-bottom: 40px;
      font-family: "Roboto", sans-serif;

      &:hover {
        cursor: pointer;
        transform: scale(1.01) translate(-10px, -4px);
        box-shadow: 4px 5px 8px 4px #c7c7c7;
      }
      &:active {
        transform: scale(0.9);
        transition: 0.1s;
        box-shadow: -6px -4px 32px 0px;
      }
    }
  }
}
</style>
