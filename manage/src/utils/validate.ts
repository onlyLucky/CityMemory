import { ElMessage } from 'element-plus'

export const validateUsername = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('请输入账号'))
  }
  if (value.length < 3 || value.length > 20) {
    return callback(new Error('账号长度为3-20个字符'))
  }
  callback()
}

export const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  if (value.length < 6 || value.length > 20) {
    return callback(new Error('密码长度为6-20个字符'))
  }
  callback()
}

export const validateNickname = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('请输入昵称'))
  }
  if (value.length > 50) {
    return callback(new Error('昵称不能超过50个字符'))
  }
  callback()
}

export const validateProvince = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('请选择省份'))
  }
  callback()
}

export const validateRequired = (fieldName: string) => {
  return (rule: any, value: string, callback: any) => {
    if (!value) {
      return callback(new Error(`请输入${fieldName}`))
    }
    callback()
  }
}
