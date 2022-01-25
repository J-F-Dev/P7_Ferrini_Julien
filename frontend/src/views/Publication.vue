<template>
  <div>
    <header>
      <Vheader />
    </header>
    <main>
      <div class="editMain">
        <div class="publication">
          <div class="publication__link">
            <button
              @click="profil()"
              type="button"
              class="publication__link--bodyl"
            >
              <span>Mon profil</span>
            </button>
            <button
              @click="logout()"
              type="button"
              class="publication__link--bodyr"
            >
              <span>Se déconnecter</span>
            </button>
          </div>

          <div class="publication__post">
            <div class="publication__post__photo">
              <img
                class="publication__post__photo--img"
                :src="userInfos.profilImg"
                alt="Photo de profil"
              />
            </div>

            <div class="publication__post__icon">
              <i class="fas fa-pen fa-flip-horizontal"></i>
            </div>

            <div class="publication__post__qdn">
              <input
                v-if="modeAlert == 'red'"
                v-model="content"
                type="text"
                class="publication__post__qdn--input--red"
                :placeholder="
                  'Bonjour ' +
                  userInfos.username +
                  ', souhaitez vous poster un message ?'
                "
              />
              <input
                v-else
                v-model="content"
                type="text"
                class="publication__post__qdn--input"
                :placeholder="
                  'Bonjour ' +
                  userInfos.username +
                  ', souhaitez vous poster un message ?'
                "
              />

              <div
                v-if="modePic == 'previewPic'"
                class="publication__post__qdn--preview"
              >
                <img
                  :src="previewImg"
                  alt="Photo publication"
                  class="publication__post__qdn--preview--size"
                />
                <span
                  ><i
                    @click="previewExit()"
                    class="fas fa-times-circle publication__post__qdn--preview--exit"
                  ></i
                ></span>
              </div>
            </div>
            <label
              class="publication__post__download"
              for="downloadImg"
              title="Ajouter une photo"
              ><i class="fas fa-images publication__post__download--icon"></i>
            </label>
            <input
              id="downloadImg"
              type="file"
              accept=".jpg, .jpeg, .png"
              @change="fileChange"
            />

            <label
              class="publication__post__sent"
              for="sentP"
              title="Envoyer la publication"
              ><i class="fas fa-paper-plane publication__post__sent--icon"></i
            ></label>
            <button
              @click="sentPublication()"
              id="sentP"
              type="button"
            ></button>
          </div>
        </div>
      </div>

      <div class="publicationMain">
        <div
          v-for="publicationInfo in publicationInfos"
          :key="publicationInfo"
          class="publicationsGet"
        >
          <div class="publicationsGet__userInfos">
            <div class="publicationsGet__userInfos__profilImg">
              <img
                class="publicationsGet__userInfos__profilImg--size"
                :src="publicationInfo.User.profilImg"
                alt="Photo de profil"
              />
            </div>
            <div class="publicationsGet__userInfos__info">
              <p>{{ publicationInfo.User.username }}</p>
            </div>
            <div class="publicationsGet__userInfos__info">
              <p>
                Publié le : {{ publicationInfo.createdAt.slice(8, 10) }}/{{
                  publicationInfo.createdAt.slice(5, 7)
                }}/{{ publicationInfo.createdAt.slice(0, 4) }} à
                {{ publicationInfo.createdAt.slice(11, 19) }}s
              </p>
            </div>
          </div>

          <div class="publicationsGet__publicationInfos">
            <div
              v-if="publicationInfo.attachment != null"
              class="publicationsGet__publicationInfos__attachment"
            >
              <img
                :src="publicationInfo.attachment"
                alt="photo publiée"
                class="publicationsGet__publicationInfos__attachment--size"
              />
            </div>
            <div class="publicationsGet__publicationInfos__content">
              <p>{{ publicationInfo.content }}</p>
            </div>
          </div>

          <div class="publicationsGet__border"></div>

          <div class="publicationsGet__commentLike">
            <div
              @click="sentLike(publicationInfo.id)"
              class="publicationsGet__commentLike__button"
              :class="buttonLike(publicationInfo.Likes)"
            >
              <i
                class="far fa-thumbs-up"
                :class="buttonLikeIcon(publicationInfo.Likes)"
              >
              </i>
              <span>{{ publicationInfo.Likes.length }}</span>
            </div>

            <div
              @click="openComment(publicationInfo.id)"
              class="publicationsGet__commentLike__button comment"
            >
              <p v-if="publicationInfo.id == this.openCom">
                Masquer les commentaires
              </p>
              <p v-else-if="publicationInfo.Comments.length <= 1">
                {{ publicationInfo.Comments.length }} Commentaire
              </p>
              <p v-else>{{ publicationInfo.Comments.length }} Commentaires</p>
            </div>
            <span
              v-if="
                this.$store.state.user.userId == publicationInfo.idUSERS ||
                this.userInfos.isAdmin == true
              "
              class="publicationsGet__commentLike__delete"
              ><i
                @click="deletePublication(publicationInfo.id)"
                class="fas fa-trash-alt publicationsGet__commentLike__delete--icon"
              ></i
            ></span>

            <div
              v-if="publicationInfo.id == this.openCom"
              class="publicationsGet__commentLike__comment"
            >
              <div class="scrollComment">
                <div
                  v-for="commentInfo in publicationInfo.Comments"
                  :key="commentInfo"
                  class="publicationsGet__commentLike__comment__for"
                >
                  <div class="publicationsGet__commentLike__comment__for__get">
                    <div
                      class="publicationsGet__commentLike__comment__for__get__photo"
                    >
                      <img
                        class="publicationsGet__commentLike__comment__for__get__photo--size"
                        :src="commentInfo.User.profilImg"
                        alt="photo de profil"
                      />
                    </div>
                    <div
                      class="publicationsGet__commentLike__comment__for__get__text"
                    >
                      <p>{{ commentInfo.message }}</p>
                      <span
                        ><i
                          v-if="
                            this.$store.state.user.userId ==
                              commentInfo.idUSERS ||
                            this.userInfos.isAdmin == true
                          "
                          @click="deleteComment(commentInfo.id)"
                          class="fas fa-trash publicationsGet__commentLike__comment__for__get__text--icon"
                        ></i
                      ></span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="publicationsGet__commentLike__comment__send">
                <div class="publicationsGet__commentLike__comment__send__photo">
                  <img
                    class="publicationsGet__commentLike__comment__send__photo--img"
                    :src="userInfos.profilImg"
                    alt="Photo de profil"
                  />
                </div>

                <div class="publicationsGet__commentLike__comment__send__icon">
                  <i class="fas fa-pen fa-flip-horizontal"></i>
                </div>

                <div class="publicationsGet__commentLike__comment__send__text">
                  <input
                    @input="listenInput($event)"
                    v-model="com"
                    type="text"
                    class="publicationsGet__commentLike__comment__send__text--input"
                    :placeholder="
                      'Bonjour ' +
                      userInfos.username +
                      ', souhaitez vous laisser un commentaire?'
                    "
                  />
                </div>
                <label
                  class="publicationsGet__commentLike__comment__send__button"
                  for="sentC"
                  title="Envoyer le commentaire"
                  ><i
                    @click="sentComment(publicationInfo.id)"
                    class="fas fa-paper-plane publicationsGet__commentLike__comment__send__button--icon"
                  ></i
                ></label>
                <button id="sentC" type="button"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Vheader from "@/components/Vheader.vue";
