<template>
  <div class="login-container container-fluid">
    <img src="../assets/images/logo.svg" class="logo" alt="Zoopoly Logo">
    <form class="login-form" @submit.prevent="validateForm">  
      <div class="form-group">
        <input 
          type="text" 
          class="name-input" 
          v-model="name" 
          placeholder="Username"
          autocomplete="off"
        >
      </div>
      
      <div class="skin-selection">
        <div class="row justify-content-center">
          <div v-for="(skin, index) in skins" :key="skin.pathShort" class="skin-option">
            <input 
              :id="`skin-${index}`" 
              type="radio" 
              v-model="selectedSkin" 
              name="profileImg" 
              :value="index + 1"
            >
            <label :for="`skin-${index}`">
              <img width="150" :src="skin.pathLong" :alt="`Skin ${index + 1}`">
            </label>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button class="submit-button fa fa-check" type="submit" aria-label="Login"></button>
        
        <div v-if="errors.length" class="errors-container">
          <div class="container">
            <div class="row justify-content-center">
              <div class="error-box col-md-6">
                <div class="fa fa-close error-icon"></div>
                <ul class="d-flex flex-column">
                  <li class="align-self-center error-text" v-for="error in errors" :key="error">
                    {{ error }}
                  </li>
                </ul>
              </div>
            </div>    
          </div>      
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  
  props: {
    game: {
      type: Object,
      required: true
    },
    skins: {
      type: Array,
      required: true
    }
  },
  
  data() {
    return {
      errors: [],
      selectedSkin: null,
      name: null
    }
  },
  
  methods: {
    validateForm() {
      this.errors = [];
      let isValid = true;
      
      // Check for duplicate names
      if (this.game._pm._players.some(player => player._name === this.name)) {
        this.errors.push("This username is already taken!");
        isValid = false;
      }
      
      // Clean up and validate name
      if (this.name) {
        this.name = this.name.trim();
        if (this.name === "") {
          this.name = null;
        }
      }
      
      // Check required fields
      if (!this.name) {
        this.errors.push("Please enter a username!");
        isValid = false;
      }
      
      // Check game capacity
      if (this.game._pm._players.length === 4) {
        this.errors.push("Sorry, the game is full!");
        isValid = false;
      }
      
      // Check if game is already started
      if (this.game._isStarted) {
        this.errors.push("The game has already started!");
        isValid = false;
      }
      
      // Check if skin is selected
      if (!this.selectedSkin) {
        this.errors.push("Please select an avatar!");
        isValid = false;
      }
      
      // If all validations pass, emit login event
      if (isValid) {
        this.$emit('login', {
          name: this.name,
          skin: this.selectedSkin
        });
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  margin: 15px;
  margin-left: 0;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0px 0px 30px 10px white;
  border-radius: 5px;
  backdrop-filter: blur(6px);
  overflow-y: auto;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  height: 90vh;
  padding: 20px;
}

.login-container::-webkit-scrollbar {
  width: 15px;
  background-color: transparent;
  border-radius: 10px;
}

.login-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.35);
  border-radius: 40px;
}

.logo {
  margin-top: 15px;
  max-width: 300px;
}

.login-form {
  padding-top: 40px;
  margin-bottom: 40px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.name-input {
  text-align: center;
  font-size: 25px;
  font-weight: 800;
  border-radius: 10px;
  border: none;
  box-shadow: 0px 0px 5px 3px black;
  background: linear-gradient(to bottom right, #c0c0c0, #ffffff);
  transition: 0.4s;
  padding: 8px 20px;
  width: 100%;
  max-width: 400px;
}

.name-input::placeholder {
  font-weight: 500;
  opacity: 0.5;
}

.name-input:hover {
  box-shadow: 0px 0px 10px 5px black;
  background: linear-gradient(to bottom right, #ffffff, #c0c0c0);
}

.name-input:focus {
  outline: none;
  box-shadow: 0px 0px 10px 5px black;
  background: linear-gradient(to bottom right, #ffffff, #c0c0c0);
}

.skin-selection {
  margin: 30px 0;
  width: 100%;
}

.skin-option {
  display: inline-block;
  margin: 10px;
}

.submit-button {
  margin-top: 40px;
  border-radius: 50%;
  width: 90px;
  height: 90px;
  border: none;
  font-size: 60px;
  transition: 0.3s;
  background: linear-gradient(to bottom right, #ffffff, #acacac);
  box-shadow: 0px 0px 4px 2px black;
  color: black;
  cursor: pointer;
}

.submit-button:hover {
  background: linear-gradient(to bottom right, #00b400, #00ff00);
  box-shadow: 0px 0px 4px 2px white;
  color: white;
  transform: scale(1.05);
}

.submit-button:focus {
  outline: none;
}

[type="radio"] {
  display: none;
}

[type=radio] + label {
  cursor: pointer;
  margin: 10px;
  transition: 0.5s;
  border-radius: 10px;
  border: 5px solid white;
  display: block;
}

[type=radio]:checked + label {
  box-shadow: 0px 0px 10px 1px black;
  border-radius: 10px;
  background: linear-gradient(45deg, rgba(99, 99, 99, 0.5), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.0), rgba(255, 255, 255, 0.5), rgba(99, 99, 99, 0.5));
  transform: scale(1.1);
}

[type=radio]:hover + label {
  box-shadow: 0px 0px 10px 1px black;  
  border-radius: 10px;
}

.error-box {
  margin: 50px;
  padding: 20px 10px;
  justify-content: center;
  box-shadow: 0px 0px 14px 5px red;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 60px;
  color: red;
  margin-bottom: 20px;
}

.error-text {
  color: red;
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .login-container {
    margin: 5px;
    height: 95vh;
  }
  
  .name-input {
    font-size: 20px;
  }
  
  .skin-option {
    margin: 5px;
  }
  
  [type=radio] + label img {
    width: 100px;
  }
  
  .submit-button {
    width: 70px;
    height: 70px;
    font-size: 40px;
  }
  
  .error-box {
    margin: 30px 10px;
  }
  
  .error-icon {
    font-size: 40px;
  }
  
  .error-text {
    font-size: 16px;
  }
}
</style>
