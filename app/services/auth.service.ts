import useRequest from '@/plugins/axios'

export function AuthSignin(data) {
  return useRequest({
    url: '/api/v1/auth/signin',
    method: 'post',
    data
  })
}

export function AuthSignup(data) {
  return useRequest({
    url: '/api/v1/auth/signup',
    method: 'post',
    data
  })
}