import { mapState } from "vuex";
export default {
  name: "Publication",
  props: {
    listPost: null,
  },

  components: {
    Vheader,
  },
  data: function () {
    return {
      attachment: null,
      modePic: "defaultPic",
      previewImg: null,
      images: null,
      content: "",
      com: "",
      comReset: "",
      openCom: "",
      up: false,
      upSave: false,
      okLike: null,
      title: "Mes publications",
      modeAlert: "defaultAlert",
      status: "defaultStatus",
    };
  },
  computed: {
    ...mapState(["userInfos", "publicationInfos"]),
  },
  mounted: function () {
    if (this.$store.state.user.idUSERS == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getUserInfos");
    this.$store.dispatch("getAllPublications");
  },

  beforeUpdate: function () {
    this.upsend();
  },
  updated: function () {
    if (this.upSave == true) {
      this.$store.dispatch("getAllPublications");
      this.upSave = false;
    }
  },

  methods: {
    buttonLike: function (tabLike) {
      console.log(tabLike);
      if (
        tabLike.find((like) => like.idUSERS == this.$store.state.user.userId)
      ) {
        return "likeTrue";
      } else {
        return "like";
      }
    },
    buttonLikeIcon: function (tabLike) {
      if (
        tabLike.find((like) => like.idUSERS == this.$store.state.user.userId)
      ) {
        return "likeTrue__icon";
      } else {
        return "";
      }
    },
    upsend: function () {
      if (this.up == true) {
        this.$store.dispatch("getAllPublications");
        this.upSave = true;
        this.up = false;
      }
    },
    profil: function () {
      this.$router.push(`/Profile`);
    },
    logout: function () {
      this.$store.commit("logout");
      this.$router.push("/");
    },

    fileChange(e) {
      this.images = e.target.files[0];
      this.attachment = this.images.name;
      const reader = new FileReader();
      reader.readAsDataURL(this.images);
      reader.onload = (e) => {
        this.previewImg = e.target.result;
      };
      this.modePic = "previewPic";
    },
    sentPublication: function () {
      if (this.content == "") {
        this.modeAlert = "red";
        alert("Merci d'écrire un message avant d'envoyer une publication");
      } else {
        let publication = {
          idUSERS: this.$store.state.user.userId,
          title: this.title,
          content: this.content,
        };
        let formData = new FormData();
        if (this.images != null) {
          formData.append("image", this.images, this.images.name);
        }

        formData.append("publication", JSON.stringify(publication));

        this.$store.dispatch("createPublication", formData);
        this.$router.go();
      }
    },
    sentComment: function (id) {
      console.log(id);

      if (this.com == "") {
        alert("Merci d'écrire un message avant d'envoyer un commentaire");
      } else {
        let publicationId = id;

        let message = {
          publicationId: publicationId,
          message: this.com,
        };

        this.$store.dispatch("createComment", message);

        this.com = "";
        this.up = true;
        if (this.up == true) {
          this.upsend();
          this.up = false;
        }
      }
    },
    listenInput: function (e) {
      this.com = e.target.value;
    },
    openComment: function (e) {
      if (this.openCom != e) {
        this.openCom = e;
      } else {
        this.openCom = "";
      }
    },
    deletePublication: function (id) {
      let publicationId = id;
      publicationId = JSON.parse(publicationId);

      this.$store.dispatch("deletePublication", publicationId);
      this.$router.go();
    },
    deleteComment: function (id) {
      let idComment = id;
      idComment = JSON.parse(idComment);
      this.$store.dispatch("deleteComment", idComment);
      this.up = true;
      if (this.up == true) {
        this.upsend();
        this.up = false;
      }
    },
    sentLike: function (id) {
      let publicationId = id;
      publicationId = JSON.parse(publicationId);
      let pub = {
        publicationId: publicationId,
      };
      this.$store.state.publicationInfos;

      this.$store.dispatch("createLike", pub).then(
        function (res) {
          console.log(res);
        },
        function (err) {
          console.log(err);
        }
      );
      this.up = true;

      if (this.up == true) {
        this.upsend();
        this.up = false;
      }
    },

    previewExit: function () {
      this.modePic = "defaultPic";
      this.attachment = null;
      this.previewImg = null;
      console.log(this.publicationInfos);
    },
  },
};
</script>

<style lang="scss" scoped>
.scrollComment {
  max-height: 243px;
  border-radius: 16px;
  overflow: auto;
  background-color: #ffd7d7;
  box-shadow: 0px 0px 12px -6px black inset;
  width: 100%;
}
#downloadImg {
  display: none;
}
#sentP {
  display: none;
}
#sentC {
  display: none;
}
.editMain {
  display: flex;

  justify-content: center;

  margin-top: 4px;
  background-color: #ffd7d7;
}
.publicationMain {
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #ffd7d7;
}
.like {
  max-width: 80px;
  gap: 5px;
}
.likeTrue {
  max-width: 80px;
  gap: 5px;
  background-color: white !important;
  color: #fd2d01 !important;
  &__icon {
    font-size: 30px;
    color: #fd2d01;
  }
}
.dislike {
  max-width: 80px;
}
.comment {
  max-width: 250px;
}
.publication {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 26px;
  background-color: white;
  border-radius: 0 0 16px 16px;
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
  &__post {
    display: flex;
    align-items: center;

    margin-bottom: 20px;
    border: solid #ffd7d7;

    width: 100%;

    &__photo {
      display: flex;
      width: 13%;
      height: 100%;
      overflow: hidden;

      &--img {
        width: 100%;
        max-height: 54px;
        object-fit: cover;
      }
    }
    &__icon {
      display: flex;
      height: 100%;
      padding-top: 25px;
      margin-left: 2%;
    }
    &__qdn {
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      align-items: center;
      width: 100%;
      overflow: hidden;
      font-size: 2rem;
      margin-left: 2%;
      margin-right: 2%;

      &--input {
        border: 0;
        padding: 1.2rem;
        width: 100%;
        &:focus {
          outline: 0;
        }
        &--red {
          background-color: #fd9090;
          border: 0;
          padding: 1.2rem;
          width: 100%;

          &:focus {
            outline: 0;
          }
        }
      }
      &--preview {
        display: flex;

        &--size {
          object-fit: cover;
          width: 100px;
        }
        &--exit {
          display: flex;
          margin-top: -3px;
          margin-left: -16px;
          font-size: 20px;
          color: #fd2d01;
          cursor: pointer;
        }
      }
    }
    &__download {
      display: flex;
      padding-top: 30px;
      height: 100%;
      margin-right: 3%;
      cursor: pointer;
      &--icon {
        font-size: 20px;
      }
    }
    &__sent {
      display: flex;
      padding-top: 30px;
      height: 100%;
      margin-right: 2%;
      cursor: pointer;
      &--icon {
        font-size: 20px;
      }
    }
  }
}

