<template>
  <div class="form py-8" id="form">
    <div
      id="select"
      class="px-6 py-2"
    >
      <v-form>
        <v-row>
          <v-col
            sm="12"
            md="3"
          >
            <v-select
              v-model="selects.lesson.select"
              :items="selects.lesson.items"
              @change="selectLesson"
              label="Lessonを選択"
              required
            ></v-select>
          </v-col>

          <template v-if="selects.explanation.items.length !== 0">
            <v-col
              sm="12"
              md="3"
            >
              <v-select
                v-model="selects.explanation.select"
                :items="selects.explanation.items"
                label="Explanationを選択"
              ></v-select>
            </v-col>

            <v-col
              sm="12"
              md="2"
            >
              <v-btn
                @click="read"
                color="#4badbd"
                dark
              >読み込む</v-btn>
            </v-col>
          </template>
        </v-row>
      </v-form>
    </div>

    <div
      id="addExplanation"
      class="px-6 py-2"
    >
      <v-row>
        <v-col
          sm="12"
          md="3"
        >
          <p
            v-if="selects.lesson.select"
            class="title font-weight-bold text-center text--h2"
          >{{ selects.lesson.select }}の</p>

          <p
            v-else
            class="title font-weight-bold text-center text--h2"
          >Lesson1の</p>
        </v-col>

        <v-col
          sm="12"
          md="3"
        >
          <p
            v-if="selects.explanation.items.length !== 0"
            class="title font-weight-bold text-center text--h2"
          >Explanation{{ String(selects.explanation.items.length + 1) }}の</p>

          <p
            v-else
            class="title font-weight-bold text-center text--h2"
          >Explanation1</p>
        </v-col>

        <v-col
          sm="12"
          md="3"
        >
          <v-btn
            @click="startAddExplanation"
            color="#4badbd"
            dark
          >追加する</v-btn>
        </v-col>
      </v-row>
    </div>

    <v-divider class="mb-8"></v-divider>

    <h3
      v-if="addData"
      class="ml-12 mb-9"
    >追加するContentを編集してください！</h3>

    <div
      id="titleEditor"
      class="mb-8 px-12"
    >
      <h3 class="mb-4">タイトルの編集</h3>

      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="title.current"
            label="タイトルを入力"
            clearable
          ></v-text-field>
        </v-col>

        <v-col
          sm="12"
          md="6"
        >
          <v-btn
            @click="resetTitle"
            color="#4badbd"
            dark
            large
          >戻す</v-btn>
        </v-col>
      </v-row>
    </div>

    <div class="px-6">
      <h3 class="mb-4">Contentの編集</h3>

      <v-row>
        <v-col cols="6">
          <v-select
            v-model="content.id"
            :items="content.items"
            label="idを選択"
            required
          ></v-select>
        </v-col>

        <v-col cols="6">
          <v-btn
            @click="readContent"
            class="mr-3"
            color="#4badbd"
            dark
          >読み込む</v-btn>

          <v-btn
            @click="updateContent"
            class="mx-3"
            color="#4badbd"
            dark
          >更新する</v-btn>

          <v-btn
            @click="addContent"
            class="mx-3"
            color="#4badbd"
            dark
          >追加する</v-btn>

          <v-btn
            @click="removeContent"
            class="mx-3"
            color="#4badbd"
            dark
            large
          >削除</v-btn>
        </v-col>
      </v-row>

      <div
        id="image"
        class="px-10 py-5"
      >
        <h4 class="mb-4">画像</h4>

        <v-row>
          <v-col
            sm="12"
            md="6"
          >
            <v-file-input
              v-model="image.inputImage"
              @change="onImagePicked"
              accept="image/"
              sho-size
              label="変更する画像を選んでください"
              filled
              prepend-icon="mdi-camera"
            ></v-file-input>
          </v-col>

          <v-col
            sm="12"
            md="6"
          >
            <div class="btn text-center">
              <v-btn
                @click="resetImage"
                color="#4badbd"
                class="mr-7"
                dark
                large
              >戻す</v-btn>

              <v-btn
                @click="uploadImage"
                color="#4badbd"
                dark
                class="mx-7"
                large
              >反映させる</v-btn>

              <v-btn
                @click="uploadTentativeImage"
                color="#4badbd"
                dark
                class="ml-7"
                large
              >仮の画像</v-btn>
            </div>
          </v-col>
        </v-row>

        <img
          v-if="image.uploadImageURL"
          :src="image.uploadImageURL"
          class="imageBox"
        >
      </div>

      <div
        id="codeEditor"
        class="mb-8 px-12"
      >
        <h3 class="mb-4">コードの編集</h3>

        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="code.id"
              label="コードのidを入力"
              clearable
            ></v-text-field>

            <v-btn
              @click="readCode"
              class="mr-3"
              color="#4badbd"
              dark
            >読み込む</v-btn>

            <v-btn
              @click="updateCode"
              class="mx-3"
              color="#4badbd"
              dark
            >更新する</v-btn>

            <v-btn
              @click="addCode"
              class="mx-3"
              color="#4badbd"
              dark
            >追加する</v-btn>

            <v-btn
              @click="resetCode"
              class="ml-3"
              color="#4badbd"
              dark
              large
            >戻す</v-btn>
          </v-col>

          <v-col cols="6">
            <div
              id="editor"
              class="mb-6"
            >
              <editor
                ref="editor"
                :code="code.code"
                :idName="'python-editor'"
                style="width: 100%; height: 500px;"
              ></editor>
            </div>
          </v-col>

          <template v-if="content.codes.length > 0">
            <v-col
              v-for="(code, index) in content.codes"
              :key="index"
              cols="6"
            >
              <p class="text-center font-weight-bold">サンプルコード{{ index + 1 }} id：{{ index }}</p>

              <highlight :recievedCode="code"></highlight>
            </v-col>
          </template>
        </v-row>
      </div>

      <div
        id="tableEditor"
        class="px-12 py-6"
      >
        <h3 class="mb-8">表の編集</h3>

        <v-row>
          <v-col cols="6">
            <div
              id="editor"
              class="mb-6"
            >
              <v-textarea
                v-model="content.table"
                filled
                height="400px"
              ></v-textarea>
            </div>
          </v-col>

          <v-col cols="6">
            <markdown :markdownText="content.table"></markdown>
          </v-col>

          <v-col cols="6">
            <v-btn
              @click="resetTable"
              color="#4badbd"
              dark
              large
            >戻す</v-btn>
          </v-col>
        </v-row>
      </div>

      <div
        id="textEditor"
        class="px-12 py-6"
      >
        <h3 class="mb-8">説明文の編集</h3>

        <v-row>
          <v-col cols="6">
            <div
              id="editor"
              class="mb-6"
            >
              <v-textarea
                v-model="content.text"
                filled
                height="400px"
              ></v-textarea>
            </div>
          </v-col>

          <v-col cols="6">
            <markdown :markdownText="content.text"></markdown>
          </v-col>

          <v-col cols="6">
            <v-btn
              @click="resetText"
              color="#4badbd"
              dark
              large
            >戻す</v-btn>
          </v-col>
        </v-row>
      </div>
    </div>

    <div
      id="pathEditor"
      class="px-12 py-6"
    >
      <h3 class="mb-8">Pathとボタン名の編集</h3>

      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="nextPath"
            label="次のPathを入力"
            clearable
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="btnText"
            label="次のページに進むボタン名の入力"
            clearable
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="backPath"
            label="スライドに戻るPathを入力"
            clearable
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-btn
            @click="resetPath"
            color="#4badbd"
            dark
            large
          >戻す</v-btn>
        </v-col>
      </v-row>
    </div>

    <div class="btn text-center">
      <v-btn
        @click="startImageDialog"
        color="#4badbd"
        class="mx-7"
        dark
        large
      >画像のみを{{ textBtn }}</v-btn>

      <v-btn
        @click="startDataDialog"
        color="#4badbd"
        class="mx-7"
        dark
        large
      >データのみを{{ textBtn }}</v-btn>
    </div>

    <v-dialog
      v-model="dialog.open"
      height="300px"
      width="300px"
    >
      <v-card
        v-if="!dialog.success"
        class="elevation-2 py-4 px-6"
        rounded="lg"
      >
        <p
          v-if="dialog.msg"
          class="text-center my-6 font-weight-bold"
        >{{ dialog.msg }}</p>

        <p
          v-if="dialog.errMsg"
          class="text-center my-6 font-weight-bold red--text"
        >{{ dialog.errMsg }}</p>

        <v-card-actions
          v-if="dialog.uploadImage"
          class="mt-5"
        >
          <v-spacer></v-spacer>

          <v-btn
            @click="postImage"
            color="#4badbd"
            dark
            depressed
          >{{ textBtn }}する</v-btn>

          <v-spacer></v-spacer>
        </v-card-actions>

        <v-card-actions
          v-if="dialog.uploadData"
          class="mt-5"
        >
          <v-spacer></v-spacer>

          <v-btn
            @click="postData"
            color="#4badbd"
            dark
            depressed
          >{{ textBtn }}する</v-btn>

          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>

      <v-card
        v-if="dialog.success"
        class="elevation-2 py-4 px-6"
        rounded="lg"
      >
        <p class="text-center my-6 font-weight-bold red--text">{{ textBtn }}しました</p>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import firestore from '@/firebase/firestore'
