<template>
<div>
  <header><Vheader /></header>
   <main>
       <div class="box">
      <div class="card">
        <h1 class="card__title" v-if="mode == 'login'">Connexion</h1>
        <h1 class="card__title" v-else>Inscription</h1>
        <p class="card__subtitle" v-if="mode == 'login'">
          Tu n'as pas encore de compte ?
          <span class="card__action" @click="switchToCreateAccount()"
            >Créer un compte</span
          >
        </p>
        <p class="card__subtitle" v-else>
          Tu as déjà un compte ?
          <span class="card__action" @click="switchToLogin()"
            >Se connecter</span
          >
        </p>

<div v-if="mode == 'create'">
        <p v-if="errors.length">
    <b v-if="errors.length == 1">Veuillez corriger l'erreur suivante :</b>
    <b v-else>Veuillez corriger les erreurs suivantes :</b>
    <ul>
      <li class="red" v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </p>
</div>

<div v-if="mode == 'login'">
        <p v-if="errorsLogin.length">
    <b v-if="errorsLogin.length == 1">Veuillez corriger l'erreur suivante :</b>
    <b v-else>Veuillez corriger les erreurs suivantes :</b>
    <ul>
      <li class="red" v-for="error in errorsLogin" :key="error">{{ error }}</li>
    </ul>
  </p>
</div>
        
        
        
        <div
          class="form-row red"
          v-if="mode == 'create' && status == 'error_create'"
        >
          Adresse mail déjà utilisée
        </div>



        <div class="form-row" >
          <input
            v-model="email"
            class="form-row__input"
            type="text"
            placeholder="Adresse mail"
          />
        </div>
        


        <div class="form-row" v-if="mode == 'create'">
          <input
            v-model="username"
            class="form-row__input"
            type="text"
            placeholder="Nom d'utilisateur"
          />
        </div>
        <div class="form-row">
          <input
            v-model="password"
            class="form-row__input"
            type="password"
            placeholder="Mot de passe"
          />
        </div>
        <div class="form-row red" v-if="mode == 'login' && status == 'error_login'">
          Adresse mail et/ou mot de passe invalide
        </div>
        



        <div class="form-row">
          <button
            type="button"
            @click="login()"
            class="button"
            v-if="mode == 'login'"
          >
            <span v-if="status == 'loading'">Connexion en cours...</span>
            <span v-else>Connexion</span>
          </button>
          <button type="button" @click="createAccount()" class="button" v-else>
            <span v-if="status == 'loading'">Création en cours...</span>
            <span v-else>Créer mon compte</span>
          </button>
        </div>
      </div>
    </div>
    </main>
</div>  
   
  
</template>

<script>
// @ is an alias to /src
import Vheader from "@/components/Vheader.vue";
import { mapState } from 'vuex'

export default {
  name: "Login",
  components: {
    Vheader,
  },
  mounted: function () {
    let coUser = localStorage.getItem("user");
    coUser = JSON.parse(coUser);
    if(coUser != null) {
      this.$router.push(`/Profile`);
    }

  },
  data: function () {
    return {
      mode: "login",
      email: "",
      username: "",
      password: "",
      errors: [],
      errorsLogin: [],
    };
  },

  computed: {
    ...mapState(['status'])
  },

  methods: {
    switchToCreateAccount: function () {
      this.mode = "create";
    },
    switchToLogin: function () {
      this.mode = "login";
    },
    validEmail: function (email) {
      const regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regEmail.test(email);
    },
    validUsername: function (username) {
      const regUsername = /^[a-zA-Z]{2,}$/;
      return regUsername.test(username);
    },
    validPassword: function (password) {
      const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
      return regPassword.test(password);
    },

    login: function () {
      this.errorsLogin = [];

      if (!this.email) {
            this.errorsLogin.push("Merci de renseigner une adresse e-mail.");
          }
      if (!this.password) {
        this.errorsLogin.push("Merci de renseigner un mot de passe.");
      }

      if (!this.errorsLogin.length) {
        const self = this;
        
        this.$store.dispatch('login', {
          email: this.email,
          
          password: this.password
        }).then(function (response) {
          console.log(response.data.userId)
          
            
            self.$router.push(`/Profile`);
          
          
           
        }, function(error) {
            console.log(error);
        })
      }

    },
    createAccount: function () {
      this.errors = [];
      const self = this;
      if (!this.email) {
        this.errors.push("Merci de renseigner une adresse e-mail.");
      } else if (!this.validEmail(this.email)) {
        this.errors.push("Veuillez saisir une adresse e-mail valide.");
      }

      if (!this.username) {
        this.errors.push("Merci de renseigner un nom d'utilisateur.");
      } else if (!this.validUsername(this.username)) {
        this.errors.push("Veuillez saisir un nom d'au moins 2 caractères.");
      }

      if (!this.password) {
        this.errors.push("Merci de renseigner un mot de passe.");
      } else if (!this.validPassword(this.password)) {
        this.errors.push("Le mot de passe doit contenir au moins 8 caractères, 1 chiffre, 1 caractère minuscule, 1 caractère majuscule.");}

      

      if (!this.errors.length) {

        this.$store.dispatch('createAccount', {
          email: this.email,
          username: this.username,
          password: this.password
        }).then(function (response) {
          self.login();
            console.log(response);
        }, function(error) {
            console.log(error);
        })
      }

      




      

      
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: column;
  margin-top: 10%;

  align-items: center;
}

.card {
  display: flex;
  flex-direction: column;
  background-color: #ffd7d7;
  width: 100%;
  max-width: 600px;

  border-radius: 16px;

  &__title {
    font-family: "Roboto", sans-serif;
    font-weight: 700;

    margin-bottom: 0px;
  }
  &__subtitle {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
  }
  &__action {
    color: #fd2d01;
    font-weight: bold;
    text-decoration: underline;
    &:hover {
      cursor: pointer;
    }
  }
}
.form-row {
  display: flex;
  justify-content: center;

  margin: 16px 0px;
  padding-left: 15px;
  padding-right: 15px;
  gap: 16px;
  flex-wrap: wrap;
}
.form-row__input {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f2f2f2;
  font-weight: 500;
  font-size: 16px;
  flex: 1;
  min-width: 100px;
  color: black;
  &:hover {
    transform: scale(1.01) translate(-10px, -4px);
    box-shadow: 4px 5px 8px 4px #c7c7c7;
  }
}
.form-row__input::placeholder {
  color: #aaaaaa;
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
.red {
  color: red;
  font-family: "Roboto", sans-serif;
    font-weight: 700;
    text-align: left;
}
</style>
