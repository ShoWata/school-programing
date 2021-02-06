import fireauth from '@/firebase/fireauth'
import firestore from '@/firebase/firestore'
import router from '@/router'

const auth = {
  actions: {
    isAuthenticated ({ commit }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      if (!user) return
      commit('setUser', user)
    },

    async login ({ commit, dispatch }, account) {
      await fireauth.signInWithEmailAndPassword(
        account.email + '.com',
        account.password
      ).then(() => {
        const currentUser = fireauth.currentUser
        if (currentUser) {
          const uid = currentUser.uid
          currentUser.getIdTokenResult(true).then(idTokenResult => {
            if (idTokenResult.claims.premiumAdmin || idTokenResult.claims.admin) {
              const userData = { user: 'admin', login: true, name: 'admin' }
              commit('setUser', userData)
              router.push('/' + userData.user + '/home')
            } else if (idTokenResult.claims.teacher) {
              dispatch('setTeacherData', uid)
            } else {
              firestore.collection('students').doc(uid)
                .set({ login: true }, { merge: true })
                .catch(err => {
                  console.log(err)
                })
              dispatch('setStudentData', uid)
            }
          })
        }
      })
    },

    logout ({ commit, dispatch }, user) {
      if (user === 'student') {
        fireauth.onAuthStateChanged(user => {
          if (user) {
            const uid = fireauth.currentUser.uid
            firestore.collection('students').doc(uid)
              .set({ login: false }, { merge: true })
              .then(() => {
                fireauth.signOut().then(() => {
                  commit('setUser', null)
                  sessionStorage.clear()
                  window.location.href = '/'
                })
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            setTimeout(() => {
              dispatch('logout', user)
            }, 1000)
          }
        })
      } else {
        fireauth.signOut().then(() => {
          commit('setUser', null)
          sessionStorage.clear()
          window.location.href = '/'
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
}

export default auth