.publicationsGet {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  background-color: white;
  width: 100%;
  max-width: 800px;
  border-radius: 16px;

  box-shadow: 4px 5px 8px 4px #e4b5b5;
  padding: 10px;
  &__userInfos {
    display: flex;
    justify-content: space-between;

    overflow: hidden;
    border: solid 2px #ffd7d7;
    border-radius: 16px;

    width: 100%;
    &__profilImg {
      width: 10%;

      display: flex;
      overflow: hidden;

      &--size {
        width: 100%;
        object-fit: cover;
      }
    }
    &__info {
      flex-wrap: wrap;
      display: flex;
      padding-left: 2%;
      padding-right: 2%;
    }
  }
  &__publicationInfos {
    display: flex;
    flex-direction: column;
    margin-top: 2%;
    width: 100%;
    border-radius: 16px;

    overflow: hidden;
    &__attachment {
      display: flex;
      justify-content: center;
      width: 100%;

      &--size {
        height: 100%;
        max-width: 800px;
        max-height: 400px;
        object-fit: cover;
      }
    }
  }
  &__border {
    width: 100%;
    height: 20px;
    background-color: #ffd7d7;
    box-shadow: 0px 0px 12px -6px black inset;
    border-radius: 16px;
  }
  &__commentLike {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fd2d01;
      color: white;
      border-radius: 8px;
      font-weight: 800;
      font-size: 15px;
      border: none;
      max-height: 20px;
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
    &__delete {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fd2d01;

      padding: 16px;
      font-size: 30px;

      &--icon {
        cursor: pointer;
      }
    }
    &__comment {
      display: flex;
      flex-direction: column;
      width: 100%;

      &__send {
        display: flex;
        align-items: center;
        overflow: hidden;
        border: solid black;
        border-radius: 16px;

        width: 100%;
        &__photo {
          display: flex;
          width: 13%;
          height: 100%;
          overflow: hidden;
          &--img {
            width: 100%;
            max-height: 54px;
            object-fit: cover;
          }
        }
        &__icon {
          display: flex;
          height: 100%;
          padding-top: 25px;
          margin-left: 2%;
        }
        &__text {
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
          align-items: center;
          width: 100%;
          overflow: hidden;
          font-size: 2rem;
          margin-left: 2%;
          margin-right: 2%;

          &--input {
            border: 0;
            padding: 1.2rem;
            width: 100%;
            &:focus {
              outline: 0;
            }
          }
        }
        &__button {
          display: flex;
          padding-top: 30px;
          height: 100%;
          margin-right: 2%;
          cursor: pointer;
          &--icon {
            font-size: 20px;
          }
        }
      }
      &__for {
        display: flex;
        flex-direction: column;

        &__get {
          display: flex;
          overflow: hidden;
          background-color: whitesmoke;
          width: 70%;

          border-radius: 16px;
          margin-top: 10px;
          margin-left: 10px;
          gap: 2%;

          &__photo {
            height: 100%;
            display: flex;
            align-items: center;

            &--size {
              margin: 2px;
              border-radius: 50px;
              width: 60px;
              height: 60px;
            }
          }
          &__text {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-between;
            margin-right: 10px;
            &--icon {
              cursor: pointer;
              font-size: 20px;
              color: #fd2d01;
            }
          }
        }
      }
    }
  }
}
</style>
