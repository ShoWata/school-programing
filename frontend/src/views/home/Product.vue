<template>
  <v-container>
    <template v-for="(item, index) in items">
      <template v-if="index == 0">
        <div :key="index">
          <h3 class="grey--text text--darken-2 px-8 pt-4">{{ item.subtitle }}</h3>
          <v-row>
            <v-col
              v-for="(card, index) in item.cards"
              :key="index+item.start"
              cols="6"
              sm="4"
              md="3"
            >
              <menu-card
                :open="card.open"
                :height="'300px'"
                :width="'225px'"
                :link="'/'+user+'/product/exp/'+String(index+1)"
                :title="'Product'"
                :subtitle="card.text"
                :lists="[]"
                :margin="'mb-9'"
              ></menu-card>
            </v-col>
          </v-row>
        </div>
      </template>
      <template v-else>
        <div :key="index">
          <h3 class="grey--text text--darken-2 px-8 pt-4">{{ item.subtitle }}</h3>
          <v-row>
            <v-col
              v-for="(card, index) in item.cards"
              :key="index+item.start"
              cols="6"
              sm="4"
              md="3"
            >
              <menu-card
                :open="card.open"
                :height="'300px'"
                :width="'225px'"
                :link="'/'+user+'/sample/'+String(item.start+index)"
                :title="'Product '+String(item.start+index)"
                :subtitle="card.text"
                :lists="[]"
                :margin="'mb-9'"
              ></menu-card>
            </v-col>
          </v-row>
        </div>
      </template>
    </template>
  </v-container>
</template>

<script>
import MenuCard from '@/components/layouts/home/MenuCard.vue'

export default {
  data () {
    return {
      user: null,
      items: [
        {
          subtitle: 'Productを作る前に',
          start: -1,
          cards: [
            { text: 'Productを作るに当たっての注意事項', open: false },
            { text: 'tkinterを使用したGUIアプリ', open: false }
          ]
        },
        {
          subtitle: '普通のアプリ',
          start: 1,
          cards: [
            { text: 'ダメダメtodoリスト', open: false },
            { text: '10秒で止めろ！', open: false },
            { text: 'スタートダッシュの覇者', open: false },
            { text: 'おみくじなの？', open: false },
            { text: 'カンニング単語帳', open: false },
            { text: '縛り強すぎしりとり', open: false },
            { text: '目指せ、ポジティブキング！', open: false },
            { text: 'パケットモンスター', open: false}
          ]
        },
        {
          subtitle: '画像編',
          start: 9,
          cards: [
            { text: '画像編集', open: false },
            { text: 'すげー、顔検出', open: false }
          ]
        },
        {
          subtitle: '音楽編',
          start: 11,
          cards: [
            { text: '音楽再生', open: false },
            { text: '簡易シンセサイザー', open: false }
          ]
        },
        {
          subtitle: '応用編',
          start: 13,
          cards: [
            { text: 'パズルゲーム', open: false },
            { text: 'インベーダーゲーム', open: false}
          ]
        }
      ]
    }
  },
  components: {
    'menu-card': MenuCard
  },
  created () {
    this.user = this.$store.getters.user.user
  }
}
</script>
