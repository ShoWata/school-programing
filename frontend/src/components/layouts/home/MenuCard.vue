<template>
  <div>
    <template v-if="open">
      <v-hover v-slot="{ hover }">
        <v-card
          class="open-card d-flex flex-column py-4 px-4 mx-lg-4 mx-md-5 my-12"
          :elevation="hover ? 11 : 4"
          :height="height"
          style="max-width: 228px;"
          :to="link"
          :width="width"
        >
          <v-card-text>
            <h2 :class="'card-title text-center '+margin">{{ title }}</h2>

            <h4 class="card-subtitle text-center grey--text text--darken-2 mb-6">{{ subtitle }}</h4>

            <template v-if="lists.length !== 0">
              <p
                v-for="(list, index) in lists"
                class="card-list font-weight-bold mb-1"
                :key="index"
                style="font-size: 0.9em;"
              >・ {{ list }}</p>
            </template>
          </v-card-text>

          <v-spacer></v-spacer>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-icon color="yellow darken-2">mdi-lock-open-variant-outline</v-icon>

            <v-spacer></v-spacer>
          </v-card-actions>

          <v-fade-transition>
            <v-overlay
              v-if="hover"
              absolute
              color="#00695C"
            ><p class="font-weight-bold">Start Lesson!</p></v-overlay>
          </v-fade-transition>
        </v-card>
      </v-hover>
    </template>

    <template v-else>
      <v-card
        class="lock-card d-flex flex-column py-4 px-4 mx-lg-4 mx-md-5 my-12"
        :height="height"
        style="max-width: 228px;"
        :width="width"
      >
        <v-card-text>
          <h2 :class="'card-title text-center '+margin">{{ title }}</h2>

          <h4 class="card-subtitle text-center grey--text text--darken-2 mb-6">{{ subtitle }}</h4>

          <template v-if="lists.length !== 0">
            <p
              v-for="(list, index) in lists"
              class="card-list font-weight-bold mb-1"
              :key="index"
              style="font-size: 0.9em;"
            >・ {{ list }}</p>
          </template>
        </v-card-text>

        <v-spacer></v-spacer>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-icon color="blue lighten-1">mdi-lock-outline</v-icon>

          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    open: Boolean,
    height: String,
    width: String,
    link: String,
    title: String,
    subtitle: String,
    lists: Array,
    margin: String
  }
}
</script>

<style scoped>
.open-card {
  margin: auto;
  border: thin solid #58a9b6;
}
.lock-card {
  margin: auto;
}

.card-title, .card-subtitle, .card-list {
  font-family: YuGothic,'游ゴシック', sans-serif;
}
.card-title {
  font-size: 1.32em;
  letter-spacing: 0.03em;
  color: #58a9b6;
}
.card-subtitle {
  font-size: 1.04em;
  letter-spacing: 0.02em;
}
.card-list {
  font-size: 0.92em;
}
</style>