import storage from '@/firebase/storage'
// import ExpWindow from '@/components/layouts/study/ExpWindow.vue'
import Editor from '@/components/functions/editor/Editor.vue'
import Markdown from '@/components/functions/Markdown.vue'
import Highlight from '@/components/functions/syntax-highlight/Highlight.vue'

export default {
  data () {
    return {
      selects: {
        lesson: {
          items: [],
          select: null
        },
        explanation: {
          items: [],
          select: null
        }
      },
      addData: false,
      title: {
        init: '',
        current: ''
      },
      contents: [],
      content: {
        items: [],
        id: null,
        imageURL: '',
        codes: [],
        table: '',
        text: ''
      },
      code: {
        id: 0,
        code: ''
      },
      image: {
        inputImage: null,
        uploadImageURL: ''
      },
      page: {},
      backPath: '',
      nextPath: '',
      btnText: '',
      textBtn: '更新',
      dialog: {
        open: false,
        uploadData: false,
        uploadImage: false,
        msg: '',
        btn: '',
        success: false,
        errMsg: ''
      }
    }
  },
  components: {
    // 'exp-window': ExpWindow,
    Markdown,
    Editor,
    Highlight
  },
  created () {
    for (var i = 0; i < 8; i++) {
      this.selects.lesson.items.push('lesson' + String(i + 1))
    }
  },
  methods: {
    selectLesson () {
      this.selects.explanation.select = ''
      this.selects.explanation.items = []
      firestore.collection('lessons').doc(this.selects.lesson.select).collection('explanations').get().then(snapshot => {
        snapshot.forEach(doc => {
          this.selects.explanation.items.push(doc.id)
        })
      })
    },

    read () {
      this.initialize()
      this.addData = false
      const ref = firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('explanations').doc(this.selects.explanation.select)

      ref.get().then(doc => {
        this.title.current = doc.data().title
        this.title.init = doc.data().title
        this.contents = doc.data().contents
        this.page = doc.data().page
        this.backPath = doc.data().page.backPath
        this.nextPath = doc.data().page.nextPath
        this.btnText = doc.data().page.btnText

        for (var i = 0; i < this.contents.length; i++) {
          this.content.items.push(i)
        }
      })
    },

    initialize () {
      this.addData = true
      this.title.current = ''
      this.title.init = ''
      this.page = {}
      this.backPath = ''
      this.nextPath = ''
      this.btnText = ''
      this.contents = []
      this.content.imageURL = ''
      this.content.codes = []
      this.content.tabel = ''
      this.content.text = ''
      this.code.code = ''
      this.code.id = 0
      this.textBtn = '追加'
    },

    startAddExplanation () {
      const len = this.selects.explanation.items.length

      this.selects.explanation.select = 'explanation' + String(len + 1)
      this.selects.content.select = 'content1'

      this.initialize()
    },

    resetTitle () {
      this.title.current = this.title.init
    },

    readContent () {
      this.content.imageURL = this.contents[parseInt(this.content.id)].imageURL
      this.content.codes = this.contents[parseInt(this.content.id)].codes
      this.content.table = this.contents[parseInt(this.content.id)].table
      this.content.text = this.contents[parseInt(this.content.id)].text
    },

    updateContent () {
      this.contents[parseInt(this.content.id)].imageURL = this.content.imageURL
      this.contents[parseInt(this.content.id)].codes = this.content.codes
      this.contents[parseInt(this.content.id)].table = this.content.table
      this.contents[parseInt(this.content.id)].text = this.content.text
    },

    addContent () {
      this.contents.push(this.content)
    },

    removeContent () {
      this.contents.splice(this.content.id, 1)
    },

    onImagePicked (file) {
      if (file !== undefined && file !== null) {
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.addEventListener('load', () => {
          this.image.uploadImageURL = fr.result
        })
      } else {
        this.image.uploadImageURL = this.image.imageURL
      }
      console.log(this.image.inputImage)
    },

    resetImage () {
      this.image.uploadImageURL = this.contents[this.content.id].imageURL
      this.image.imageURL = this.contents[this.content.id].imageURL
    },

    uploadImage () {
      this.image.imageURL = this.image.uploadImageURL
    },

    uploadTentativeImage () {
      this.image.imageURL = 'https://picsum.photos/700/500'
    },

    readCode () {
      this.code.code = this.content.codes[Number(this.code.id)]
    },

    updateCode () {
      this.code.code = this.$refs.editor.getCode()
      this.content.codes[Number(this.code.id)] = this.code.code
    },

    addCode () {
      this.code.code = this.$refs.editor.getCode()
      this.content.codes.push(this.code.code)
    },

    resetCode () {
      this.content.codes = this.contents[this.contents.id].codes
    },

    resetText () {
      this.content.text = this.contents[this.contents.id].text
    },

    resetTable () {
      this.content.table = this.contents[this.contents.id].table
    },

    resetPath () {
      this.nextPath = this.page.nextPath
      this.btnText = this.page.btnText
      this.backPath = this.page.backPath
    },

    startImageDialog () {
      if (this.image.inputImage || this.image.imageURL) {
        this.dialog.open = true
        this.dialog.uploadImage = true
        this.dialog.uploadData = false
        this.dialog.msg = '本当に画像を' + this.textBtn + 'してもよろしいでしょうか?'
      } else {
        this.dialog.open = true
        this.dialog.msg = '画像が選択されていません！'
        this.dialog.uploadImage = false
        this.dialog.uploadData = false
        setTimeout(() => {
          this.dialog.open = false
        }, 2000)
      }
    },

    startDataDialog () {
      this.dialog.open = true
      this.dialog.uploadData = true
      this.dialog.uploadImage = false
      this.dialog.msg = '本当にデータを' + this.textBtn + 'してもよろしいでしょうか?'
    },

    postImage () {
      const ref = firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('explanations').doc(this.selects.explanation.select)
        .collection('contents').doc(this.selects.content.select)

      if (this.imageURL === 'https://picsum.photos/700/500') {
        ref.set({ imageURL: this.image.imageURL }, { merge: true }).then(() => {
          this.dialog.success = true
          this.dialog.uploadImage = false
          this.dialog.uploadData = false
          setTimeout(() => {
            this.dialog.open = false
            this.dialog.success = false
          }, 2000)
        })
      } else {
        const storageRef = storage.ref().child('images/lessons/' + this.selects.lesson.select + '/' + this.inputImage.name)

        storageRef.put(this.inputImage).then(() => {
          storageRef.getDownloadURL().then(url => {
            ref.set({ imageURL: url }, { merge: true }).then(() => {
              this.dialog.success = true
              this.dialog.uploadImage = false
              this.dialog.uploadData = false
              setTimeout(() => {
                this.dialog.open = false
                this.dialog.success = false
              }, 2000)
            })
          }).catch(err => {
            console.log(err)
            this.dialog.errMsg = this.textBtn + 'できませんでした。もう一度お願いします。'
          })
        }).catch(err => {
          console.log(err)
          this.dialog.errMsg = this.textBtn + 'できませんでした。もう一度お願いします。'
        })
      }
    },

    postData () {
      const ref = firestore.collection('lessons').doc(this.selects.lesson.select)
        .collection('explanations').doc(this.selects.explanation.select)

      ref.set({
        title: this.title.current,
        page: {
          backPath: this.backPath,
          nextPath: this.nextPath,
          btnText: this.btnText
        },
        contents: this.contents
      }, { merge: true }).then(() => {
        console.log('Docuemnts successfully written')

        this.dialog.success = true
        this.dialog.uploadImage = false
        this.dialog.uploadData = false
        setTimeout(() => {
          this.dialog.open = false
          this.dialog.success = false
        }, 2000)
      }).catch(error => {
        console.error('Error wrtiting documents: ', error)
      })
    }
  }
}
</script>

<style scoped>
.v-application code {
  all: unset;
}
pre {
  font-family: Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;
  background-color: #f5f2f0;
  border-radius: 10px;
  padding: 20px 30px;
}
.token.operator {
  background-color: #f5f2f0;
}
.imageBox {
  max-height: 500px;
  max-width: 700px;
}
</style>
