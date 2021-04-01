<template>
  <div id="login">
    <h1>Login</h1>
    <el-card style="margin: 0.5rem 0 3rem 0;">
      <div style="padding: 0 1rem;">
        <el-form :model="form" :rules="rules" ref="formRef" :hide-required-asterisk="true">
          <el-form-item label="Username" prop="username">
            <el-input v-model="form.username" placeholder="CASS ID"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="form.password" placeholder="********" type="password" @keyup.enter="submitForm"></el-input>
          </el-form-item>
        </el-form>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0 0.5rem 0;">
          <el-button type="primary" @click="submitForm">Login</el-button>
          <i class="el-icon-info info"></i>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const formRef = ref(null)

    const form = ref({
      username: '',
      password: ''
    })

    const rules = ref({
      username: [{
        required: true,
        message: 'Please enter your CASS ID',
        trigger: 'change'
      }],
      password: [{
        required: true,
        message: 'Please enter password',
        trigger: 'change'
      }]
    })

    const fetchLogin = () => {
      fetch('./login', {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: form.value.username
        })
      }).then( async res => {
        const response = await res.json()
        router.push({ name: 'Home' })
        
      })
    }
    
    const submitForm = () => {
      const temp = formRef.value as any
      temp.validate((valid: boolean) => {
        if(valid) {
          fetchLogin()
        } else {
          return false
        }
      })
    }

    return {
      formRef,
      form,
      rules,
      submitForm
    }
  },
})
</script>

<style>
#login {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0;
  margin: 0;
}

.is-no-asterisk > label{
  font-weight: 700;
}
.is-no-asterisk > .el-form-item__content {
  width: 300px;
}
.info {
  font-size: 20px;
  cursor: pointer;
  color: #409EFF;
}
</style>