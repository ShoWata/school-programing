import fireauth from '@/firebase/fireauth'
import firestore from '@/firebase/firestore'
import router from '@/router'

const users = {
  state: {
    user: null
  },
  getters: {
    user (state) {
      if (state.user) return state.user
      return null
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      sessionStorage.setItem('user', JSON.stringify(user))
    }
  },
  actions: {
    setTeacherData ({ commit }, uid) {
      firestore.collection('teachers').doc(uid)
        .get().then(doc => {
          if (doc.exists) {
            const userData = { user: 'teacher', login: true, name: doc.data().name }
            commit('setUser', userData)

            router.push('/' + userData.user + '/home')
          } else {
            commit('setUser', null)
          }
        }).catch(err => {
          console.log(err)
        })
    },

    setStudentData ({ commit }, uid) {
      const getRef = firestore.collection('students').doc(uid)

      getRef.get().then(doc => {
        if (doc.exists) {
          var userData = {
            user: 'student',
            login: true,
            name: doc.data().name,
            //id: doc.data().groupID,
            members: doc.data().groupMembers,
            work: false,
            workPath: '',
            lesson: doc.data().overLesson,
            questions: []
          }
          commit('setUser', userData)
          router.push('/' + userData.user + '/home')

          getRef.collection('exercises').where('done', '==', true)
            .get().then(snapshot => {
              snapshot.forEach(doc => {
                if (doc.id[1] == String(userData.lesson+1)) {
                  userData.questions.push(doc.id)
                }
              })
              commit('setUser', userData)
            })
        } else {
          commit('setUser', null)
        }
      }).catch(err => {
        console.log(err)
      })
    },

    postStudentExerciseData ({ getters, dispatch }, { qID, done, code, items }) {
      var postData = { done: done }
      if (code) postData.code = code
      if (items) {
        postData.dragItems = items.dragItems
        postData.dropItems = items.dropItems
      }

      fireauth.onAuthStateChanged(user => {
        if (user) {
          const uid = fireauth.currentUser.uid
          const postRef = firestore.collection('students').doc(uid)

          postRef.set({ overLesson: getters.user.lesson }, { merge: true })
          postRef.collection('exercises').doc(qID)
            .set(postData, { merge: true })
            .catch(err => {
              console.log(err)
            })
        } else {
          setTimeout(() => {
            dispatch('postStudentExerciseData', {
              qID: qID,
              code: code,
              done: done,
              items: items
            })
          }, 1000)
        }
      })
    }
  }
}

export default users
