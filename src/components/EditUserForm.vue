<template>
  <div class="edit-user-form">
    <v-chip
      class="ma-2"
      id="user-activator"
      @click:on="openDialog"
      color="blue"
      text-color="white">
      <v-icon left>
        mdi-account-edit
      </v-icon>
      Edit profile
    </v-chip>
    <v-dialog
      v-model="dialog"
      activator="#user-activator">
      <v-card>
        <v-card-title>
          <span class="headline">ユーザー編集</span>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-icon color="red" @click="hideDialog" large>mdi-close-circle</v-icon>
          </v-card-actions>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    ref="name"
                    v-model="name"
                    label="名前"
                    :rules="[requiredNotEmpty]" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer>
            <v-btn
              class="white--text font-weight-bold"
              color="blue darken-1"
              @click="updateUser">
              Update profile
            </v-btn>
          </v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import { db } from '@/firebase/firestore.js'

  export default {
    props: {
      user: Object
    },
    data() {
      return {
        name: this.user.name,
        dialog: false
      };
    },
    methods: {
      async updateUser() {
        if (this.$refs.form.validate()) {
          db.collection('users')
            .doc(this.user.id)
            .update({
              name: this.name,
              updatedTime: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              console.log(`User ${this.name} was updateed.`);
              this.hideDialog();
            })
            .catch(err => {
              console.error(`Error occurd in updateUser: ${err}`);
            });
        } else {
          console.log('Error occurred on validation.');
          this.clear();
        }
      },
      requiredNotEmpty(value) {
        if (value == null) {
          return 'Required.';
        }
        //イベント名のみ入力必須項目
        const spaceRemoved = value.replace(/\s/g, '');
        if (!spaceRemoved) {
          return 'Required.';
        }
        return true;
      },
      // Formの初期化
      clear() {
        this.name = this.user.name;
      },
      // Formダイアログの表示
      openDialog() {
        this.dialog = true
      },
      // Formダイアログの非表示
      hideDialog() {
        this.clear();
        this.dialog= false;
      },
    }
  };
</script>
<style scoped>
</style>
