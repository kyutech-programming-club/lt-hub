<template>
  <div>
    <v-dialog v-model="dialog" width="80%">
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          v-on="on"
        >
          mdi-help-circle-outline
        </v-icon>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">スライドの公開方法について</span>
        </v-card-title>
        <template>
          <div align="left" class="ma-5">
            <h3>1.Googleドライブにスライドをアップロード</h3><br><br>
            <h3>2.該当スライドを右クリックしアプリで開くからGoogleスライドを選択</h3><br>
              <v-container fluid>
                <v-img src="@/assets/silde_modal/2020-07-11_23h34_20.png"></v-img>
              </v-container><br>
            <h3>3.ファイル＞ウェブに公開を選択し公開ボタンを押す</h3><br>
              <v-container fluid>
                <v-img src="@/assets/silde_modal/2020-07-11_23h34_47.png"></v-img>
              </v-container><br>
            <h3>4.作成されたリンクをLT-hub上のスライドURLの欄にコピペ</h3><br>
              <v-container fluid>
                <v-img src="@/assets/silde_modal/2020-07-11_23h35_04.png"></v-img>
              </v-container><br>
          </div>
      </template>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
    }
  },
}
</script>

<style scoped>
</style>
